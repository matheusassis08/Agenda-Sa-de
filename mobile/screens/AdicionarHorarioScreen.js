import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons'; // Ícones para um visual melhor

const API_URL = 'http://192.168.1.10:3001'; // <-- VERIFIQUE SE SEU IP CONTINUA O MESMO

export default function AdicionarHorarioScreen() {
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/alunos`);
        setAlunos(response.data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar a lista de alunos.');
      }
    };
    fetchAlunos();
  }, []);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) setTime(selectedTime);
  };

  const handleAdicionarHorario = async () => {
    if (!alunoSelecionado) {
      return Alert.alert('Erro', 'Por favor, selecione um aluno.');
    }

    const dataFinal = new Date(date);
    dataFinal.setHours(time.getHours());
    dataFinal.setMinutes(time.getMinutes());
    dataFinal.setSeconds(0);

    setIsLoading(true);

    try {
      // --- CHAMADA AXIOS CORRIGIDA ---
      // Removida a lógica de token e headers, pois desativamos a segurança no backend para teste.
      await axios.post(`${API_URL}/consultas/criar-horario`, { 
        aluno: alunoSelecionado, 
        dataHora: dataFinal.toISOString() 
      });
      
      Alert.alert('Sucesso!', 'Novo horário disponível cadastrado com sucesso.');
      // Limpa os campos para um novo cadastro
      setAlunoSelecionado(null);
      setDate(new Date());
      setTime(new Date());

    } catch (error) {
      console.error("ERRO AO CRIAR HORÁRIO:", error.response?.data);
      Alert.alert('Erro ao Salvar', error.response?.data || 'Não foi possível salvar o horário.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Adicionar Horário Disponível</Text>
      
      <Text style={styles.label}>Selecione o Aluno</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={alunoSelecionado} onValueChange={setAlunoSelecionado} style={styles.picker}>
          <Picker.Item label="-- Escolha um aluno --" value={null} />
          {alunos.map(aluno => <Picker.Item key={aluno._id} label={aluno.nome} value={aluno._id} />)}
        </Picker>
      </View>

      <Text style={styles.label}>Data da Consulta</Text>
      <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>{date.toLocaleDateString('pt-BR')}</Text>
        <MaterialIcons name="calendar-today" size={20} color="#555" />
      </TouchableOpacity>

      <Text style={styles.label}>Hora da Consulta</Text>
      <TouchableOpacity style={styles.dateInput} onPress={() => setShowTimePicker(true)}>
        <Text style={styles.dateText}>{time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
        <MaterialIcons name="access-time" size={20} color="#555" />
      </TouchableOpacity>

      {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />}
      {showTimePicker && <DateTimePicker value={time} mode="time" display="default" onChange={onChangeTime} is24Hour={true} />}

      <View style={styles.buttonContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#3498db" />
        ) : (
          <Button title="Salvar Horário" onPress={handleAdicionarHorario} color="#3498db" />
        )}
      </View>
    </ScrollView>
  );
}

// --- ESTILOS COMPLETOS E CORRIGIDOS ---
const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    padding: 24, 
    backgroundColor: '#f5f5f5' 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 30, 
    color: '#2c3e50' 
  },
  label: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 8, 
    color: '#34495e',
    marginTop: 10,
  },
  pickerContainer: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    marginBottom: 16,
    backgroundColor: 'white'
  },
  picker: {
    height: 50,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  dateText: {
    fontSize: 16,
    color: '#333'
  },
  buttonContainer: {
    marginTop: 20
  }
});