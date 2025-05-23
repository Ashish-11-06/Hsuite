import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import egotreatApi from '../API/egotreatApi';


// ✅ Initial state
const initialState = {
  loading: false,
  success: false,
  error: null,
  data: null,
};

// ✅ Slice
const egotreatSlice = createSlice({
  name: 'egotreatment',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      
  },
});

// ✅ Export actions and reducer
export const {  } = egotreatSlice.actions;
export default egotreatSlice.reducer;
