import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  // Os estados continuam os mesmos
  const [tipoSelecionado, setTipoSelecionado] = useState('cliente'); // 'cliente' ou 'coordenador'
  const [telefone, setTelefone] = useState('');
  const [matricula, setMatricula] = useState('');

  const handleCadastro = async () => {
    // Validação atualizada
    const isCoordenador = tipoSelecionado === 'coordenador';
    if (!nome || !email || !senha || !telefone || (isCoordenador && !matricula)) {
      return Alert.alert('Erro', 'Por favor, preencha todos os campos.');
    }

    // Monta o objeto de dados para enviar
    const dadosCadastro = {
      nome,
      email,
      senha,
      tipo: tipoSelecionado,
      telefone, // Telefone agora é enviado para ambos os tipos
      matricula: isCoordenador ? matricula : undefined, // Matrícula só é enviada para o coordenador
    };

    try {
      // Lembre-se de usar o seu IP local real aqui
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

      {/* Seletor de Tipo de Usuário (continua igual) */}
      <View style={styles.selectorContainer}>
        <TouchableOpacity
          style={[styles.selectorButton, tipoSelecionado === 'cliente' && styles.selectorActive]}
          onPress={() => setTipoSelecionado('cliente')}
        >
          <Text style={[styles.selectorText, tipoSelecionado === 'cliente' && styles.selectorTextActive]}>Sou Cliente</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.selectorButton, tipoSelecionado === 'coordenador' && styles.selectorActive]}
          onPress={() => setTipoSelecionado('coordenador')}
        >
          <Text style={[styles.selectorText, tipoSelecionado === 'coordenador' && styles.selectorTextActive]}>Sou Coordenador</Text>
        </TouchableOpacity>
      </View>

      {/* Inputs Comuns */}
      <TextInput placeholder="Nome Completo" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} style={styles.input} secureTextEntry />
      
      {/* MUDANÇA NA LÓGICA DE EXIBIÇÃO */}
      {/* O campo Telefone agora fica fora da condição, aparecendo para todos */}
      <TextInput placeholder="Telefone" value={telefone} onChangeText={setTelefone} style={styles.input} keyboardType="phone-pad" />

      {/* O campo Matrícula só aparece se for coordenador */}
      {tipoSelecionado === 'coordenador' && (
        <TextInput placeholder="Matrícula" value={matricula} onChangeText={setMatricula} style={styles.input} />
      )}
      
      <Button title="Cadastrar" onPress={handleCadastro} />
    </View>
  );
}

// Estilos (sem mudanças)
const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 6, marginBottom: 16 },
  selectorContainer: { flexDirection: 'row', marginBottom: 20, borderWidth: 1, borderColor: '#007BFF', borderRadius: 8, overflow: 'hidden' },
  selectorButton: { flex: 1, padding: 12, alignItems: 'center', backgroundColor: '#fff' },
  selectorActive: { backgroundColor: '#007BFF' },
  selectorText: { color: '#007BFF', fontWeight: 'bold' },
  selectorTextActive: { color: '#fff' },
});