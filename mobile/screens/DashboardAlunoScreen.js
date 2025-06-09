import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem
} from '@react-navigation/drawer';
import { View, Text, StyleSheet } from 'react-native';

const Drawer = createDrawerNavigator();

function BoasVindas() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, Aluno</Text>
      <Text style={styles.subtitle}>Este é o seu painel principal.</Text>
    </View>
  );
}

function VisualizarHorarios() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Horários Disponíveis</Text>
      <Text style={styles.subtitle}>
        Visualize aqui os horários de suas aulas ou consultas.
      </Text>
    </View>
  );
}

export default function DashboardAlunoScreen({ navigation }) {
  return (
    <Drawer.Navigator
      initialRouteName="Boas Vindas"
      drawerContent={(props) => (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem
            label="Sair"
            onPress={() => props.navigation.replace('Login')}
            labelStyle={{ color: 'red' }}
          />
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen name="Boas Vindas" component={BoasVindas} />
      <Drawer.Screen name="Visualizar Horários" component={VisualizarHorarios} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginTop: 8,
    textAlign: 'center',
  },
});
