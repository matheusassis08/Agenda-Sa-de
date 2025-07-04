import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.100.8:3001'; // Use o seu IP local

export default function ConfirmarConsultasScreen({ userData }) {
  const [pendentes, setPendentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Função para buscar as consultas pendentes
  const fetchPendentes = async () => {
    setLoading(true);
    try {
      // Esta rota precisa de autenticação, então enviamos o token
      const config = {
        headers: { Authorization: `Bearer ${userData.token}` }
      };
      const response = await axios.get(`${API_URL}/consultas/pendentes`, config);
      setPendentes(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as solicitações pendentes.');
      console.error("Erro ao buscar pendentes:", error.response?.data || error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPendentes();
  }, []);

  // Função para o coordenador confirmar ou rejeitar uma consulta
  const handleAction = async (action, consultaId) => {
    // 'action' pode ser 'confirmar' ou 'rejeitar'
    const rota = action === 'confirmar' ? 'confirmar' : 'rejeitar';
    const mensagemSucesso = `Consulta ${action === 'confirmar' ? 'confirmada' : 'rejeitada'} com sucesso!`;

    try {
      const config = { headers: { Authorization: `Bearer ${userData.token}` } };
      await axios.post(`${API_URL}/consultas/${rota}/${consultaId}`, {}, config);
      
      Alert.alert('Sucesso', mensagemSucesso);
      // Atualiza a lista removendo a consulta que foi tratada
      setPendentes(prev => prev.filter(p => p._id !== consultaId));
    } catch (error) {
      Alert.alert('Erro', `Não foi possível executar a ação.`);
      console.error(`Erro ao ${action}:`, error.response?.data || error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>Cliente: <Text style={{fontWeight: 'bold'}}>{item.cliente?.nome || 'N/A'}</Text></Text>
      <Text style={styles.itemText}>Aluno(a): {item.aluno?.nome || 'N/A'}</Text>
      <Text style={styles.itemText}>Data: {new Date(item.dataHora).toLocaleString('pt-BR')}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={() => handleAction('confirmar', item._id)}>
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => handleAction('rejeitar', item._id)}>
          <Text style={styles.buttonText}>Rejeitar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerir Solicitações</Text>
      <FlatList
        data={pendentes}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text style={styles.subtitle}>Nenhuma solicitação pendente.</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPendentes} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, paddingHorizontal: 16, backgroundColor: '#f7f7f7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 20 },
  item: { padding: 15, marginVertical: 8, backgroundColor: '#fff', borderRadius: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  itemText: { fontSize: 16, marginBottom: 5 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 15 },
  button: { paddingVertical: 10, borderRadius: 5, flex: 0.45, alignItems: 'center' },
  confirmButton: { backgroundColor: '#2ecc71' },
  cancelButton: { backgroundColor: '#e74c3c' },
  buttonText: { color: 'white', fontWeight: 'bold' }
});
