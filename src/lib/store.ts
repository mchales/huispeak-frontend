import { configureStore } from '@reduxjs/toolkit';

import navDataReducer from './features/nav/nav-slice';
import adventureDetailReducer from './features/adventure/adventure-slice';

export const store = configureStore({
  reducer: {
    navData: navDataReducer,
    adventureDetail: adventureDetailReducer,
  },
});
