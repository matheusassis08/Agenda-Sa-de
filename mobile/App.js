import { registerRootComponent } from 'expo';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importação de todas as telas necessárias
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import CadastroScreen from './screens/CadastroScreen';
import DashboardCoordenador from './screens/DashboardCoordenadorScreen';
import DashboardClienteScreen from './screens/DashboardClienteScreen';
import DashboardAlunoScreen from './screens/DashboardAlunoScreen';

const Stack = createStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={{ headerShown: false }} // Opcional: esconde o cabeçalho em todas as telas
      >
        {/* Telas públicas */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} options={{ headerShown: true, title: 'Criar Conta' }} />

        {/* Telas de Dashboard para cada tipo de usuário */}
        <Stack.Screen name="DashboardCoordenador" component={DashboardCoordenador} />
        <Stack.Screen name="DashboardCliente" component={DashboardClienteScreen} />
        <Stack.Screen name="DashboardAluno" component={DashboardAlunoScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Registra o componente App como o principal do aplicativo
registerRootComponent(App);