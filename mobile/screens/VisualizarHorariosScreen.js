import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

const API_URL = 'http://192.168.100.8:3001'; // Use o seu IP local

const HorarioItem = ({ item, onDelete }) => (
  <View style={styles.itemContainer}>
    <View style={styles.infoContainer}>
        <Text style={styles.itemTitle}>Aluno: {item.aluno?.nome || 'Não especificado'}</Text>
        <Text style={styles.itemText}>Data: {new Date(item.dataHora).toLocaleDateString('pt-BR')}</Text>
        <Text style={styles.itemText}>Hora: {new Date(item.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
    </View>
    <TouchableOpacity onPress={() => onDelete(item._id)} style={styles.deleteButton}>
        <MaterialIcons name="delete-forever" size={28} color="#e74c3c" />
    </TouchableOpacity>
  </View>
);

export default function VisualizarHorariosScreen() {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHorarios = async () => {
    try {
        const response = await axios.get(`${API_URL}/consultas/disponiveis`);
        setHorarios(response.data);
    } catch (error) {
        Alert.alert('Erro', 'Não foi possível buscar os horários disponíveis.');
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHorarios();
  }, []);

  const handleDelete = async (id) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja remover este horário?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sim, Remover", 
          onPress: async () => {
            try {
              // Chamada direta para a API, sem token de autenticação
              await axios.delete(`${API_URL}/consultas/${id}`);
              
              Alert.alert("Sucesso", "Horário removido.");
              // Atualiza a lista na tela para refletir a exclusão
              setHorarios(prevHorarios => prevHorarios.filter(h => h._id !== id));
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Não foi possível remover o horário.";
                Alert.alert('Erro', errorMessage);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchHorarios();
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerir Horários Disponíveis</Text>
      <FlatList
          data={horarios}
          renderItem={({ item }) => <HorarioItem item={item} onDelete={handleDelete} />}
          keyExtractor={item => item._id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum horário disponível no momento.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 16 },
  itemContainer: { 
    backgroundColor: 'white', 
    padding: 16, 
    marginVertical: 8, 
    borderRadius: 8, 
    elevation: 2, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center'
  },
  infoContainer: { 
    flex: 1 
  },
  deleteButton: { 
    padding: 8, 
    marginLeft: 10 
  },
  itemTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 4 
  },
  itemText: { 
    fontSize: 14, 
    color: '#555' 
  },
  emptyText: { 
    textAlign: 'center', 
    marginTop: 50, 
    fontSize: 16, 
    color: 'gray' 
  },
});
