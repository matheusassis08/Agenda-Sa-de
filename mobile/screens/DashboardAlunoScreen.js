import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import HomeScreen from './HomeScreen';
import CadastroScreen from './CadastroScreen';
import DashboardCoordenador from './DashboardCoordenadorScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        {/* A HomeScreen pode ser o dashboard do cliente, por exemplo */}
        <Stack.Screen name="DashboardCliente" component={HomeScreen} />
        <Stack.Screen name="DashboardCoordenador" component={DashboardCoordenador} />
        
        {/* 2. ADICIONE A NOVA ROTA AQUI */}
        <Stack.Screen name="DashboardAluno" component={DashboardAlunoScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});