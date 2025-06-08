import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';

const Drawer = createDrawerNavigator();

function BoasVindas() {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bem-vindo, Coordenador!</Text>
    </View>
  );
}

function ConfirmarConsultas() {
  return (
    <View style={styles.container}>
      <Text>Confirmar Consultas</Text>
    </View>
  );
}

function GerarRelatorio() {
  return (
    <View style={styles.container}>
      <Text>Gerar Relatório</Text>
    </View>
  );
}

function GerenciarPerfis() {
  return (
    <View style={styles.container}>
      <Text>Gerenciar Perfis</Text>
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

function CadastrarConsulta() {
  return (
    <View style={styles.container}>
      <Text>Cadastrar Consulta</Text>
    </View>
  );
}

function ExcluirConsulta() {
  return (
    <View style={styles.container}>
      <Text>Excluir Consulta</Text>
    </View>
  );
}

function AlterarConsulta() {
  return (
    <View style={styles.container}>
      <Text>Alterar Consulta</Text>
    </View>
  );
}

export default function DashboardCoordenador() {
  return (
    <Drawer.Navigator initialRouteName="Boas Vindas">
      <Drawer.Screen name="Boas Vindas" component={BoasVindas} />
      <Drawer.Screen name="Confirmar Consultas" component={ConfirmarConsultas} />
      <Drawer.Screen name="Gerar Relatório" component={GerarRelatorio} />
      <Drawer.Screen name="Gerenciar Perfis" component={GerenciarPerfis} />
      <Drawer.Screen name="Visualizar Consultas" component={VisualizarConsultas} />
      <Drawer.Screen name="Cadastrar Consulta" component={CadastrarConsulta} />
      <Drawer.Screen name="Excluir Consulta" component={ExcluirConsulta} />
      <Drawer.Screen name="Alterar Consulta" component={AlterarConsulta} />
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
