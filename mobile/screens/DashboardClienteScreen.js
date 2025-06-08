import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';

const Drawer = createDrawerNavigator();

function BoasVindas() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bem-vindo, Usuário!</Text>
    </View>
  );
}

function SolicitarConsulta() {
  return (
    <View style={styles.container}>
      <Text>Solicitar Consulta</Text>
    </View>
  );
}

function CancelarConsulta() {
  return (
    <View style={styles.container}>
      <Text>Cancelar Consulta</Text>
    </View>
  );
}

function VisualizarHorarios() {
  return (
    <View style={styles.container}>
      <Text>Visualizar Horários Disponíveis</Text>
    </View>
  );
}

function VisualizarConsultas() {
  return (
    <View style={styles.container}>
      <Text>Visualizar Consultas</Text>
    </View>
  );
}

export default function DashboardCliente() {
  return (
    <Drawer.Navigator initialRouteName="Boas Vindas">
      <Drawer.Screen name="Boas Vindas" component={BoasVindas} />
      <Drawer.Screen name="Solicitar Consulta" component={SolicitarConsulta} />
      <Drawer.Screen name="Cancelar Consulta" component={CancelarConsulta} />
      <Drawer.Screen name="Visualizar Horários" component={VisualizarHorarios} />
      <Drawer.Screen name="Visualizar Consultas" component={VisualizarConsultas} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333'
  }
});
