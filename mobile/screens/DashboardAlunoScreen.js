import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function DashboardAlunoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo, Aluno</Text>
      <Text style={styles.subtitle}>Este é o seu painel principal.</Text>
    </View>
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
  },
});