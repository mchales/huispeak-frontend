// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';

import navDataReducer from './features/nav/nav-slice';
// import questDataReducer from './questDataSlice';

export const store = configureStore({
  reducer: {
    navData: navDataReducer,
    // questData: questDataReducer,
  },
});
