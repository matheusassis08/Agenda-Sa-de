import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'http://192.168.1.80:3001';

export default function ListaAlunosScreen({ userData, navigation }) {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlunos = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userData.token}` } };
      const response = await axios.get(`${API_URL}/alunos`, config);
      setAlunos(response.data);
    } catch (error) {
      console.warn("Erro ao buscar alunos:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const excluirAluno = async (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este aluno?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const config = { headers: { Authorization: `Bearer ${userData.token}` } };
              await axios.delete(`${API_URL}/api/users/excluir-aluno/${id}`, config); // <- Rota corrigida
              fetchAlunos(); // Atualiza a lista
              Alert.alert('Sucesso', 'Aluno excluído com sucesso!');
            } catch (err) {
              console.warn('Erro ao excluir:', err.response?.data || err.message);
              Alert.alert('Erro', 'Não foi possível excluir o aluno.');
            }
          }
        }
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchAlunos();
    }, [])
  );

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Alunos</Text>
      <FlatList
        data={alunos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text>Email: {item.email || '—'}</Text>
            <Text>Telefone: {item.telefone || '—'}</Text>
            <Text>Matrícula: {item.matricula || '—'}</Text>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Editar Aluno', { aluno: item, userData })}
              >
                <Text style={styles.link}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => excluirAluno(item._id)}>
                <Text style={styles.delete}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  item: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 8
  },
  nome: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  actions: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  link: {
    color: '#007bff',
    fontWeight: 'bold'
  },
  delete: {
    color: 'red',
    fontWeight: 'bold'
  }
});




