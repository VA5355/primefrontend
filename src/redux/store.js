import { configureStore } from '@reduxjs/toolkit';
import modelSlice from '../components/common/service/ModalService';
import modalReducer, { createModalMiddleware } from '../components/common/service/ModalService';
import modalGenReducer from './slices/modalGenSlice';
import loadingReducer from './slices/loadingSlice';
import paymentReducer from './slices/paymentSlice';
const modalMiddleware = createModalMiddleware({
    mapRejectedToModal: (action) => ({
        title: 'Operation failed',
        message: action.payload?.message || action.error?.message || 'Request failed',
    }),
});
export const store = configureStore({
    reducer: {
        modalpayload: modelSlice,
        modal: modalReducer,
        modalpop: modalGenReducer,
        loader: loadingReducer,
        razorpay: paymentReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(modalMiddleware),
});
