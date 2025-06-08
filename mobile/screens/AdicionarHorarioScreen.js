import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

// Coloque seu IP aqui para facilitar a manutenção
const API_URL = 'http://192.168.0.127:3001'; 

export default function AdicionarHorarioScreen() {
  // Estados para os dados do formulário
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [dataHora, setDataHora] = useState(''); // Simplificado: um único campo de texto

  // Estados de controle da UI
  const [loading, setIsLoading] = useState(false);
  const [loadingAlunos, setLoadingAlunos] = useState(true);

  // Busca a lista de alunos uma única vez quando a tela é montada
  useEffect(() => {
    console.log('[EFEITO] Buscando lista de alunos...');
    const fetchAlunos = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/alunos`);
        setAlunos(response.data);
        console.log('[EFEITO] Alunos carregados com sucesso:', response.data.length);
      } catch (error) {
        console.error('[EFEITO] Erro ao carregar alunos:', error);
        Alert.alert('Erro Crítico', 'Não foi possível carregar a lista de alunos. Verifique a conexão com a API.');
      } finally {
        setLoadingAlunos(false);
      }
    };
    fetchAlunos();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  const handleSalvarHorario = async () => {
    console.log('--- [AÇÃO] Botão Salvar Horário Pressionado ---');
    
    // 1. Validação dos dados
    if (!alunoSelecionado || !dataHora) {
      Alert.alert('Erro de Validação', 'Por favor, selecione um aluno e preencha a data e hora.');
      console.log('[VALIDAÇÃO] Falhou. Aluno ou Data/Hora estão vazios.');
      return;
    }
    // Validação simples do formato da data/hora
    if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(dataHora)) {
        Alert.alert('Formato Inválido', 'Use o formato AAAA-MM-DD HH:MM para a data e hora.');
        console.log('[VALIDAÇÃO] Falhou. Formato de data/hora incorreto.');
        return;
    }
    
    setIsLoading(true);

    // 2. Preparação dos dados para envio
    // Converte a string de data/hora local para um objeto Date e depois para o formato UTC (ISO)
    const [dataParte, horaParte] = dataHora.split(' ');
    const dataHoraISO = new Date(`${dataParte}T${horaParte}:00`).toISOString();

    const payload = {
      aluno: alunoSelecionado,
      dataHora: dataHoraISO,
    };
    
    console.log('[PAYLOAD] Dados que serão enviados para a API:', payload);

    // 3. Chamada à API (com a rota de teste sem segurança)
    try {
      const response = await axios.post(`${API_URL}/consultas/criar-horario`, payload);
      
      console.log('[SUCESSO] Resposta da API:', response.data);
      Alert.alert('Sucesso!', 'Novo horário disponível cadastrado com sucesso.');
      
      // Limpa o formulário
      setAlunoSelecionado(null);
      setDataHora('');

    } catch (error) {
      console.error('[ERRO] A chamada à API falhou. Detalhes do erro:', error.response?.data || error.message);
      Alert.alert('Erro ao Salvar', error.response?.data?.error || 'Não foi possível salvar o horário. Verifique os terminais.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingAlunos) {
    return <View style={styles.container}><ActivityIndicator size="large" /><Text>Carregando alunos...</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Adicionar Horário Disponível</Text>
      
      <Text style={styles.label}>Selecione o Aluno</Text>
      <View style={styles.pickerContainer}>
        <Picker 
            selectedValue={alunoSelecionado} 
            onValueChange={(itemValue) => {
                console.log('[INPUT] Aluno selecionado:', itemValue);
                setAlunoSelecionado(itemValue);
            }}
        >
          <Picker.Item label="-- Escolha um aluno --" value={null} />
          {alunos.map(aluno => <Picker.Item key={aluno._id} label={aluno.nome} value={aluno._id} />)}
        </Picker>
      </View>

      <Text style={styles.label}>Data e Hora da Consulta</Text>
      <TextInput
        style={styles.input}
        placeholder="AAAA-MM-DD HH:MM"
        value={dataHora}
        onChangeText={(text) => {
            console.log('[INPUT] Texto da data/hora alterado:', text);
            setDataHora(text);
        }}
      />

      <View style={{ marginTop: 20 }}>
        {isLoading ? (
            <ActivityIndicator size="large" color="#007BFF" />
        ) : (
            <Button title="Salvar Horário" onPress={handleSalvarHorario} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 20, fontSize: 16 },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 20 },
});