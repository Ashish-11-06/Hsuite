import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userData: null, // Stores login and registration data
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload; // ✅ Store user data
    },
  },
});

export const { setUserData } = profileSlice.actions;
export default profileSlice.reducer;
