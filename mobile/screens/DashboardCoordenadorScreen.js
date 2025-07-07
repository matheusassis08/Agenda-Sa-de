import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ícones

// Telas usadas
import CadastrarAlunoScreen from './CadastrarAlunoScreen';
import AdicionarHorarioScreen from './AdicionarHorarioScreen';
import VisualizarHorariosScreen from './VisualizarHorariosScreen';
import ConfirmarConsultasScreen from './ConfirmarConsultasScreen';
import EditarPerfilScreen from './EditarPerfilScreen';

const Drawer = createDrawerNavigator();

// Tela de boas-vindas
function BoasVindas({ userData }) {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Painel do Coordenador</Text>
      <Text style={styles.userName}>{userData?.nome || ''}</Text>
    </View>
  );
}

export default function DashboardCoordenador({ route, navigation }) {
  const { userData } = route.params;

  return (
    <Drawer.Navigator
      initialRouteName="Início"
      screenOptions={{
        drawerActiveTintColor: '#007bff',
        drawerLabelStyle: { fontSize: 16 },
        headerShown: true
      }}
      drawerContent={(props) => (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem
            label="Sair"
            icon={({ color, size }) => <Ionicons name="exit-outline" size={size} color="red" />}
            onPress={() => navigation.replace('Login')}
            labelStyle={{ color: 'red', fontWeight: 'bold' }}
          />
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
        name="Início"
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />
        }}
      >
        {(props) => <BoasVindas {...props} userData={userData} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Cadastrar Aluno"
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="person-add-outline" size={size} color={color} />
        }}
      >
        {(props) => <CadastrarAlunoScreen {...props} userData={userData} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Gerir Solicitações"
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />
        }}
      >
        {(props) => <ConfirmarConsultasScreen {...props} userData={userData} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Gerir Horários"
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={color} />
        }}
      >
        {(props) => <VisualizarHorariosScreen {...props} userData={userData} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Adicionar Horário (Atalho)"
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={size} color={color} />
        }}
      >
        {(props) => <AdicionarHorarioScreen {...props} userData={userData} />}
      </Drawer.Screen>

      <Drawer.Screen
        name="Editar Perfil"
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />
        }}
      >
        {(props) => <EditarPerfilScreen {...props} userData={userData} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  welcome: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  userName: { fontSize: 20, color: '#007bff', marginTop: 8 }
});

