import {configureStore} from '@reduxjs/toolkit';
import { CryptoSlice } from './CryptoSlice';
export const Store = configureStore({
    reducer:{
        crypto : CryptoSlice.reducer
    }
})