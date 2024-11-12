// lib/features/quest/quest-slice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios';

interface QuestDetailState {
  quest: {
    id: number;
    title: string;
    description: string;
    quest_num: number;
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
    };
    objectives: { id: string; objective: string }[];
    assistant_id: string | null;
  } | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: QuestDetailState = {
  quest: null,
  status: 'idle',
  error: null,
};

export const fetchQuestDetail = createAsyncThunk(
  'questDetail/fetchQuestDetail',
  async (questId: number, thunkAPI) => {
    try {
      const response = await axiosInstance.get(endpoints.storyline.quest(questId));
      return response.data.quest;
    } catch (err) {
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const questDetailSlice = createSlice({
  name: 'questDetail',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestDetail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchQuestDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.quest = action.payload;
      })
      .addCase(fetchQuestDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default questDetailSlice.reducer;
