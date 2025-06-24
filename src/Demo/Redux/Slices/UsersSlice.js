import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import UsersApi from "../API/UsersApi";
import { message } from "antd";

// ----------- Thunks -----------

// Add a new user
export const AddUsersByAdmin = createAsyncThunk(
  "users/addUsersByAdmin",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await UsersApi.AddUsersByAdmin(payload);
      message.success("User added successfully");
      return response.data;
    } catch (error) {
      message.error("Failed to add user");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

// Get all users
export const GetAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await UsersApi.GetAllUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

// Update user
export const UpdateUsers = createAsyncThunk(
  "users/updateUsers",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await UsersApi.UpdateUsers(id, payload);
      message.success("User updated successfully");
      return response.data;
    } catch (error) {
      message.error("Failed to update user");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

// Delete user
export const DeleteUsers = createAsyncThunk(
  "users/deleteUsers",
  async (id, { rejectWithValue }) => {
    try {
      const response = await UsersApi.DeleteUsers(id);
      message.success("User deleted successfully");
      return id; // return only ID to filter locally
    } catch (error) {
      message.error("Failed to delete user");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

// Update user status
export const UpdateUsersStatus = createAsyncThunk(
  "users/updateUsersStatus",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await UsersApi.UpdateUsersStatus(id, data); // ✅ Pass both
    //   message.success("User status updated");
      return response.data;
    } catch (error) {
    //   message.error("Failed to update status");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);


// ----------- Slice -----------
const UsersSlice = createSlice({
  name: "users",
  initialState: {
    loading: false,
    error: null,
    users: [],
    
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Add
      .addCase(AddUsersByAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(AddUsersByAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(AddUsersByAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get
      .addCase(GetAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(GetAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(UpdateUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(UpdateUsers.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(UpdateUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(DeleteUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(DeleteUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
      })
      .addCase(DeleteUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update status
      .addCase(UpdateUsersStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(UpdateUsersStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(UpdateUsersStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default UsersSlice.reducer;
