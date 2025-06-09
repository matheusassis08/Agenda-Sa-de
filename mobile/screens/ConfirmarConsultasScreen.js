// mobile/screens/ConfirmarConsultasScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.0.127:3001';

export default function ConfirmarConsultasScreen() {
  const [pendentes, setPendentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPendentes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/consultas/pendentes`);
      setPendentes(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as solicitações.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPendentes();
  }, []);

  const handleAction = async (action, consultaId) => {
    try {
      await axios.post(`${API_URL}/consultas/${action}/${consultaId}`);
      Alert.alert('Sucesso', `Consulta ${action === 'confirmar' ? 'confirmada' : 'cancelada'}!`);
      fetchPendentes(); // Atualiza a lista
    } catch (error) {
      Alert.alert('Erro', `Não foi possível executar a ação.`);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>Cliente: <Text style={{fontWeight: 'bold'}}>{item.cliente.nome}</Text></Text>
      <Text style={styles.itemText}>Aluno(a): {item.aluno.nome}</Text>
      <Text style={styles.itemText}>Data: {new Date(item.dataHora).toLocaleString('pt-BR')}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={() => handleAction('confirmar', item._id)}>
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => handleAction('cancelar', item._id)}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Solicitações</Text>
      {loading ? <ActivityIndicator size="large" /> : (
        <FlatList
          data={pendentes}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={<Text style={styles.subtitle}>Nenhuma solicitação pendente.</Text>}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchPendentes} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, paddingHorizontal: 16, backgroundColor: '#f7f7f7' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 20 },
  item: { padding: 15, marginVertical: 8, backgroundColor: '#fff', borderRadius: 8, elevation: 2 },
  itemText: { fontSize: 16, marginBottom: 5 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 15 },
  button: { padding: 10, borderRadius: 5, flex: 0.45, alignItems: 'center' },
  confirmButton: { backgroundColor: '#2ecc71' },
  cancelButton: { backgroundColor: '#e74c3c' },
  buttonText: { color: 'white', fontWeight: 'bold' }
});