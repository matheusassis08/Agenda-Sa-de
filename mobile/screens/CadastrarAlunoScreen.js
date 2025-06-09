import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';

// Melhora 1: Mover a URL da API para uma constante, facilitando a alteração.
const API_URL = 'http://192.168.100.8:3001'; // <-- CONFIRA SE ESTE IP ESTÁ CORRETO

export default function CadastrarAlunoScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [matricula, setMatricula] = useState('');

  // Melhora 2: Estado de carregamento
  const [isLoading, setIsLoading] = useState(false);

  const handleCadastroAluno = async () => {
    if (!nome || !email || !senha || !telefone || !matricula) {
      return Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }

    const dadosNovoAluno = {
      nome, email, senha, tipo: 'aluno', telefone, matricula,
    };

    setIsLoading(true); // Inicia o carregamento

    try {
      const response = await axios.post(`${API_URL}/auth/register`, dadosNovoAluno);
      
      Alert.alert('Sucesso!', response.data);
      
      // Limpa os campos
      setNome('');
      setEmail('');
      setSenha('');
      setTelefone('');
      setMatricula('');

    } catch (error) {
      // Melhora 3: Log detalhado do erro no terminal do Metro
      console.error("DETALHES DO ERRO:", JSON.stringify(error.response?.data, null, 2));

      Alert.alert('Erro no Cadastro', error.response?.data?.error || 'Não foi possível conectar ao servidor.');
    } finally {
      setIsLoading(false); // Finaliza o carregamento, independentemente de sucesso ou erro
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastrar Novo Aluno</Text>
      <Text style={styles.subtitle}>Preencha todos os dados do novo aluno.</Text>
      
      <TextInput placeholder="Nome Completo do Aluno" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput placeholder="Email do Aluno" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Senha Provisória" value={senha} onChangeText={setSenha} style={styles.input} secureTextEntry />
      <TextInput placeholder="Telefone do Aluno" value={telefone} onChangeText={setTelefone} style={styles.input} keyboardType="phone-pad" />
      <TextInput placeholder="Matrícula do Aluno" value={matricula} onChangeText={setMatricula} style={styles.input} />
      
      {/* Se estiver carregando, mostra um indicador. Senão, mostra o botão. */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Registrar Aluno" onPress={handleCadastroAluno} />
      )}
    </ScrollView>
  );
}

// Estilos (sem mudanças)
const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24, },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center', },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 24, },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 6, marginBottom: 16, },
});