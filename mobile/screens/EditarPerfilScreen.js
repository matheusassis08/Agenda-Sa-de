import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.1.80:3001'; // Use o seu IP local

export default function EditarPerfilScreen({ userData }) {
  const [nome, setNome] = useState(userData.nome);
  const [telefone, setTelefone] = useState(userData.telefone || '');
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    if (!nome || !telefone) {
      return Alert.alert('Erro', 'Nome e telefone são obrigatórios.');
    }
    setLoading(true);
    try {
      const payload = { nome, telefone };
      const config = { headers: { Authorization: `Bearer ${userData.token}` } };
      await axios.put(`${API_URL}/api/users/perfil`, payload, config);
      Alert.alert('Sucesso', 'O seu perfil foi atualizado!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o seu perfil.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logoufvjm.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Editar Meu Perfil</Text>

      <Text style={styles.label}>Nome Completo</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Nome Completo"
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        style={styles.input}
        value={telefone}
        onChangeText={setTelefone}
        placeholder="Telefone"
        keyboardType="phone-pad"
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Salvar Alterações" onPress={handleSalvar} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  logo: { width: 200, height: 100, alignSelf: 'center', marginBottom: 32 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 32 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#34495e' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 16 },
});
