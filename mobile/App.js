import { registerRootComponent } from 'expo';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importação de todas as telas necessárias
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import CadastroScreen from './screens/CadastroScreen';
import DashboardCoordenadorScreen from './screens/DashboardCoordenadorScreen';
import DashboardClienteScreen from './screens/DashboardClienteScreen';
import DashboardAlunoScreen from './screens/DashboardAlunoScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={{ headerShown: false }} // Oculta cabeçalhos por padrão
      >
        {/* Telas públicas */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen 
          name="Cadastro" 
          component={CadastroScreen} 
          options={{ headerShown: true, title: 'Criar Conta' }} 
        />

        {/* Telas privadas: após login */}
        <Stack.Screen name="DashboardCoordenador" component={DashboardCoordenadorScreen} />
        <Stack.Screen name="DashboardCliente" component={DashboardClienteScreen} />
        <Stack.Screen name="DashboardAluno" component={DashboardAlunoScreen} />

        {/* Tela opcional: Home, se desejar usar */}
        {/* <Stack.Screen name="Home" component={HomeScreen} /> */}

      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);
