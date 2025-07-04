import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.100.8:3001'; // Use o seu IP local

const getStatusStyle = (status) => {
  switch (status) {
    case 'confirmada': return { backgroundColor: '#2ecc71', text: 'Confirmada' };
    case 'pendente': return { backgroundColor: '#f1c40f', text: 'Aguardando Confirmação' };
    default: return { backgroundColor: '#95a5a6', text: status };
  }
};

export default function MinhasConsultasScreen({ userData }) {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMinhasConsultas = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userData.token}` } };
      const response = await axios.get(`${API_URL}/consultas/cliente`, config);
      setConsultas(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as suas consultas.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchMinhasConsultas(); }, []);

  const handleCancelarConsulta = (id) => {
    Alert.alert("Cancelar Consulta", "Tem certeza que deseja cancelar este agendamento?", [
      { text: "Voltar", style: "cancel" },
      { text: "Sim, Cancelar", onPress: async () => {
          try {
            const config = { headers: { Authorization: `Bearer ${userData.token}` } };
            await axios.put(`${API_URL}/consultas/cancelar/cliente/${id}`, {}, config);
            Alert.alert('Sucesso', 'A sua consulta foi cancelada.');
            fetchMinhasConsultas(); // Atualiza a lista
          } catch (error) {
            Alert.alert('Erro', error.response?.data?.message || 'Não foi possível cancelar.');
          }
      }, style: 'destructive' }
    ]);
  };

  const renderItem = ({ item }) => {
    const statusInfo = getStatusStyle(item.status);
    return (
      <View style={styles.item}>
        <Text style={styles.itemTitle}>Atendimento com: {item.aluno.nome}</Text>
        <Text style={styles.itemText}>Data: {new Date(item.dataHora).toLocaleString('pt-BR')}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.backgroundColor }]}>
          <Text style={styles.statusText}>{statusInfo.text}</Text>
        </View>
        {(item.status === 'pendente' || item.status === 'confirmada') && (
          <TouchableOpacity style={styles.cancelButton} onPress={() => handleCancelarConsulta(item._id)}>
            <Text style={styles.buttonText}>Cancelar Agendamento</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  
  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Agendamentos</Text>
      <FlatList
        data={consultas}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text style={styles.emptyText}>Você não possui agendamentos.</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchMinhasConsultas} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    emptyText: { textAlign: 'center', marginTop: 30, fontSize: 16, color: 'gray' },
    item: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginVertical: 8, elevation: 2 },
    itemTitle: { fontSize: 18, fontWeight: '600' },
    itemText: { fontSize: 16, color: '#555', marginTop: 4 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15, alignSelf: 'flex-start', marginTop: 10 },
    statusText: { color: 'white', fontWeight: 'bold' },
    cancelButton: { backgroundColor: '#e74c3c', padding: 10, borderRadius: 5, marginTop: 15, alignItems: 'center' },
    buttonText: { color: 'white', fontWeight: 'bold' }
});
