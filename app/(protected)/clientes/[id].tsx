// (protected)/clientes/[id].tsx
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function DetalleClienteScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View>
      <Text>Detalle Cliente - {id}</Text>
    </View>
  );
}
