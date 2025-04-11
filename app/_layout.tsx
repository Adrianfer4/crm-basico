import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { AuthProvider } from '@/context/AuthContext';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,  
    shouldPlaySound: true,  
    shouldSetBadge: false, 
  }),
});


export default function RootLayout() {
  useEffect(() => {
    const pedirPermiso = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso necesario', 'Activa las notificaciones en ajustes');
      }
    };
    pedirPermiso();
  }, []);
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Provider store={store}>
      <AuthProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </Provider>
    </GestureHandlerRootView>
  );
}
