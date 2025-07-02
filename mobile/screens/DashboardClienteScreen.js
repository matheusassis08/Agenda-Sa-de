import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const Drawer = createDrawerNavigator();
const API_URL = 'http://192.168.1.10:3001'; // Ajuste para o IP correto do seu backend

function ListaAlunosDisponiveis() {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlunos = async () => {
    try {
      setLoading(true); // garante loading ao iniciar requisição
      const response = await axios.get(`${API_URL}/alunos`);
      setAlunos(response.data);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      Alert.alert('Erro', 'Não foi possível carregar os alunos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlunos();
  }, []);

  const agendarConsulta = (aluno) => {
    Alert.alert('Agendamento', `Consulta solicitada com ${aluno.nome}.`);
    // Aqui você pode integrar a rota POST para agendar de verdade
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando alunos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alunos Disponíveis para Consulta</Text>
      <FlatList
        data={alunos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => agendarConsulta(item)}>
            <Text style={styles.nome}>{item.nome}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.subtitle}>Nenhum aluno disponível.</Text>}
        initialNumToRender={10} // melhora performance inicial
      />
    </View>
  );
}

function CancelarConsulta() {
  return (
    <View style={styles.center}>
      <Text>Cancelar Consulta</Text>
    </View>
  );
}

function VisualizarHorarios() {
  return (
    <View style={styles.center}>
      <Text>Visualizar Horários Disponíveis</Text>
    </View>
  );
}

function VisualizarConsultas() {
  return (
    <View style={styles.center}>
      <Text>Visualizar Consultas</Text>
    </View>
  );
}

function Sair({ navigation }) {
  useEffect(() => {
    navigation.replace('Login');
  }, []);
  return null;
}

export default function DashboardCliente() {
  return (
    <Drawer.Navigator initialRouteName="Alunos Disponíveis">
      <Drawer.Screen name="Alunos Disponíveis" component={ListaAlunosDisponiveis} />
      <Drawer.Screen name="Cancelar Consulta" component={CancelarConsulta} />
      <Drawer.Screen name="Visualizar Horários" component={VisualizarHorarios} />
      <Drawer.Screen name="Visualizar Consultas" component={VisualizarConsultas} />
      <Drawer.Screen name="Sair" component={Sair} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, paddingHorizontal: 16, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 20 },
  item: {
    padding: 15,
    marginVertical: 8,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
  },
  nome: { fontSize: 18 },
});
