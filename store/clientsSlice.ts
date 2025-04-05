import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppDispatch } from "./store";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  address?: string;
  company?: string;
  tags?: string[];
  history?: { date: string; note: string }[];
}

interface ClientState {
  clients: Client[];
  recentClients: Client[];
}

const initialState: ClientState = {
  clients: [],
  recentClients: [],
};

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    setClients: (state, action: PayloadAction<ClientState>) => {
      state.clients = action.payload.clients;
      state.recentClients = action.payload.recentClients;
    },
    addClient: (state, action: PayloadAction<Client>) => {
      state.clients.push(action.payload);
      state.recentClients.unshift(action.payload);
      if (state.recentClients.length > 5) state.recentClients.pop();
      saveClientsToStorage(state.clients, state.recentClients);
    },
    updateClient: (state, action: PayloadAction<Client>) => {
      const index = state.clients.findIndex(
        (client) => client.id === action.payload.id
      );
      if (index !== -1) state.clients[index] = action.payload;

      const recentIndex = state.recentClients.findIndex(
        (client) => client.id === action.payload.id
      );
      if (recentIndex !== -1) {
        state.recentClients[recentIndex] = action.payload;
      }

      saveClientsToStorage(state.clients, state.recentClients);
    },
    removeClient: (state, action: PayloadAction<string>) => {
      state.clients = state.clients.filter(
        (client) => client.id !== action.payload
      );
      state.recentClients = state.recentClients.filter(
        (client) => client.id !== action.payload
      );
      saveClientsToStorage(state.clients, state.recentClients);
    },
  },
});

const saveClientsToStorage = async (
  clients: Client[],
  recentClients: Client[]
) => {
  await AsyncStorage.setItem("clients", JSON.stringify(clients));
  await AsyncStorage.setItem("recentClients", JSON.stringify(recentClients));
};

export const loadClients = () => async (dispatch: AppDispatch) => {
  const storedClients = await AsyncStorage.getItem("clients");
  const storedRecentClients = await AsyncStorage.getItem("recentClients");

  dispatch(
    clientsSlice.actions.setClients({
      clients: storedClients ? JSON.parse(storedClients) : [],
      recentClients: storedRecentClients ? JSON.parse(storedRecentClients) : [],
    })
  );
};

export const { addClient, updateClient, removeClient } = clientsSlice.actions;
export default clientsSlice.reducer;
