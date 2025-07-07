import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.1.80:3001';

export default function ConfirmarConsultasScreen({ userData, atualizarResumo }) {
  const [pendentes, setPendentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPendentes = async () => {
    setLoading(true);
    try {
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

  const handleAction = async (action, consultaId) => {
    const rota = action === 'confirmar' ? 'confirmar' : 'rejeitar';
    const mensagemSucesso = `Consulta ${action === 'confirmar' ? 'confirmada' : 'rejeitada'} com sucesso!`;

    try {
      const config = { headers: { Authorization: `Bearer ${userData.token}` } };
      await axios.post(`${API_URL}/consultas/${rota}/${consultaId}`, {}, config);
      Alert.alert('Sucesso', mensagemSucesso);
      setPendentes(prev => prev.filter(p => p._id !== consultaId));

      if (typeof atualizarResumo === 'function') {
        atualizarResumo(); // 👈 atualiza dados da tela inicial
      }
    } catch (error) {
      Alert.alert('Erro', `Não foi possível executar a ação.`);
      console.error(`Erro ao ${action}:`, error.response?.data || error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>Cliente: <Text style={{ fontWeight: 'bold' }}>{item.cliente?.nome || 'N/A'}</Text></Text>
      <Text style={styles.itemText}>Aluno(a): {item.aluno?.nome || 'N/A'}</Text>
      <Text style={styles.itemText}>Data: {new Date(item.dataHora).toLocaleString('pt-BR')}</Text>

      <Text style={[styles.itemText, { marginTop: 10, fontWeight: 'bold' }]}>Motivo do Agendamento:</Text>
      <Text style={[styles.motivoText]}>
        {item.motivo?.trim() ? item.motivo : <Text style={{ fontStyle: 'italic', color: '#888' }}>Não informado.</Text>}
      </Text>

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
  item: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5
  },
  itemText: { fontSize: 16, marginBottom: 5 },
  motivoText: { fontSize: 15, color: '#444', marginBottom: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 },
  button: { paddingVertical: 10, borderRadius: 5, flex: 0.45, alignItems: 'center' },
  confirmButton: { backgroundColor: '#2ecc71' },
  cancelButton: { backgroundColor: '#e74c3c' },
  buttonText: { color: 'white', fontWeight: 'bold' }
});



