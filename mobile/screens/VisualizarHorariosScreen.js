import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.0.127:3001'; // Use seu IP local

const HorarioItem = ({ item }) => (
  <View style={styles.itemContainer}>
    <Text style={styles.itemTitle}>Aluno: {item.aluno?.nome || 'Não especificado'}</Text>
    <Text style={styles.itemText}>
      Data: {new Date(item.dataHora).toLocaleDateString('pt-BR')}
    </Text>
    <Text style={styles.itemText}>
      Hora: {new Date(item.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
    </Text>
    <View style={[styles.statusBadge, { backgroundColor: '#f1c40f' }]}>
      <Text style={styles.statusText}>{item.status}</Text>
    </View>
  </View>
);

export default function VisualizarHorariosScreen() {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHorarios = async () => {
    const tokenCoordenador = "COLE_SEU_TOKEN_DE_COORDENADOR_AQUI"; // <-- COLE O TOKEN AQUI
    try {
      const response = await axios.get(`${API_URL}/consultas/disponiveis`, {
        headers: { 'Authorization': `Bearer ${tokenCoordenador}` }
      });
      setHorarios(response.data);
    } catch (error) {
      console.error("Erro ao buscar horários:", error.response?.data);
      alert('Não foi possível buscar os horários disponíveis.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHorarios();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHorarios();
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Horários Disponíveis</Text>
      {horarios.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum horário disponível no momento.</Text>
      ) : (
        <FlatList
          data={horarios}
          renderItem={({ item }) => <HorarioItem item={item} />}
          keyExtractor={item => item._id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 16 },
  itemContainer: { backgroundColor: 'white', padding: 16, marginVertical: 8, borderRadius: 8, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.22, shadowRadius: 2.22 },
  itemTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  itemText: { fontSize: 14, color: '#555' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginTop: 8 },
  statusText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'gray' },
});