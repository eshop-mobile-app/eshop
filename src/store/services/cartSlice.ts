import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { userCart: [] },
  reducers: {
    setUserCart: (state, action) => {
      state.userCart = action.payload;
    },
  },
});

export const { setUserCart } = cartSlice.actions;
export default cartSlice.reducer;
