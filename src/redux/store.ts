import { configureStore } from '@reduxjs/toolkit';
 
import paymentSlice,{  RazorPaymentSliceProps } from './slices/paymentSlice';
import paymentBharatPeSlice,{  BharatPePaymentSliceProps } from './slices/paymentBharatPeSlice';
import {    ModalSliceProps } from '../components/common/service/ModalService';
import   modelSlice      from '../components/common/service/ModalService';

import modalReducer, { createModalMiddleware } from '../components/common/service/ModalService';
import modalGenReducer from './slices/modalGenSlice';
import loadingReducer from './slices/loadingSlice';
 
import paymentReducer  from './slices/paymentSlice';
import paymentBhartPeReducer  from './slices/paymentBharatPeSlice';

export interface GlobalState {
 
     razorpayment: RazorPaymentSliceProps,
     bhartpepayment: BharatPePaymentSliceProps,
     modalpayload: ModalSliceProps
}
const modalMiddleware = createModalMiddleware({
        mapRejectedToModal: (action:any) => ({
        title: 'Operation failed',
        message: action.payload?.message || action.error?.message || 'Request failed',
        }),
});
export const store = configureStore({
	reducer: {
     
        modalpayload: modelSlice, // <-- THIS makes razororderslice  available
         modal: modalReducer ,
         modalpop : modalGenReducer,
         loader: loadingReducer,
       
         razorpay:paymentReducer,
        bharatpe:paymentBhartPeReducer

	},
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(modalMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
