//🧩 1. Redux Slice (paymentBharatPeSlice.ts)
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
//import { REACT_APP_RAZORORDERANDPAYMENTURL } from '../../libs/client';
//import { REACT_APP_RAZORORDERANDPAYMENTURL_LOCAL } from '../../libs/client';
//import { REACT_APP_NGROKLOCALHOST } from '../../libs/client';
import { REACT_APP_BHARATPEORDERANDPAYMENTURL } from '../../libs/client';
import { REACT_APP_BHARATPEORDERANDPAYMENTURL_LOCAL } from '../../libs/client';
import { REACT_APP_NGROKLOCALHOST } from '../../libs/client';
export const createOrder = createAsyncThunk("payment/createOrder", async (payload, { rejectWithValue }) => {
    try {
        const baseUrl = (window.location.hostname === `${REACT_APP_NGROKLOCALHOST}` || window.location.hostname === 'localhost')
            //  window.location.hostname === `${REACT_APP_NGROKLOCALHOST}`
            ? `${REACT_APP_BHARATPEORDERANDPAYMENTURL_LOCAL}`
            : `${REACT_APP_BHARATPEORDERANDPAYMENTURL}`;
        // https://onedinaar.com
        /*const res = await axios.get(
          `${baseUrl}/api/razorpayorder/create`,
          {
            params: payload,
            withCredentials: true,
          }
        ); */
        const { name, amount, currency, receipt, location, description, nonce, cart, deliveryInfo } = payload;
        const res = await axios.post(`${baseUrl}/api/bharatpeorder/create`, {
            name,
            amount,
            currency,
            receipt,
            location,
            description,
            nonce,
            cart,
            deliveryInfo
        }); ///JSON.stringify(payload)
        console.log('paymentBharatPeSlice received bharatpeorder with upi link  :: ' + JSON.stringify(res.data));
        return res.data;
    }
    catch (err) {
        console.log('paymentBharatPeSlice error :: ' + JSON.stringify(err));
        // Extract the target error object or payload
        const errorData = err.response?.data || err;
        // Helper function to find the first non-empty text value across any key
        const extractErrorMessage = (obj) => {
            if (!obj)
                return null;
            // If it's already a plain non-empty string, return it
            if (typeof obj === 'string' && obj.trim() !== '') {
                return obj.trim();
            }
            // If it's an object, iterate through its keys
            if (typeof obj === 'object') {
                for (const key of Object.keys(obj)) {
                    const val = obj[key];
                    // Recursively check nested strings or objects
                    const foundText = extractErrorMessage(val);
                    if (foundText) {
                        return foundText;
                    }
                }
            }
            return null;
        };
        // Find the text message or fall back to default
        const extractedMessage = extractErrorMessage(errorData) || "Order failed";
        return rejectWithValue(err.response?.data || "Order failed");
    }
});
const initialState = {
    order: null,
    loading: null,
    error: null,
    success: null,
};
const paymentBharatPeSlice = createSlice({
    name: "paymentBharatPe",
    initialState: initialState,
    reducers: {
        paymentSuccess: (state, action) => {
            state.success = action.payload;
        },
        paymentFailure: (state, action) => {
            state.error = action.payload;
        },
        resetPayment: (state) => {
            state.order = null;
            state.error = null;
            state.success = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrder.pending, (state) => {
            state.loading = true;
        })
            .addCase(createOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.order = action.payload;
        })
            .addCase(createOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});
export const { paymentSuccess, paymentFailure, resetPayment } = paymentBharatPeSlice.actions;
// --- SELECTORS ---
/** * Selects the raw payment data .
 * Useful for creating virtual user sccount components.
 */
export const selectPaymentData = (state) => state.razorpayment;
export default paymentBharatPeSlice.reducer;
