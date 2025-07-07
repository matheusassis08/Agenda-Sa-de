import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.1.80:3001'; // Atualize se necessário

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, dadosCadastro);
      Alert.alert('Sucesso!', response.data);
      navigation.navigate('Login');
    } catch (error) {
      console.error("Erro:", error.response?.data);
      Alert.alert('Erro no Cadastro', error.response?.data?.error || 'Erro ao conectar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/images/logoufvjm.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Criar Conta</Text>

      <Text style={styles.label}>Nome Completo</Text>
      <TextInput
        placeholder="Digite seu nome"
        placeholderTextColor="#888"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        placeholder="Digite seu e-mail"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        placeholder="Digite sua senha"
        placeholderTextColor="#888"
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
        secureTextEntry
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        placeholder="(99) 99999-9999"
        placeholderTextColor="#888"
        value={telefone}
        onChangeText={setTelefone}
        style={styles.input}
        keyboardType="phone-pad"
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleCadastro}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>Já tem uma conta? Faça login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff', // Fundo branco
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    width: 200,
    height: 100,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    color: '#000',
    padding: 12,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 14,
    borderRadius: 8,
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loginText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#007BFF',
    fontSize: 16,
  },
});
