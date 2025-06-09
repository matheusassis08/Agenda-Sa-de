import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.100.8:3001'; // Confirme o IP da sua máquina

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const login = async () => {
    if (!email || !senha) {
      setErro('Preencha e-mail e senha.');
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, senha });
      const user = res.data;

      if (!user?.tipo) {
        setErro('Resposta do servidor inválida: tipo de usuário ausente.');
        return;
      }

      switch (user.tipo) {
        case 'coordenador':
          navigation.replace('DashboardCoordenador', { user });
          break;
        case 'cliente':
          navigation.replace('DashboardCliente', { user });
          break;
        case 'aluno':
          navigation.replace('DashboardAluno', { user });
          break;
        default:
          setErro('Tipo de usuário desconhecido.');
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      const mensagemErro = err.response?.data?.error || err.response?.data || 'Usuário ou senha inválidos.';
      setErro(typeof mensagemErro === 'string' ? mensagemErro : 'Erro inesperado no login.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
        placeholder="E-mail" 
        value={email} 
        onChangeText={setEmail}
        autoCapitalize="none" 
        style={styles.input} 
        keyboardType="email-address"
      />
      <TextInput 
        placeholder="Senha" 
        value={senha} 
        onChangeText={setSenha}
        secureTextEntry 
        style={styles.input} 
      />
      <Button title="Entrar" onPress={login} />
      <View style={{ marginVertical: 5 }} />
      <Button title="Cadastrar" onPress={() => navigation.navigate('Cadastro')} />
      {!!erro && <Text style={styles.errorText}>{erro}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  input: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
  },
  errorText: {
    marginTop: 10,
    color: 'red',
    textAlign: 'center',
  },
});
