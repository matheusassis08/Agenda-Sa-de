import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !telefone) {
      return Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }

    const dadosCadastro = {
      nome,
      email,
      senha,
      tipo: 'cliente',
      telefone,
    };

    try {
      const response = await axios.post('http://192.168.100.8:3001/auth/register', dadosCadastro);
      Alert.alert('Sucesso', response.data);
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro no Cadastro', error.response?.data?.error || 'Não foi possível conectar ao servidor.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      {/* Indicador de tipo fixo */}
      <View style={styles.selectorContainer}>
        <TouchableOpacity style={[styles.selectorButton, styles.selectorActive]}>
          <Text style={styles.selectorTextActive}>Sou Cliente</Text>
        </TouchableOpacity>
      </View>

      {/* Campos de entrada */}
      <TextInput placeholder="Nome Completo" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} style={styles.input} secureTextEntry />
      <TextInput placeholder="Telefone" value={telefone} onChangeText={setTelefone} style={styles.input} keyboardType="phone-pad" />

      <Button title="Cadastrar" onPress={handleCadastro} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 6, marginBottom: 16 },
  selectorContainer: { flexDirection: 'row', marginBottom: 20, borderWidth: 1, borderColor: '#007BFF', borderRadius: 8, overflow: 'hidden' },
  selectorButton: { flex: 1, padding: 12, alignItems: 'center', backgroundColor: '#fff' },
  selectorActive: { backgroundColor: '#007BFF' },
  selectorTextActive: { color: '#fff', fontWeight: 'bold' },
});
