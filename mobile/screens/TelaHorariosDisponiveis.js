import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.100.8:3001'; // Use o seu IP local

export default function TelaHorariosDisponiveis({ userData }) {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHorarios = async () => {
    try {
      const response = await axios.get(`${API_URL}/consultas/disponiveis`);
      setHorarios(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os horários.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchHorarios(); }, []);

  const handleAgendamento = (consultaId) => {
    Alert.alert("Confirmar Pré-Agendamento", "Deseja enviar a solicitação para este horário?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sim, solicitar",
        onPress: async () => {
          try {
            const payload = { clienteId: userData.id };
            await axios.put(`${API_URL}/consultas/agendar/${consultaId}`, payload);
            Alert.alert('Sucesso!', 'Seu pedido de agendamento foi enviado para aprovação.');
            fetchHorarios();
          } catch (error) {
            Alert.alert('Erro', error.response?.data?.message || "Não foi possível agendar.");
          }
        }
      }
    ]);
  };

  const onRefresh = () => { setRefreshing(true); fetchHorarios(); };
  
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleAgendamento(item._id)}>
      <Text style={styles.nome}>Atendimento com: {item.aluno?.nome || 'N/A'}</Text>
      <Text style={styles.data}>Data: {new Date(item.dataHora).toLocaleDateString('pt-BR')}</Text>
      <Text style={styles.data}>Horário: {new Date(item.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
      <View style={styles.button}><Text style={styles.buttonText}>Solicitar Horário</Text></View>
    </TouchableOpacity>
  );

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Horários Disponíveis</Text>
      <FlatList
        data={horarios}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text style={styles.subtitle}>Nenhum horário disponível no momento.</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, paddingHorizontal: 16, backgroundColor: '#f9f9f9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 30 },
  item: { padding: 20, marginVertical: 8, backgroundColor: '#fff', borderRadius: 10, elevation: 3 },
  nome: { fontSize: 18, fontWeight: '600' },
  data: { fontSize: 16, color: '#555', marginTop: 5 },
  button: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginTop: 15, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
