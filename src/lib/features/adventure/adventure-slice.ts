// lib/features/adventure/adventure-slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

interface AdventureDetailState {
  adventure: {
    id: number;
    title: string;
    description: string;
    adventure_num: number;
    story: {
      id: number;
      title: string;
      description: string;
      story_num: number;
    };
  } | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AdventureDetailState = {
  adventure: null,
  status: 'idle',
  error: null,
};

export const fetchAdventureDetail = createAsyncThunk(
  'adventureDetail/fetchAdventureDetail',
  async (adventureId: number, thunkAPI) => {
    try {
      const response = await axiosInstance.get(endpoints.storyline.adventure(adventureId));
      return response.data.adventure;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const adventureDetailSlice = createSlice({
  name: 'adventureDetail',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdventureDetail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAdventureDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.adventure = action.payload;
      })
      .addCase(fetchAdventureDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default adventureDetailSlice.reducer;
