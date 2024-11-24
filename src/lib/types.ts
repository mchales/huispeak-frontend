import type { store } from './store';

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export interface QuestDetailState {
  quest: {
    id: number;
    title: string;
    description: string;
    quest_num: number;
    image_name: string;
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
