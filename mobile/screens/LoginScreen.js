import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.1.80:3001';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !senha) {
      setErro('Por favor, preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    setErro('');

    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, senha });
      const data = res.data;

      if (!data?.tipo || !data?.token) {
        setErro('Resposta do servidor inválida.');
        setLoading(false);
        return;
      }

      const { tipo } = data;
      let routeName = '';
      if (tipo === 'coordenador') routeName = 'DashboardCoordenador';
      else if (tipo === 'cliente') routeName = 'DashboardCliente';
      else if (tipo === 'aluno') routeName = 'DashboardAluno';
      else {
        setErro('Tipo de usuário desconhecido.');
        setLoading(false);
        return;
      }

      navigation.replace(routeName, { userData: data });

    } catch (err) {
      const msg = err.response?.data || 'Usuário ou senha inválidos.';
      setErro(typeof msg === 'string' ? msg : 'Erro inesperado.');
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

      <Text style={styles.label}>E-mail</Text>
      <TextInput
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        placeholder="Digite sua senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity>
        <Text style={styles.forgotText}>Esqueci minha senha</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.registerText}>Quero me cadastrar</Text>
      </TouchableOpacity>

      {!!erro && <Text style={styles.errorText}>{erro}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: 'white' },
  logo: { width: 200, height: 100, alignSelf: 'center', marginBottom: 32 },
  label: { fontSize: 14, color: '#333', marginBottom: 4, marginTop: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9'
  },
  forgotText: {
    textAlign: 'right',
    color: '#007bff',
    fontSize: 14,
    marginTop: 8
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    marginTop: 24
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  registerText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#007bff',
    fontSize: 16
  },
  errorText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#dc3545',
    fontSize: 14
  }
});
