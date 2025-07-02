import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';

// Importando as telas funcionais do cliente
import TelaHorariosDisponiveis from './TelaHorariosDisponiveis';
import MinhasConsultasScreen from './MinhasConsultasScreen';
import EditarPerfilScreen from './EditarPerfilScreen';

const Drawer = createDrawerNavigator();

export default function DashboardCliente({ route, navigation }) {
    // Pega os dados do utilizador (com ID e token) que vieram da tela de Login
    const { userData } = route.params;

    return (
        <Drawer.Navigator 
            initialRouteName="Agendar Horário"
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
          {/* Menu 1: Ver horários e fazer pré-agendamento */}
          <Drawer.Screen name="Agendar Horário">
            {(props) => <TelaHorariosDisponiveis {...props} userData={userData} />}
          </Drawer.Screen>

          {/* Menu 2: Ver estado das consultas e cancelar */}
          <Drawer.Screen name="Meus Agendamentos">
            {(props) => <MinhasConsultasScreen {...props} userData={userData} />}
          </Drawer.Screen>

          {/* Menu 3: Editar o perfil */}
          <Drawer.Screen name="Editar Perfil">
            {(props) => <EditarPerfilScreen {...props} userData={userData} />}
          </Drawer.Screen>

        </Drawer.Navigator>
    );
}
