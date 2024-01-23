import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { userApi } from './services/user';
import { productApi } from './services/product';
import { orderApi } from './services/order';
import cartReducer from './services/cartSlice';
import userReducer from './services/userSlice';

const rootReducer = combineReducers({
  [userApi.reducerPath]: userApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  cart: cartReducer,
  user: userReducer,
});
const reducer = (state: any, action: any) => {
  if (action.type === 'USER_LOGOUT') {
    return rootReducer(undefined, action);
  }
  return rootReducer(state, action);
};

export const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: { warnAfter: 128 },
      serializableCheck: false,
    }).concat(userApi.middleware, productApi.middleware, orderApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
