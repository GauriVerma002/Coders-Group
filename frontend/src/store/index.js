import { configureStore } from  '@reduxjs/toolkit';
import authReducer from './authSlice';
import activate from './activateSlice';

export const store = configureStore({
    reducer:{
         auth: authReducer,
         activate : activate,
    },
});