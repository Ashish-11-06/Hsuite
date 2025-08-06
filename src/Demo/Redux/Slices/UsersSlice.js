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
      message.success(response.data.message || "user added Successfull");
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
      message.success(response.data.message || "user status updated");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Error"
      );
    }
  }
);

//update doctor avaliability
export const UpdateDoctorAvaliability = createAsyncThunk(
  "users/updateDoctorAvaliability",
  async ({ doctor_id, is_doctor_available }, { rejectWithValue }) => {
    try {
      const response = await UsersApi.UpdateDoctorAvaliability(doctor_id, is_doctor_available);
      message.success(response.data.message || "doctor avaliablity done")
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "error"
      )
    }
  }
);

//get availaiable doctors
export const GetAvaliableDoctors = createAsyncThunk(
  "users/getAvaliableDoctors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await UsersApi.GetAvaliableDoctors();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "error"
      )
    }
  }
);

// get hms user by id and hospital
export const GetHMSUserByIdAndHospital = createAsyncThunk(
  "users/getHMSUserByIdAndHospital",
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await UsersApi.GetHMSUserByIdAndHospital(user_id);
      return response.data;
    } catch (error) {
      message.error("Failed to fetch user by ID and hospital");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

//post doctor profile
export const PostDoctorProfile = createAsyncThunk(
  "users/postdoctorprofile",
  async (data, {rejectWithValue}) => {
    try{
      const response = await UsersApi.PostDoctorProfile(data);
       message.success(response.data.message || " added Successfull");
      return response.data;
    } catch (error) {
      message.error(error.response?.data?.messgae ||
        error.response?.data?.photo|| "Failed to post");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

//update doctor profile
export const UpdateDoctorProfile = createAsyncThunk(
  "users/updatedoctorprofile",
  async ({user_id, data}, {rejectWithValue}) => {
    try{
      const response = await UsersApi.UpdateDoctorProfile(user_id, data);
      message.success(response.data.message || "added successfully");
      return response.data;
    } catch (error) {
      message.error(error.response?.data?.messgae ||
        error.response?.data?.photo|| "Failed to post");
      return rejectWithValue(error.response?.data || "error");
    }
  }
);

// ----------- Slice -----------
const UsersSlice = createSlice({
  name: "users",
  initialState: {
    doctorData: null,
    loading: false,
    error: null,
    users: [],
    hmsUser: null,

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
      })

      .addCase(UpdateDoctorAvaliability.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UpdateDoctorAvaliability.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorData = action.payload;
      })
      .addCase(UpdateDoctorAvaliability.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(GetAvaliableDoctors.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetAvaliableDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(GetAvaliableDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //get hms user by id and hospital
      .addCase(GetHMSUserByIdAndHospital.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetHMSUserByIdAndHospital.fulfilled, (state, action) => {
        state.loading = false;
        state.hmsUser = action.payload;
      })
      .addCase(GetHMSUserByIdAndHospital.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Post doctor profile
      .addCase(PostDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(PostDoctorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorData = action.payload;
      })
      .addCase(PostDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update doctor profile
      .addCase(UpdateDoctorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UpdateDoctorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorData = action.payload;
      })
      .addCase(UpdateDoctorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export default UsersSlice.reducer;
