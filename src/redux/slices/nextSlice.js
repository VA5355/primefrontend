import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    productData: [],
    favoriteData: [],
    userInfo: null,
};
export const nextSlice = createSlice({
    name: "next",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = state.productData.find((item) => item.id === action.payload.id);
            if (item) {
                item.quantity += action.payload.quantity;
            }
            else {
                state.productData.push(action.payload);
            }
        },
        increaseQuantity: (state, action) => {
            const item = state.productData.find((item) => item.id === action.payload);
            if (item) {
                item.quantity++;
            }
        },
        decreaseQuantity: (state, action) => {
            const item = state.productData.find((item) => item.id === action.payload);
            if (item && item.quantity > 1) {
                item.quantity--;
            }
        },
        deleteItem: (state, action) => {
            state.productData = state.productData.filter((item) => item.id !== action.payload);
        },
        resetCart: (state) => {
            state.productData = [];
        },
        addToFavorite: (state, action) => {
            const item = state.favoriteData.find((item) => item.id === action.payload.id);
            if (!item) {
                state.favoriteData.push(action.payload);
            }
        },
        deleteFavorite: (state, action) => {
            state.favoriteData = state.favoriteData.filter((item) => item.id !== action.payload);
        },
        resetFavorite: (state) => {
            state.favoriteData = [];
        },
        addUser: (state, action) => {
            state.userInfo = action.payload;
        },
        removeUser: (state) => {
            state.userInfo = null;
        },
    },
});
export const { addToCart, increaseQuantity, decreaseQuantity, deleteItem, resetCart, addToFavorite, deleteFavorite, resetFavorite, addUser, removeUser, } = nextSlice.actions;
export default nextSlice.reducer;
