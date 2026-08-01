/*
export interface VitualAccountSliceProps {
    loader: boolean,
    isActivated: boolean,
    creationDate: string,
    expiration: any,
     underlyingOrderId:any
    platformType: string    // Fyers , Upstoc in case in future empanelled
}
const initialState:VitualAccountSliceProps = {
    loader: false,
    isActivated: false,
    creationDate: '',
    expiration: '',
    underlyingOrderId: '',
    platformType: "virtual"
}
*/ import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const activateVirtualAccount = createAsyncThunk("virtualAccount/activate", async (payload, { rejectWithValue }) => {
    try {
        const baseUrl = window.location.hostname === `${process.env.REACT_APP_NGROKLOCALHOST}`
            ? "http://localhost:8888"
            : "https://192.168.1.101:8000"; // https://onedinaar.com
        console.log(`virtualAccountSlice  payload ${JSON.stringify(payload)}`);
        const res = await axios.post(`${baseUrl}/.netlify/functions/netlifyproxyvirtualaccountmongo/api/register`, payload, { withCredentials: true });
        console.log(`virtualAccountSlice  netlifyproxyvirtualaccountmongo response ${JSON.stringify(res.data)}`);
        return res.data;
    }
    catch (err) {
        // return rejectWithValue(err.response?.data || "Activation failed");
        if (err?.response?.data?.code === "SERVER_BUSY") {
            return rejectWithValue(err?.response?.data?.message ||
                "Server registrations are currently at peak. Please retry after some time.");
        }
        else
            return rejectWithValue("Server issues. Please retry after some time.");
    }
});
const initialState = {
    loader: false,
    isActivated: false,
    user: null,
    error: null,
};
const virtualAccountSlice = createSlice({
    name: "virtualAccount",
    initialState,
    reducers: {
        logoutVirtual: (state) => {
            state.isActivated = false;
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(activateVirtualAccount.pending, (state) => {
            state.loader = true;
        })
            .addCase(activateVirtualAccount.fulfilled, (state, action) => {
            state.loader = false;
            state.isActivated = true;
            state.user = action.payload;
        })
            .addCase(activateVirtualAccount.rejected, (state, action) => {
            state.loader = false;
            state.error = action.payload;
        });
    }
});
export const { logoutVirtual } = virtualAccountSlice.actions;
export default virtualAccountSlice.reducer;
