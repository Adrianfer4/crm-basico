import { View, FlatList, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Button, Card } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function ClientsScreen() {
  const clients = useSelector((state: RootState) => state.clients);
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        padding: 16
      }}
    >
      <Button mode="contained" onPress={() => router.push('/new')}>
        Agregar Cliente
      </Button>

      <FlatList
        data={clients}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Card style={{ marginVertical: 8 }} onPress={() => router.push(`/${item.id}`)}>
            <Card.Title title={item.name} subtitle={item.email} />
          </Card>
        )}
      />
    </View>
  );
}
