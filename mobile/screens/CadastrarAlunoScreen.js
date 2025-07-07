import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const API_URL = 'http://192.168.1.80:3001';

export default function CadastrarAlunoScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [matricula, setMatricula] = useState('');
  const [imagem, setImagem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const selecionarImagem = async () => {
    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!resultado.cancelled) {
      setImagem(`data:image/jpeg;base64,${resultado.base64}`);
    }
  };

  const handleCadastroAluno = async () => {
    if (!nome || !email || !senha || !telefone || !matricula) {
      return Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }

    const dadosNovoAluno = {
      nome,
      email,
      senha,
      tipo: 'aluno',
      telefone,
      matricula,
      foto: imagem,
    };

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/auth/register`, dadosNovoAluno);

      Alert.alert('Sucesso!', response.data);
      setNome('');
      setEmail('');
      setSenha('');
      setTelefone('');
      setMatricula('');
      setImagem(null);
    } catch (error) {
      console.error("DETALHES DO ERRO:", JSON.stringify(error.response?.data, null, 2));
      Alert.alert('Erro no Cadastro', error.response?.data?.error || 'Não foi possível conectar ao servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastrar Novo Aluno</Text>
      <Text style={styles.subtitle}>Preencha todos os dados do novo aluno.</Text>

      <TouchableOpacity onPress={selecionarImagem} style={{ alignSelf: 'center', marginBottom: 20 }}>
        {imagem ? (
          <Image source={{ uri: imagem }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholderFoto}>
            <Text>Adicionar Foto</Text>
          </View>
        )}
      </TouchableOpacity>

      <TextInput placeholder="Nome Completo do Aluno" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput placeholder="Email do Aluno" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Senha Provisória" value={senha} onChangeText={setSenha} style={styles.input} secureTextEntry />
      <TextInput placeholder="Telefone do Aluno" value={telefone} onChangeText={setTelefone} style={styles.input} keyboardType="phone-pad" />
      <TextInput placeholder="Matrícula do Aluno" value={matricula} onChangeText={setMatricula} style={styles.input} />

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Registrar Aluno" onPress={handleCadastroAluno} />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 6, marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  placeholderFoto: {
    width: 100, height: 100, borderRadius: 50, backgroundColor: '#ccc',
    justifyContent: 'center', alignItems: 'center'
  }
});
