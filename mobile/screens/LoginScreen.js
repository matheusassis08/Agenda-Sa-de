import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';

// Lembre-se de usar o IP da sua máquina que está a rodar o backend
const API_URL = 'http://192.168.0.127:3001'; 

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
      <Text style={styles.title}>Clínica Escola</Text>
      <Text style={styles.subtitle}>Acesse o seu painel</Text>
      <TextInput placeholder="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" style={styles.input} keyboardType="email-address"/>
      <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry style={styles.input} />
      {loading ? <ActivityIndicator size="large" /> : <Button title="Entrar" onPress={login} />}
      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')} style={styles.signupButton}>
        <Text style={styles.signupText}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
      {!!erro && <Text style={styles.errorText}>{erro}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f8f9fa' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#6c757d', marginBottom: 32 },
  input: { marginBottom: 16, borderWidth: 1, borderColor: '#ced4da', backgroundColor: 'white', borderRadius: 8, padding: 12, fontSize: 16 },
  errorText: { marginTop: 15, fontSize: 16, color: '#dc3545', textAlign: 'center' },
  signupButton: { marginTop: 20 },
  signupText: { color: '#007bff', textAlign: 'center', fontSize: 16 }
});
