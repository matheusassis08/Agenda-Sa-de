import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';

// Importando todas as telas que o coordenador vai usar
import CadastrarAlunoScreen from './CadastrarAlunoScreen';
import AdicionarHorarioScreen from './AdicionarHorarioScreen';
import VisualizarHorariosScreen from './VisualizarHorariosScreen';
import ConfirmarConsultasScreen from './ConfirmarConsultasScreen';
import EditarPerfilScreen from './EditarPerfilScreen'; // Importando a nova tela

const Drawer = createDrawerNavigator();

// Componente para a tela de boas-vindas
function BoasVindas({ userData }) {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Painel do Coordenador</Text>
      <Text style={styles.userName}>{userData?.nome || ''}</Text>
    </View>
  );
}

// O componente principal do Dashboard
export default function DashboardCoordenador({ route, navigation }) {
  // Pega os dados do utilizador (com o token) que vieram da tela de Login
  const { userData } = route.params;

  return (
    <Drawer.Navigator
      initialRouteName="Início"
      drawerContent={(props) => (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem
            label="Sair"
            onPress={() => navigation.replace('Login')}
            labelStyle={{ color: 'red', fontWeight: 'bold' }}
          />
        </DrawerContentScrollView>
      )}
    >
      {/* Usamos uma função anónima para passar 'userData' como prop para cada tela */}
      <Drawer.Screen name="Início">
        {(props) => <BoasVindas {...props} userData={userData} />}
      </Drawer.Screen>

      {/* Opção 1: Cadastrar Aluno */}
      <Drawer.Screen name="Cadastrar Aluno">
        {(props) => <CadastrarAlunoScreen {...props} userData={userData} />}
      </Drawer.Screen>

      {/* Opção 2: Confirmar ou Cancelar Pré-Agendamento */}
      <Drawer.Screen name="Gerir Solicitações">
        {(props) => <ConfirmarConsultasScreen {...props} userData={userData} />}
      </Drawer.Screen>
      
      {/* Opção 3: Adicionar ou Remover Horários */}
      {/* A tela 'VisualizarHorariosScreen' já permite ver e remover horários */}
      <Drawer.Screen name="Gerir Horários">
        {(props) => <VisualizarHorariosScreen {...props} userData={userData} />}
      </Drawer.Screen>

      {/* Opção 4: Adicionar Horário (atalho, se desejar) */}
      <Drawer.Screen name="Adicionar Horário (Atalho)">
        {(props) => <AdicionarHorarioScreen {...props} userData={userData} />}
      </Drawer.Screen>
      
      {/* Opção 5: Editar Perfil */}
      <Drawer.Screen name="Editar Perfil">
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
