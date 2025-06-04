import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userAPI from "../API/userApi";

// Thunks
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const res = await userAPI.getUsers();
  return res.data;
});

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ( {id, data}, {rejectWithValue}) => {
    try{
      const response = await userAPI.updateUser(id, data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 
                            error.response?.data?.message ||
                            error.message ||
                            "failed to update";
      return rejectWithValue(errorMessage);
    }
});

export const toggleUserActive = createAsyncThunk(
  "users/toggleUserActive",
  async (id, {rejectWithValue}) => {
    try{
      const res = await userAPI.toggleUserActive(id);
      return res.data;
    }catch (err){
      const errorMessage = err.res?.data?.err || 
                            err.res?.data?.message ||
                            err.message ||
                            "failed to active";
      return rejectWithValue(errorMessage);
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userAPI.createUser(userData);
      return {
        user: response.data.user,
        message: response.data.message
      };
    } catch (error) {
       const errorMessage = error.response?.data?.error || 
                         error.response?.data?.message ||
                         error.message ||
                         "Failed to create user";
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const userSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      //fetch users functionality
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        // Map is_active from backend to disabled for UI
        state.list = action.payload.map(user => ({
          ...user,
          disabled: !user.is_active,
        }));
      })      
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
      })

      //update user edit functionality
      // .addCase(updateUser.fulfilled, (state, action) => {
      //   const updatedUser = action.payload.user || action.payload; // Handle both response formats
      //   state.list = state.list.map(user => 
      //     user.id === updatedUser.id ? updatedUser : user
      //   );
      // }) 
      
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload.user || action.payload;
        const userWithDisabled = {
          ...updatedUser,
          disabled: !updatedUser.is_active,
        };
        state.list = state.list.map(user =>
          user.id === userWithDisabled.id ? userWithDisabled : user
        );
      })
      

      //toggle user disable functionality
      .addCase(toggleUserActive.fulfilled, (state, action) => {
        const { user_id, is_active } = action.payload;
        state.list = state.list.map(user =>
          user.id === user_id ? { ...user, disabled: !is_active } : user
        );
      })
      
      .addCase(toggleUserActive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
    .addCase(createUser.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.user) {
        state.list.push({
          ...action.payload.user,
          disabled: !action.payload.user.is_active,
        });
      }
    })
    .addCase(createUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;  // Store the error message
    });

  },
});

export default userSlice.reducer;
