import React, { useEffect, useState } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const Drawer = createDrawerNavigator();
const API_URL = 'http://192.168.0.127:3001';

// Função para definir cor e texto do status
const getStatusStyle = (status) => {
  switch (status) {
    case 'confirmada': return { backgroundColor: '#2ecc71', text: 'Confirmada' };
    case 'pendente': return { backgroundColor: '#f1c40f', text: 'Pendente de Confirmação' };
    case 'disponivel': return { backgroundColor: '#95a5a6', text: 'Disponível' };
    default: return { backgroundColor: '#bdc3c7', text: status };
  }
};

// Tela da Agenda do Aluno
function AgendaAlunoScreen({ userData }) {
  const [agenda, setAgenda] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAgenda = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userData.token}` } };
      const response = await axios.get(`${API_URL}/consultas/aluno`, config);
      setAgenda(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar a sua agenda.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAgenda(); }, []);
  const onRefresh = () => { setRefreshing(true); fetchAgenda(); };

  const renderItem = ({ item }) => {
    const statusInfo = getStatusStyle(item.status);
    return (
      <View style={styles.item}>
        <Text style={styles.itemTitle}>
          Cliente: {item.cliente?.nome || <Text style={styles.vagoText}>Horário Vago</Text>}
        </Text>
        <Text style={styles.itemText}>Data: {new Date(item.dataHora).toLocaleString('pt-BR')}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.backgroundColor }]}>
          <Text style={styles.statusText}>{statusInfo.text}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minha Agenda</Text>
      <FlatList
        data={agenda}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={<Text style={styles.emptyText}>Você ainda não possui horários cadastrados.</Text>}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  );
}

// Dashboard do Aluno
export default function DashboardAluno({ route, navigation }) {
  const { userData } = route.params;

  return (
    <Drawer.Navigator
      initialRouteName="Minha Agenda"
      screenOptions={{
        drawerActiveTintColor: '#007bff',
        drawerLabelStyle: { fontSize: 16 },
        headerShown: true,
      }}
      drawerContent={(props) => (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem
            label="Sair"
            icon={({ color, size }) => <Ionicons name="exit-outline" size={size} color="red" />}
            onPress={() => navigation.replace('Login')}
            labelStyle={{ color: 'red', fontWeight: 'bold' }}
          />
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
        name="Minha Agenda"
        options={{
          drawerIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />
        }}
      >
        {(props) => <AgendaAlunoScreen {...props} userData={userData} />}
      </Drawer.Screen>

      {/* Outras telas futuras podem ser adicionadas aqui */}
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  emptyText: { textAlign: 'center', marginTop: 30, fontSize: 16, color: 'gray' },
  item: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginVertical: 8, elevation: 2 },
  itemTitle: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  itemText: { fontSize: 16, color: '#555', marginTop: 4 },
  vagoText: { fontStyle: 'italic', color: '#7f8c8d' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 15, alignSelf: 'flex-start', marginTop: 10 },
  statusText: { color: 'white', fontWeight: 'bold' },
});

