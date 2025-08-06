import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import IpdApi from "../API/IpdApi";
import { message } from "antd";

// ✅ Post Ward Thunk
export const postWard = createAsyncThunk(
  "ipd/postWard",
  async (wardData, { rejectWithValue }) => {
    try {
      const response = await IpdApi.PostWard(wardData);
      message.success(response.data.message || "Ward added successfully!");
      return response.data;
    } catch (error) {
      message.error("An error occurred while adding the ward.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ Post Bed Thunk
export const postBed = createAsyncThunk(
  "ipd/postBed",
  async (bedData, { rejectWithValue }) => {
    try {
      const response = await IpdApi.PostBed(bedData);
      message.success(response.data.message || "Bed added successfully!");
      return response.data;
    } catch (error) {
      message.error("An error occurred while adding the bed.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//get all wards thunk
export const getAllWards = createAsyncThunk(
  "ipd/getAllWards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await IpdApi.GetAllWards();
      return response.data.wards;
    } catch (error) {
      message.error("An error occurred while fetching wards.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//get beds by ward id thunk
export const getBedsByWardId = createAsyncThunk(
  "ipd/getBedsByWardId",
  async (wardId, { rejectWithValue }) => {
    try {
      const response = await IpdApi.GetBedByWardId(wardId);
      return response.data.beds;
    } catch (error) {
      message.error("An error occurred while fetching beds for the ward.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//get wards with beds thunk
export const getWardsWithBeds = createAsyncThunk(
  "ipd/getWardsWithBeds",
  async (_, { rejectWithValue }) => {
    try {
      const response = await IpdApi.GetWardsWithBeds();
      // console.log("Wards with Beds:", response.data); // Log the fetched data
      return response.data; // Assuming the API returns an array of wards with beds
      
    } catch (error) {
      message.error("An error occurred while fetching wards with beds.");
      return rejectWithValue(error.response?.data || error.message);
    }
  } 
);

// Edit Bed Status Thunk
export const editBedStatus = createAsyncThunk(
  "ipd/editBedStatus",
  async ({ bedId, data }, { rejectWithValue }) => {
    try {
      const response = await IpdApi.EditBedStatus(bedId, data); // pass data
      message.success(response.data.message || "Bed status updated successfully!");
      return response.data;
    } catch (error) {
      message.error("An error occurred while updating bed status.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Ipd thunk to post IPD
export const postIPD = createAsyncThunk(
  "ipd/postIPD",
  async (ipdData, { rejectWithValue }) => { 
    try {
      const response = await IpdApi.PostIPD(ipdData);
      message.success(response.data.message || "IPD admission added successfully!");
      return response.data;
    } catch (error) {
      message.error("An error occurred while adding IPD admission.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch all IPD admissions
export const fetchAllIPD = createAsyncThunk(
  "ipd/fetchAllIPD",
  async (_, { rejectWithValue }) => {
    try {
      const response = await IpdApi.GetAllIPD();
      return response.data;
    } catch (error) {   
      message.error("An error occurred while fetching IPD admissions.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch IPD by Doctor ID
export const fetchIpdByDoctorId = createAsyncThunk(
  "ipd/fetchIpdByDoctorId",
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await IpdApi.GetIpdbyDoctorId(doctorId);
      return response.data;
    } catch (error) {
      message.error("An error occurred while fetching IPD by doctor ID.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Transfer Doctor Thunk
export const transferDoctor = createAsyncThunk(
  "ipd/transferDoctor",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await IpdApi.TransferDoctor(id, data); // ✅ Pass both
      message.success(response.data.message || "Doctor transferred successfully!");
      return response.data;
    } catch (error) {
      message.error("An error occurred while transferring the doctor.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const IpdSlice = createSlice({
  name: "ipd",
  initialState: {
    wards: [],    // ✅ array for wards
    beds: [],     // ✅ array for beds
    ipdList: [],  // ✅ array for IPD admissions
    wardsBeds: [], // ✅ array for wards with beds
    loading: false,
    error: null,
  },
  reducers: {
    clearIpdDetails: (state) => {
      state.wards = [];
      state.beds = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // postWard handlers
      .addCase(postWard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postWard.fulfilled, (state, action) => {
        state.loading = false;
        state.wards.push(action.payload);
      })
      .addCase(postWard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add ward";
      })

      // postBed handlers
      .addCase(postBed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postBed.fulfilled, (state, action) => {
        state.loading = false;
        state.beds.push(action.payload);
      })
      .addCase(postBed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add bed";
      })

      // getAllWards handlers
      .addCase(getAllWards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllWards.fulfilled, (state, action) => {
        state.loading = false;
        state.wards = action.payload; // ✅ Update wards with fetched data
      })
      .addCase(getAllWards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch wards";
      })

      // getBedsByWardId handlers
      .addCase(getBedsByWardId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBedsByWardId.fulfilled, (state, action) => {
        state.loading = false;
        state.beds = action.payload; // ✅ Update beds with fetched data
      })
      .addCase(getBedsByWardId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch beds for the ward";
      })

      // getWardsWithBeds handlers
      .addCase(getWardsWithBeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWardsWithBeds.fulfilled, (state, action) => {
        state.loading = false;
        state.wardsBeds = action.payload; // ✅ Update wards with fetched data
      })
      .addCase(getWardsWithBeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch wards with beds";
      })

      // editBedStatus handlers
      .addCase(editBedStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editBedStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBed = action.payload;
        const index = state.beds.findIndex(bed => bed.id === updatedBed.id);
        if (index !== -1) {
          state.beds[index] = updatedBed; // Update the specific bed
        }
      })
      .addCase(editBedStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update bed status";
      } )

      // postIPD handlers
      .addCase(postIPD.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postIPD.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally, you can handle the response data here if needed
      })
      .addCase(postIPD.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add IPD admission";
      })

      // fetchAllIPD handlers
      .addCase(fetchAllIPD.pending, (state) => {
        state.loading = true;
        state.error = null;
      })  
      .addCase(fetchAllIPD.fulfilled, (state, action) => {
        state.loading = false;
        state.ipdList = action.payload; // Store the fetched IPD admissions
        state.error = null;
      })
      .addCase(fetchAllIPD.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch IPD admissions";
      })

      // fetchIpdByDoctorId handlers
      .addCase(fetchIpdByDoctorId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIpdByDoctorId.fulfilled, (state, action) =>
        {
          state.loading = false;
          state.ipdList = action.payload; // Store the fetched IPD admissions by doctor ID
          state.error = null;
        })
      .addCase(fetchIpdByDoctorId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch IPD by doctor ID";
      })

      // transferDoctor handlers
      .addCase(transferDoctor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(transferDoctor.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally, you can handle the response data here if needed
      })
      .addCase(transferDoctor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to transfer doctor";
      });
  },
});

export const { clearIpdDetails } = IpdSlice.actions;
export default IpdSlice.reducer;
