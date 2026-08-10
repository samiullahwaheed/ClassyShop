import { createSlice } from '@reduxjs/toolkit';

function lineKey(item) {
  return `${item.productId}__${item.size || ''}__${item.weight || ''}`;
}

const initialState = {
  items: [], // { productId, name, image, price, oldPrice, quantity, size, weight, stock }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const incoming = action.payload;
      const existing = state.items.find((i) => lineKey(i) === lineKey(incoming));
      if (existing) {
        existing.quantity += incoming.quantity;
      } else {
        state.items.push(incoming);
      }
    },
    updateQuantity: (state, action) => {
      const { key, quantity } = action.payload;
      const item = state.items.find((i) => lineKey(i) === key);
      if (item) item.quantity = Math.max(1, quantity);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((i) => lineKey(i) !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, updateQuantity, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export { lineKey };
