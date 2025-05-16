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

// Send Reset OTP
export const sendResetOTP = createAsyncThunk(
  "auth/sendResetOTP",
  async (emailData, { rejectWithValue }) => {
    try {
      const response = await authAPI.sendResetOTP(emailData);
      return {
        success: true,
        message: response.data?.message || "OTP sent successfully",
        email: emailData.email,
        data: response.data
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to send OTP",
        error: error.response?.data
      });
    }
  }
);

// Verify Reset OTP
export const verifyResetOTP = createAsyncThunk(
  "auth/verifyResetOTP",
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await authAPI.verfiyResetOTP(otpData);
      return {
        success: true,
        message: response.data?.message || "OTP verified successfully",
        data: response.data
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "OTP verification failed",
        error: error.response?.data
      });
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await authAPI.ResetPassword(passwordData);
      return {
        success: true,
        message: response.data?.message || "Password reset successful",
        data: response.data
      };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Password reset failed",
        error: error.response?.data
      });
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
    resetPassword: {
      loading: false,
      error: null,
      success: false,
      email: null,
      step: 1 // 1 = email, 2 = OTP, 3 = new password
    }
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
    resetPasswordState: (state) => {
      state.resetPassword = {
        loading: false,
        error: null,
        success: false,
        email: null,
        step: 1
      };
    },
    setResetPasswordStep: (state, action) => {
      state.resetPassword.step = action.payload;
    }
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
        state.currentUserId = action.payload.id; 
    
        //console.log("🔹 Login Successful:", action.payload); // Debugging Log
    
        localStorage.setItem("token", action.payload.token); // 🛠 Ensure token is stored
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("role", action.payload.user.role);
    
        window.location.href = "/"; // 🔥 Force Redirect After Login
    })
    
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

     // Send Reset OTP
      .addCase(sendResetOTP.pending, (state) => {
        state.resetPassword.loading = true;
        state.resetPassword.error = null;
      })
      .addCase(sendResetOTP.fulfilled, (state, action) => {
        state.resetPassword.loading = false;
        state.resetPassword.email = action.payload.email;
        state.resetPassword.step = 2;
      })
      .addCase(sendResetOTP.rejected, (state, action) => {
        state.resetPassword.loading = false;
        state.resetPassword.error = action.payload?.message || "Failed to send OTP";
      })

      // Verify Reset OTP
      .addCase(verifyResetOTP.pending, (state) => {
        state.resetPassword.loading = true;
        state.resetPassword.error = null;
      })
      .addCase(verifyResetOTP.fulfilled, (state) => {
        state.resetPassword.loading = false;
        state.resetPassword.step = 3;
      })
      .addCase(verifyResetOTP.rejected, (state, action) => {
        state.resetPassword.loading = false;
        state.resetPassword.error = action.payload?.message || "OTP verification failed";
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.resetPassword.loading = true;
        state.resetPassword.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.resetPassword.loading = false;
        state.resetPassword.success = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPassword.loading = false;
        state.resetPassword.error = action.payload?.message || "Password reset failed";
      });
  },
});

export const { logout, loginSuccess, resetPasswordState, setResetPasswordStep } = authSlice.actions;
export default authSlice.reducer;
