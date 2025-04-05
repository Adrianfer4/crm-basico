import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import AuthProvider from '@/context/AuthContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </Provider>
  );
}
