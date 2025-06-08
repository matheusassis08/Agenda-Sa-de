import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

export default function AdicionarHorarioScreen() {
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await axios.get('http://192.168.0.127:3001/api/users/alunos');
        setAlunos(response.data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar a lista de alunos.');
      }
    };
    fetchAlunos();
  }, []);

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const formatarDataBrasileira = (date) => date.toLocaleDateString('pt-BR');
  const formatarHora = (date) => date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const handleAdicionarHorario = async () => {
    if (!alunoSelecionado) {
      return Alert.alert('Erro', 'Por favor, selecione um aluno.');
    }

    // --- LÓGICA DE DATA E HORA CORRIGIDA ---
    const dataFinal = new Date(date);
    dataFinal.setHours(time.getHours());
    dataFinal.setMinutes(time.getMinutes());
    dataFinal.setSeconds(0);
    // --- FIM DA CORREÇÃO ---

    // =========================================================================
    // ATENÇÃO: PARA TESTAR, VOCÊ PRECISA DE UM TOKEN DE COORDENADOR VÁLIDO.
    // Faça login como coordenador e cole o token recebido aqui.
    const tokenCoordenador = "COLE_SEU_TOKEN_DE_COORDENADOR_AQUI";
    // =========================================================================

    if (tokenCoordenador.startsWith("COLE_SEU_TOKEN")) {
      return Alert.alert('Atenção', 'Insira um token de coordenador válido no código para testar.');
    }

    try {
      await axios.post('http://192.168.0.127:3001/consultas/criar-horario', 
        {
          aluno: alunoSelecionado,
          dataHora: dataFinal.toISOString(), // Envia a data e hora combinadas
        }, 
        {
          headers: {
            'Authorization': `Bearer ${tokenCoordenador}`
          }
        }
      );

      Alert.alert('Sucesso!', 'Novo horário disponível cadastrado com sucesso.');
      setAlunoSelecionado(null);
      setDate(new Date());
      setTime(new Date());

    } catch (error) {
      console.error("ERRO AO CRIAR HORÁRIO:", error.response?.data);
      Alert.alert('Erro ao Salvar', error.response?.data || 'Não foi possível salvar o horário.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Adicionar Horário Disponível</Text>
        
        <Text style={styles.label}>Selecione o Aluno</Text>
        <View style={styles.pickerContainer}>
            <Picker
                selectedValue={alunoSelecionado}
                onValueChange={(itemValue) => setAlunoSelecionado(itemValue)}
                style={styles.picker}
            >
                <Picker.Item label="-- Escolha um aluno --" value={null} />
                {alunos.map((aluno) => (
                    <Picker.Item key={aluno._id} label={aluno.nome} value={aluno._id} />
                ))}
            </Picker>
        </View>

        <Text style={styles.label}>Data da Consulta</Text>
        <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>{formatarDataBrasileira(date)}</Text>
            <MaterialIcons name="calendar-today" size={20} color="#555" />
        </TouchableOpacity>

        <Text style={styles.label}>Hora da Consulta</Text>
        <TouchableOpacity style={styles.dateInput} onPress={() => setShowTimePicker(true)}>
            <Text style={styles.dateText}>{formatarHora(time)}</Text>
            <MaterialIcons name="access-time" size={20} color="#555" />
        </TouchableOpacity>

        {showDatePicker && (
            <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onChangeDate}
            />
        )}

        {showTimePicker && (
            <DateTimePicker
                value={time}
                mode="time"
                display="default"
                onChange={onChangeTime}
                is24Hour={true}
            />
        )}

        <TouchableOpacity style={styles.button} onPress={handleAdicionarHorario}>
            <Text style={styles.buttonText}>Salvar Horário</Text>
        </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 30, color: '#2c3e50' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, color: '#34495e', marginTop: 10 },
  pickerContainer: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 16, backgroundColor: 'white' },
  picker: { height: 50 },
  dateInput: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 8, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' },
  dateText: { fontSize: 16, color: '#333' },
  button: { backgroundColor: '#3498db', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});