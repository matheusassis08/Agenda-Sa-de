import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.0.127:3001'; // ajuste para seu IP real

export default function EditarAlunoScreen({ route, navigation }) {
  const { aluno, userData } = route.params;

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [matricula, setMatricula] = useState('');

  // Preenche os campos com os dados atuais
  useEffect(() => {
    setNome(aluno.nome || '');
    setEmail(aluno.email || '');
    setTelefone(aluno.telefone || '');
    setMatricula(aluno.matricula || '');
  }, [aluno]);

  const handleSalvar = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userData.token}` }
      };

      const payload = { nome, email, telefone, matricula };

      await axios.put(`${API_URL}/api/users/editar-aluno/${aluno._id}`, payload, config);

      Alert.alert('Sucesso', 'Dados do aluno atualizados!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar:', error.response?.data || error.message);
      Alert.alert('Erro', 'Não foi possível atualizar o aluno.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Text style={styles.label}>Email:</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

      <Text style={styles.label}>Telefone:</Text>
      <TextInput style={styles.input} value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />

      <Text style={styles.label}>Matrícula:</Text>
      <TextInput style={styles.input} value={matricula} onChangeText={setMatricula} />

      <Button title="Salvar Alterações" onPress={handleSalvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15
  }
});

