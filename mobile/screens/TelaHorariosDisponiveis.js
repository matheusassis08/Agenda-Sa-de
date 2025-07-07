import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image,
  Modal,
  TextInput,
  Button
} from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.1.80:3001'; // Use o IP da sua máquina local

export default function TelaHorariosDisponiveis({ userData }) {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedConsultaId, setSelectedConsultaId] = useState(null);
  const [motivo, setMotivo] = useState('');

  const fetchHorarios = async () => {
    try {
      const response = await axios.get(`${API_URL}/consultas/disponiveis`);
      setHorarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar horários:', error.message);
      Alert.alert('Erro', 'Não foi possível carregar os horários.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHorarios();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHorarios();
  };

  const abrirModal = (consultaId) => {
    setSelectedConsultaId(consultaId);
    setMotivo('');
    setModalVisible(true);
  };

  const confirmarAgendamento = async () => {
    if (!motivo.trim()) {
      Alert.alert('Erro', 'Você precisa informar um motivo.');
      return;
    }
    try {
      const payload = { clienteId: userData.id, motivo };
      await axios.put(`${API_URL}/consultas/agendar/${selectedConsultaId}`, payload);
      Alert.alert('Sucesso!', 'Seu pedido de agendamento foi enviado.');
      setModalVisible(false);
      fetchHorarios();
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.message || "Erro ao agendar.");
    }
  };

  const renderItem = ({ item }) => {
    const aluno = item.aluno || {};
    const fotoValida = aluno.foto && aluno.foto.startsWith('http');

    return (
      <TouchableOpacity style={styles.item} onPress={() => abrirModal(item._id)}>
        <View style={styles.row}>
          {fotoValida ? (
            <Image source={{ uri: aluno.foto }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{aluno.nome?.charAt(0) || 'U'}</Text>
            </View>
          )}
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.nome}>Atendimento com: {aluno.nome || 'N/A'}</Text>
            <Text style={styles.data}>
              Data: {new Date(item.dataHora).toLocaleDateString('pt-BR')}
            </Text>
            <Text style={styles.data}>
              Horário: {new Date(item.dataHora).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Solicitar Agendamento</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Horários Disponíveis</Text>
      <FlatList
        data={horarios}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text style={styles.subtitle}>Nenhum horário disponível no momento.</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      {/* Modal para inserir motivo */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Motivo do Agendamento</Text>
            <TextInput
              placeholder="Descreva o motivo..."
              value={motivo}
              onChangeText={setMotivo}
              style={styles.input}
              multiline
            />
            <View style={styles.modalButtons}>
              <Button title="Cancelar" color="gray" onPress={() => setModalVisible(false)} />
              <Button title="Confirmar" onPress={confirmarAgendamento} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, paddingHorizontal: 16, backgroundColor: '#f9f9f9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 30 },
  item: { padding: 20, marginVertical: 8, backgroundColor: '#fff', borderRadius: 10, elevation: 3 },
  nome: { fontSize: 18, fontWeight: '600' },
  data: { fontSize: 16, color: '#555', marginTop: 5 },
  button: { backgroundColor: '#007bff', padding: 10, borderRadius: 5, marginTop: 15, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  row: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#eee' },
  avatarPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { fontSize: 22, color: '#fff', fontWeight: 'bold' },
  modalBackground: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { width: '85%', backgroundColor: '#fff', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, height: 100, textAlignVertical: 'top', marginBottom: 10 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' }
});
