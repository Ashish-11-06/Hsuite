// patientSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import PatientApi from "../API/PatientApi";

// Async thunk accepting patient data
export const postPatientDetails = createAsyncThunk(
  "patient/postPatientDetails",
  async (patientData, { rejectWithValue }) => {
    try {
      const response = await PatientApi.PostPatientDetails(patientData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error submitting patient data");
    }
  }
);

export const fetchAllPatients = createAsyncThunk(
  "patient/fetchAllPatients",
  async (_, { rejectWithValue }) => {
    try {
      const res = await PatientApi.GetAllPatients();
      return {
        hospital: res.data.hospital,
        patients: res.data.patients
      };// Ensure we return an empty array if no data is found
    } catch (err) {
      return rejectWithValue(err.res?.data.message || "error fetching all the patients");
    }
  }
);

export const UpdatePatientDetails = createAsyncThunk(
  "patient/updatePatientDetails",
  async ({ patient_id, ...updateData }, { rejectWithValue }) => {
    try {
      const res = await PatientApi.UpdatePatient(patient_id, updateData);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error updating patient");
    }
  }
);

//delete patient details
export const DeletePatient = createAsyncThunk(
  "patient/deletePatient",
  async (patient_id, { rejectWithValue }) => {
    try {
      const res = await PatientApi.DeletePatient(patient_id);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error deleting patient");
    }
  }
);

export const GetAllDetailHistoryyy = createAsyncThunk(
  "patienthistory/getAllDetailHistory",
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await PatientApi.GetAllDetailHistory(patient_id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

export const getCount = createAsyncThunk(
  "patient/getCount",
  async (_, { rejectWithValue }) => {
    try {
      const res = await PatientApi.GetCount();
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching dashboard stats");
    }
  }
);

const patientSlice = createSlice({
  name: "patient",
  initialState: {
    loading: false,
    data: null,
    historyData: [],
    allPatients: [],
    countData: null,
    hospital: {},
    error: null,
  },
  reducers: {
    clearPatientData: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postPatientDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postPatientDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(postPatientDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //get all patients 
      .addCase(fetchAllPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.allPatients = action.payload.patients;
        state.hospital = action.payload.hospital;
      })
      .addCase(fetchAllPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //update patients details
      .addCase(UpdatePatientDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(UpdatePatientDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(UpdatePatientDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //delete patients details
      .addCase(DeletePatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(DeletePatient.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally remove the deleted patient from allPatients
        state.allPatients = state.allPatients.filter(
          (patient) => patient.id !== action.meta.arg
        );
      })
      .addCase(DeletePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //get all details by id 
      .addCase(GetAllDetailHistoryyy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(GetAllDetailHistoryyy.fulfilled, (state, action) => {
        state.loading = false;
        state.historyData = action.payload;
      })
      .addCase(GetAllDetailHistoryyy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCount.fulfilled, (state, action) => {
        state.loading = false;
        state.countData = action.payload;
      })
      .addCase(getCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

export const { clearPatientData } = patientSlice.actions;
export default patientSlice.reducer;
