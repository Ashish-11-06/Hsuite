import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authAPI from "../API/authApi";

// 🔹 Register User & Send OTP (combined)
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.registerUser(userData);
      //console.log("🔍 Registration API Response:", response.data);

      if (response.data.user_id) {
        return response.data; // { user_id: "3" }
      } else {
        return rejectWithValue("Failed to register user");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

// 🔹 Verify OTP
export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyOTP(otpData);
      //console.log("🔍 OTP Verification Response:", response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "OTP verification failed");
    }
  }
);

// 🔹 Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.loginUser(credentials);
      //console.log("🔹 Login Response:", response.data);

      if (!response.data || !response.data.token || !response.data.user) {
        return rejectWithValue("Invalid login response");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// 🔹 Update Profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);



const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!localStorage.getItem("token"), // Load from localStorage
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false,
    error: null,
    userId: null,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userId = action.payload.user_id; // Save user_id for OTP verification
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //login user
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
    
        //console.log("🔹 Login Successful:", action.payload); // Debugging Log
    
        localStorage.setItem("token", action.payload.token); // 🛠 Ensure token is stored
        localStorage.setItem("user", JSON.stringify(action.payload.user));
    
        window.location.href = "/"; // 🔥 Force Redirect After Login
    })
    
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      });
  },
});

export const { logout, loginSuccess } = authSlice.actions;
export default authSlice.reducer;
