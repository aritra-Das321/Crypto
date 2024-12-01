import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    cryptoData: [],
    loading: false,
    error: null,
};

export const getCrypto = createAsyncThunk('getCrypto', async () => {
    try {
        const response = await axios.get("https://api.coincap.io/v2/assets");
        return response.data; 
    } catch (error) {
        throw new Error(error.message);
    }
});

export const CryptoSlice = createSlice({
    name: 'cryptodata',
    initialState,
    reducers: {
        editData: (state, action) => {
            state.cryptoData = action.payload;  
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCrypto.pending, (state) => {
                state.loading = true;
                state.error = null; 
            })
            .addCase(getCrypto.fulfilled, (state, action) => {
                state.loading = false;
                state.cryptoData = action.payload.data; 
            })
            .addCase(getCrypto.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message; 
            });
    }
});

export const { editData } = CryptoSlice.actions;
export default CryptoSlice.reducer;
