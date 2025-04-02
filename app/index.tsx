import { View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Button, Card, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function ClientsScreen() {
  const clients = useSelector((state: RootState) => state.clients);
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: '#f4f4f4'
      }}
    >
      {clients.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 18 }}>No hay clientes aún</Text>
      ) : (
        <FlatList
          data={clients}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Card style={{ marginVertical: 8 }} onPress={() => router.push(`/${item.id}`)}>
              <Card.Title title={item.name} subtitle={item.email} />
            </Card>
          )}
        />
      )}

      <Button mode="contained" onPress={() => router.push('/new')} style={{ marginTop: 16 }}>
        Agregar Cliente
      </Button>
    </View>
  );
}
