import { registerRootComponent } from 'expo'; // <-- 1. IMPORTAR O REGISTRADOR
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CadastroScreen from './screens/CadastroScreen';

const Stack = createStackNavigator();

// Remova o "export default" daqui
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// 2. REGISTRAR O COMPONENTE 'APP' COMO O PRINCIPAL ('main')
registerRootComponent(App);