import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';

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
      // IMPORTANTE: Use o IP da sua máquina aqui!
      const res = await axios.post('http://192.168.0.127:3001/auth/login', { email, senha });
      // Salve o token em algum lugar (Context/AsyncStorage)
      navigation.replace('Home', { user: res.data });
    } catch (err) {
      console.error(err); // Bom para ver o erro detalhado no terminal
      setErro('Usuário ou senha inválidos');
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
        textAlign: 'center'
    }
});