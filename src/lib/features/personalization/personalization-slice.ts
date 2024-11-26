import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

interface Personalization {
  id: number;
  difficulty: number;
  personal_details: string;
}

interface PersonalizationState {
  personalization: Personalization | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PersonalizationState = {
  personalization: null,
  status: 'idle',
  error: null,
};

// Async thunk to fetch personalization data
export const fetchPersonalization = createAsyncThunk(
  'personalization/fetchPersonalization',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get(endpoints.personalization.list);
      const {data} = response;
      if (Array.isArray(data) && data.length > 0) {
        return data[0];
      } 
        return null;
      
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

// Async thunk to update personalization data
export const updatePersonalization = createAsyncThunk(
  'personalization/updatePersonalization',
  async (updatedData: { difficulty: number; personal_details: string }, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as { personalization: PersonalizationState };
      const {personalization} = state.personalization;
      if (personalization) {
        const response = await axiosInstance.put(
          endpoints.personalization.detail(personalization.id),
          updatedData
        );
        return response.data;
      } 
        // Create a new personalization if none exists
        const response = await axiosInstance.post(endpoints.personalization.list, updatedData);
        return response.data;
      
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const personalizationSlice = createSlice({
  name: 'personalization',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPersonalization.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPersonalization.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.personalization = action.payload;
      })
      .addCase(fetchPersonalization.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(updatePersonalization.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updatePersonalization.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.personalization = action.payload;
      })
      .addCase(updatePersonalization.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default personalizationSlice.reducer;
