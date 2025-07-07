import React, { useEffect, useState, useCallback } from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

import CadastrarAlunoScreen from './CadastrarAlunoScreen';
import AdicionarHorarioScreen from './AdicionarHorarioScreen';
import VisualizarHorariosScreen from './VisualizarHorariosScreen';
import ConfirmarConsultasScreen from './ConfirmarConsultasScreen';
import EditarPerfilScreen from './EditarPerfilScreen';
import ListaAlunosScreen from './ListaAlunosScreen';
import EditarAlunoScreen from './EditarAlunoScreen';

const Drawer = createDrawerNavigator();
const API_URL = 'http://192.168.1.80:3001';

function BoasVindas({ userData, resumo, loading }) {
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bem-vinda, {userData?.nome || ''} 👋</Text>
      <Text style={styles.subheader}>Você está no Painel do Coordenador</Text>

      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <Ionicons name="people-outline" size={30} color="#007bff" />
          <Text style={styles.cardTitle}>Alunos</Text>
          <Text style={styles.cardValue}>{resumo.alunos}</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="time-outline" size={30} color="#28a745" />
          <Text style={styles.cardTitle}>Horários</Text>
          <Text style={styles.cardValue}>{resumo.horarios}</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="calendar-outline" size={30} color="#ffc107" />
          <Text style={styles.cardTitle}>Pendentes</Text>
          <Text style={styles.cardValue}>{resumo.solicitacoes}</Text>
        </View>
      </View>
    </View>
  );
}

export default function DashboardCoordenador({ route, navigation }) {
  const { userData } = route.params;
  const [resumo, setResumo] = useState({ alunos: 0, horarios: 0, solicitacoes: 0 });
  const [loading, setLoading] = useState(true);

  const fetchResumo = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${userData.token}` } };
      const [alunosRes, horariosRes, solicitacoesRes] = await Promise.all([
        axios.get(`${API_URL}/alunos`, config),
        axios.get(`${API_URL}/consultas/disponiveis`),
        axios.get(`${API_URL}/consultas/pendentes`, config),
      ]);
      setResumo({
        alunos: alunosRes.data.length || 0,
        horarios: horariosRes.data.length || 0,
        solicitacoes: solicitacoesRes.data.length || 0,
      });
    } catch (err) {
      console.warn('Erro ao buscar dados do dashboard:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchResumo();
    }, [])
  );

  return (
    <Drawer.Navigator
      initialRouteName="Início"
      screenOptions={{
        drawerActiveTintColor: '#007bff',
        drawerLabelStyle: { fontSize: 16 },
        headerShown: true,
      }}
      drawerContent={(props) => (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem
            label="Sair"
            icon={({ color, size }) => (
              <Ionicons name="exit-outline" size={size} color="red" />
            )}
            onPress={() => navigation.replace('Login')}
            labelStyle={{ color: 'red', fontWeight: 'bold' }}
          />
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
        name="Início"
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      >
        {(props) => (
          <BoasVindas {...props} userData={userData} resumo={resumo} loading={loading} />
        )}
      </Drawer.Screen>

      <Drawer.Screen
        name="Cadastrar Aluno"
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-add-outline" size={size} color={color} />
          ),
        }}
      >
        {(props) => <CadastrarAlunoScreen {...props} userData={userData} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Lista de Alunos"
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
        }}
      >
        {(props) => <ListaAlunosScreen {...props} userData={userData} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Solicitações"
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      >
        {(props) => (
          <ConfirmarConsultasScreen
            {...props}
            userData={userData}
            atualizarResumo={fetchResumo} // 👈 Envia função para atualizar
          />
        )}
      </Drawer.Screen>

      <Drawer.Screen
        name="Gerenciar Horários"
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="time-outline" size={size} color={color} />
          ),
        }}
      >
        {(props) => <VisualizarHorariosScreen {...props} userData={userData} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Adicionar Horário"
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          ),
        }}
      >
        {(props) => <AdicionarHorarioScreen {...props} userData={userData} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Editar Perfil"
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      >
        {(props) => <EditarPerfilScreen {...props} userData={userData} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Editar Aluno"
        options={{
          drawerItemStyle: { display: 'none' },
          headerShown: true,
        }}
      >
        {(props) => <EditarAlunoScreen {...props} userData={userData} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  subheader: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 20 },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  card: {
    width: '30%',
    backgroundColor: '#f2f2f2',
    padding: 12,
    marginVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  cardTitle: { fontSize: 14, color: '#333', marginTop: 5 },
  cardValue: { fontSize: 16, fontWeight: 'bold', color: '#007bff', marginTop: 4 },
});


