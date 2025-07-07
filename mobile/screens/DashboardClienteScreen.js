import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

// Importando as telas funcionais do cliente
import TelaHorariosDisponiveis from './TelaHorariosDisponiveis';
import MinhasConsultasScreen from './MinhasConsultasScreen';
import EditarPerfilScreen from './EditarPerfilScreen';

const Drawer = createDrawerNavigator();

export default function DashboardCliente({ route, navigation }) {
  const { userData } = route.params;

  return (
    <Drawer.Navigator
      initialRouteName="Agendar Horário"
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
            icon={({ color, size }) => <Ionicons name="exit-outline" size={size} color="red" />}
            onPress={() => navigation.replace('Login')}
            labelStyle={{ color: 'red', fontWeight: 'bold' }}
          />
        </DrawerContentScrollView>
      )}
    >
      {/* Menu 1: Ver horários e fazer pré-agendamento */}
      <Drawer.Screen
        name="Agendar Horário"
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
        }}
      >
        {(props) => <TelaHorariosDisponiveis {...props} userData={userData} />}
      </Drawer.Screen>

      {/* Menu 2: Ver estado das consultas e cancelar */}
      <Drawer.Screen
        name="Meus Agendamentos"
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="clipboard-outline" size={size} color={color} />,
        }}
      >
        {(props) => <MinhasConsultasScreen {...props} userData={userData} />}
      </Drawer.Screen>

      {/* Menu 3: Editar o perfil */}
      <Drawer.Screen
        name="Editar Perfil"
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} />,
        }}
      >
        {(props) => <EditarPerfilScreen {...props} userData={userData} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

