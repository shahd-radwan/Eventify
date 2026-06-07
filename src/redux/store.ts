import { configureStore } from '@reduxjs/toolkit';
import { counterReducer } from './slices/counterSlice';

export const store = configureStore({
  reducer: {
   counter: counterReducer
  //  products : productsReducer
  },
});

export default store;



// export type RootState =ReturnType<typeof store.getState>;
// export type RootDispatch =typeof store.dispatch;
