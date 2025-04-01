import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

const initialState: Client[] = [];

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    addClient: (state, action: PayloadAction<Client>) => {
      state.push(action.payload); 
    },
    removeClient: (state, action: PayloadAction<string>) => {
      return state.filter(client => client.id !== action.payload); 
    },
    updateClient: (state, action: PayloadAction<Client>) => {
      const index = state.findIndex(client => client.id === action.payload.id);
      if (index !== -1) state[index] = action.payload; 
    }
  }
});

export const { addClient, removeClient, updateClient } = clientsSlice.actions;
export default clientsSlice.reducer;
