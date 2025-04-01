import { Provider } from 'react-redux';
import { store } from '../store/store';
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack />
    </Provider>
  )
}
