import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userAPI from "../API/userApi";

// Thunks
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const res = await userAPI.getUsers();
  return res.data;
});

export const updateUser = createAsyncThunk("users/updateUser", async ({ id, data }) => {
  const res = await userAPI.updateUser(id, data);
  return res.data;
});

export const toggleUserActive = createAsyncThunk(
  "users/toggleUserActive",
  async (id) => {
    const res = await userAPI.toggleUserActive(id);
    return res.data;
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
      
           

  },
});

export default userSlice.reducer;
