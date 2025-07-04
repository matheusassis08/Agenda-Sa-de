import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

// <<< VERIFICAÇÃO 1: A URL da API está correta? >>>
// Confirme se este é o IP da máquina onde o seu backend está a rodar.
const API_URL = 'http://192.168.100.8:3001'; 

// <<< VERIFICAÇÃO 2: A tela recebe 'userData' com o token? >>>
// A função agora recebe 'userData' como uma propriedade (prop).
export default function AdicionarHorarioScreen({ userData }) {
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
        // <<< VERIFICAÇÃO 3: A rota para buscar alunos está correta? >>>
        // A rota correta no seu backend é '/alunos'.
        const response = await axios.get(`${API_URL}/alunos`);
        setAlunos(response.data);
      } catch (error) {
        console.error("Erro ao carregar alunos:", error);
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
      return Alert.alert('Atenção', 'Por favor, selecione um aluno.');
    }

    const dataFinal = new Date(date);
    dataFinal.setHours(time.getHours());
    dataFinal.setMinutes(time.getMinutes());

    setIsLoading(true);

    try {
      // <<< VERIFICAÇÃO 4: O payload está no formato correto? >>>
      // O backend espera um campo chamado 'alunoId'.
      const payload = { 
        alunoId: alunoSelecionado, 
        dataHora: dataFinal.toISOString() 
      };

      // <<< VERIFICAÇÃO 5: A chamada à API envia o token de autenticação? >>>
      // A rota 'criar-horario' no seu backend é protegida.
      const config = {
        headers: { Authorization: `Bearer ${userData.token}` }
      };
      
      await axios.post(`${API_URL}/consultas/criar-horario`, payload, config);
      
      Alert.alert('Sucesso!', 'Novo horário disponível cadastrado com sucesso.');
      setAlunoSelecionado(null);

    } catch (error) {
      // <<< VERIFICAÇÃO 6: O log de erro está detalhado? >>>
      // Isto vai mostrar a mensagem de erro exata vinda do backend.
      console.error("ERRO AO ADICIONAR HORÁRIO:", error.response?.data || error.message);
      Alert.alert('Erro ao Salvar', error.response?.data?.message || 'Não foi possível salvar o horário.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Adicionar Horário Disponível</Text>
      
      <Text style={styles.label}>Selecione o Aluno</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={alunoSelecionado} onValueChange={setAlunoSelecionado}>
          <Picker.Item label="-- Escolha um aluno --" value={null} />
          {/* O 'value' do Picker deve ser o ID do aluno (aluno._id) */}
          {alunos.map(aluno => <Picker.Item key={aluno._id} label={aluno.nome} value={aluno._id} />)}
        </Picker>
      </View>

      <Text style={styles.label}>Data da Consulta</Text>
      <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
        <Text>{date.toLocaleDateString('pt-BR')}</Text>
        <MaterialIcons name="calendar-today" size={20} />
      </TouchableOpacity>

      <Text style={styles.label}>Hora da Consulta</Text>
      <TouchableOpacity style={styles.dateInput} onPress={() => setShowTimePicker(true)}>
        <Text>{time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</Text>
        <MaterialIcons name="access-time" size={20} />
      </TouchableOpacity>

      {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />}
      {showTimePicker && <DateTimePicker value={time} mode="time" display="default" onChange={onChangeTime} is24Hour={true} />}

      <View style={styles.buttonContainer}>
        {isLoading ? <ActivityIndicator /> : <Button title="Salvar Horário" onPress={handleAdicionarHorario} />}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8, marginTop: 10 },
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  dateInput: { borderWidth: 1, borderColor: '#ccc', padding: 15, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  buttonContainer: { marginTop: 20 }
});
