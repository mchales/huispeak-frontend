// src/store/navDataSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios, { endpoints } from 'src/utils/axios';


interface Quest {
  id: number;
  title: string;
}

interface Adventure {
  id: number;
  title: string;
  quests: Quest[];
}

interface Story {
  id: number;
  title: string;
  adventures: Adventure[];
}

interface NavDataState {
  stories: Story[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: NavDataState = {
  stories: [],
  status: 'idle',
  error: null,
};

export const fetchNavContent = createAsyncThunk('navData/fetchNavContent', async (_, thunkAPI) => {
  try {
    const response = await axios.get(endpoints.storyline.list);
    return response.data.stories;
  } catch (err) {
    return thunkAPI.rejectWithValue(err);
  }
});

const navDataSlice = createSlice({
  name: 'navData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNavContent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNavContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stories = action.payload;
      })
      .addCase(fetchNavContent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default navDataSlice.reducer;
