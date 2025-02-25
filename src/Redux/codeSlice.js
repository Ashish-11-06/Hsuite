import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  codes: [], // Stores submitted codes
};

const codeSlice = createSlice({
  name: "codes",
  initialState,
  reducers: {
    addCode: (state, action) => {
      state.codes.push(action.payload); // Add new code data
    },
  },
});

export const { addCode } = codeSlice.actions;
export default codeSlice.reducer;
