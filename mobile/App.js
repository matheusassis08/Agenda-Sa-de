import { registerRootComponent } from 'expo';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Telas principais
import LoginScreen from './screens/LoginScreen';
import CadastroScreen from './screens/CadastroScreen';
import DashboardCoordenadorScreen from './screens/DashboardCoordenadorScreen';
import DashboardClienteScreen from './screens/DashboardClienteScreen';
// import HomeScreen from './screens/HomeScreen'; // Remova se não usar mais

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="DashboardCoordenador" component={DashboardCoordenadorScreen} />
        <Stack.Screen name="DashboardCliente" component={DashboardClienteScreen} />
        {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

registerRootComponent(App);
