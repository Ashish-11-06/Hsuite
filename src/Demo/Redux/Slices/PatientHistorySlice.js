import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import PatientHistoryApi from "../API/PatientHistoryApi";
import { message } from "antd";

// ---------- FINDING ----------
export const PostFinding = createAsyncThunk(
  "patienthistory/postFinding",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await PatientHistoryApi.PostFinding(payload);
      message.success("Finding added successfully");
      return response.data;
    } catch (error) {
      message.error("Error adding finding");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const GetFinding = createAsyncThunk(
  "patienthistory/getFinding",
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await PatientHistoryApi.GetFinding(patient_id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const UpdateFinding = createAsyncThunk(
  "patienthistory/updateFinding",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await PatientHistoryApi.UpdateFinding(id, payload);
      message.success("Finding updated successfully");
      return response.data;
    } catch (error) {
      message.error("Error updating finding");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

// ---------- ALLERGIES ----------
export const PostAllergies = createAsyncThunk(
  "patienthistory/postAllergies",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await PatientHistoryApi.PostAllergies(payload);
      message.success("Allergies submitted successfully");
      return response.data;
    } catch (error) {
      message.error("Error submitting allergies");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const GetAllergiesByPatientId = createAsyncThunk(
  "patienthistory/getAllergiesByPatientId",
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await PatientHistoryApi.GetAllergiesByPatientId(patient_id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching allergies");
    }
  }
);

// ---------- FAMILY HISTORY ----------
export const PostFamilyHistory = createAsyncThunk(
  "patienthistory/postFamilyHistory",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await PatientHistoryApi.PostFamilyHistory(payload);
      message.success("Family history submitted successfully");
      return response.data;
    } catch (error) {
      message.error("Error submitting family history");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const GetFamilyHistoryByPatientId = createAsyncThunk(
  "patienthistory/getFamilyHistoryByPatientId",
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await PatientHistoryApi.GetFamilyHistoryByPatientId(patient_id);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

// ---------- PAST HOSPITAL HISTORY ----------
export const PostPatientPastHospitalHistory = createAsyncThunk(
  "patienthistory/postPastHospitalHistory",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await PatientHistoryApi.PostPatientPastHospitalHistory(payload);
      message.success(response.data.message || "Past hospital history submitted successfully");
      return response.data;  // Keep full response (message + data)
    } catch (error) {
      message.error(error.response?.data?.message || "Error submitting past hospital history");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const GetPatientPastHospitalHistoryByPatientId = createAsyncThunk(
  "patienthistory/getPastHospitalHistoryByPatientId",
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await PatientHistoryApi.GetPatientPastHospitalHistoryByPatientId(patient_id);
      return response.data;
    } catch (error) {
      // message.error(error.response?.data?.message || "Error fetching past hospital history");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

// ---------- PAST CURRENT HOSPITAL HISTORY ----------
export const PostPastCurrentHospitalHistory = createAsyncThunk(
  "patienthistory/postPastCurrentHospitalHistory",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await PatientHistoryApi.PostPastCurrentHospitalHistory(payload);
      message.success(response.data.message || "Current hospital history submitted successfully");
      return response.data;
    } catch (error) {
      message.error(error.response?.data?.message || "Error submitting current hospital history");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const GetPastCurrentHospitalHistory = createAsyncThunk(
  "patienthistory/getPastCurrentHospitalHistory",
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await PatientHistoryApi.GetPastCurrentHospitalHistory(patient_id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching current hospital history");
    }
  }
);

// ---------- DISEASES ----------
export const PostDiseases = createAsyncThunk(
  "patienthistory/postDiseases",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await PatientHistoryApi.PostDiseases(payload);
      message.success(response.data.message || "Disease added successfully");
      return response.data;
    } catch (error) {
      message.error(error.response?.data?.message || "Error adding disease");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const GetDiseasesByPatientId = createAsyncThunk(
  "patienthistory/getDiseasesByPatientId",
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await PatientHistoryApi.GetDiseasesByPatientId(patient_id);
      return response.data.data;
    } catch (error) {
      // message.error(error.response?.data?.message || "Error fetching diseases");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const UpdateDiseasesStatus = createAsyncThunk(
  "patienthistory/updateDiseasesStatus",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const response = await PatientHistoryApi.UpdateDiseasesStatus(id, payload);
      message.success(response.data.message || "Disease status updated");
      return response.data;
    } catch (error) {
      message.error(error.response?.data?.message || "Error updating status");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

// ---------- ONGOING MEDICATION ----------
export const PostOngoingMedication = createAsyncThunk(
  "patienthistory/postOngoingMedication",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await PatientHistoryApi.PostOngoingMedication(payload);
      message.success(response.data.message || "Ongoing medication submitted successfully");
      return response.data;
    } catch (error) {
      message.error(error.response?.data?.message || "Error submitting ongoing medication");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const GetOngoingMedication = createAsyncThunk(
  "patienthistory/getOngoingMedication",
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await PatientHistoryApi.GetOngoingMedication(patient_id);
      return response.data;
    } catch (error) {
      message.error(error.response?.data?.message || "Error fetching ongoing medication");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

//clinical notes
export const PostClinicalNotes = createAsyncThunk(
  "patienthistory/postClinicalNotes",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await PatientHistoryApi.PostClinicalNotes(payload);
      message.success(response.data.message || "Clinical notes added successfully");
      return response.data;
    } catch (error) {
      message.error(error.response?.data?.message || "Error adding clinical notes");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const GetClinicalNotes = createAsyncThunk(
  "patienthistory/getClinicalNotes",
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await PatientHistoryApi.GetClinicalNotes(patient_id);
      return response.data;
    } catch (error) {
      // message.error(error.response?.data?.message || "Error fetching clinical notes");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

// ---------- MEDICINE ----------
export const PostMedicine = createAsyncThunk(
  "patienthistory/postMedicine",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await PatientHistoryApi.PostMedicine(payload);
      message.success(response.data.message || "Medicine added successfully");
      return response.data;
    } catch (error) {
      message.error(error.response?.data?.message || "Error adding medicine");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const GetMedicineByPatientId = createAsyncThunk(
  "patienthistory/getMedicineByPatientId",
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await PatientHistoryApi.GetMedicineByPatientId(patient_id);
      return response.data;
    } catch (error) {
      message.error(error.response?.data?.message || "Error fetching medicine");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

// ---------- CERTIFICATES ----------
export const PostCertificate = createAsyncThunk(
  "patienthistory/postCertificate",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await PatientHistoryApi.PostCertificate(payload);
      message.success(response.data.message || "Certificate added successfully");
      return response.data;
    } catch (error) {
      message.error(error.response?.data?.message || "Error adding certificate");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const GetCertificates = createAsyncThunk(
  "patienthistory/getCertificates",
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await PatientHistoryApi.GetCertificates(patient_id);
      return response.data;
    } catch (error) {
      message.error(error.response?.data?.message || "Error fetching certificates");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

// ---------- ATTACHMENTS ----------
export const PostAttachment = createAsyncThunk(
  "patienthistory/postAttachment",
  async (formData, { rejectWithValue }) => { 
    try {
      const response = await PatientHistoryApi.PostAttachment(formData);
      message.success(response.data.message || "Attachment added successfully");
      return response.data;
    } catch (error) {
      message.error(error.response?.data?.message || "Error adding attachment");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const GetAttachmentsByPatientId = createAsyncThunk(
  "patienthistory/getAttachmentsByPatientId",
  async (patient_id, { rejectWithValue }) => {
    try {
      const response = await PatientHistoryApi.GetAttachmentsByPatientId(patient_id);
      return response.data;
    } catch (error) {
      message.error(error.response?.data?.message || "Error fetching attachments");
      return rejectWithValue(error.response?.data || "Error");
    }
  }
);

// ---------- SLICE ----------
const patientHistorySlice = createSlice({
  name: "patienthistory",
  initialState: {
    loading: false,
    data: null,
    familyHistory: [],
    findings: [],
    allergies: [],
    pastHospitalHistory: [],
    pastCurrentHospitalHistory: [],
    diseases: [],
    ongoingMedication: [],
    clinicalNotes: [],
    medicine: [],
    certificates: [],
    attachments: [],
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Post Finding
      .addCase(PostFinding.pending, (state) => {
        state.loading = true;
      })
      .addCase(PostFinding.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(PostFinding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Finding
      .addCase(GetFinding.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetFinding.fulfilled, (state, action) => {
        state.loading = false;
        state.findings = action.payload;
      })
      .addCase(GetFinding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Finding
      .addCase(UpdateFinding.pending, (state) => {
        state.loading = true;
      })
      .addCase(UpdateFinding.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(UpdateFinding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Post Allergies
      .addCase(PostAllergies.pending, (state) => {
        state.loading = true;
      })
      .addCase(PostAllergies.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(PostAllergies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Allergies by Patient ID
      .addCase(GetAllergiesByPatientId.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetAllergiesByPatientId.fulfilled, (state, action) => {
        state.loading = false;
        state.allergies = action.payload;
      })
      .addCase(GetAllergiesByPatientId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Post Family History
      .addCase(PostFamilyHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(PostFamilyHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(PostFamilyHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Family History by Patient ID
      .addCase(GetFamilyHistoryByPatientId.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetFamilyHistoryByPatientId.fulfilled, (state, action) => {
        // console.log("Family History Payload:", action.payload);
        state.loading = false;
        state.familyHistory = action.payload;
      })
      .addCase(GetFamilyHistoryByPatientId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Post Past Hospital History
      .addCase(PostPatientPastHospitalHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(PostPatientPastHospitalHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;  // store backend message
        state.data = action.payload.data || action.payload;
      })
      .addCase(PostPatientPastHospitalHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Past Hospital History by Patient ID
      .addCase(GetPatientPastHospitalHistoryByPatientId.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetPatientPastHospitalHistoryByPatientId.fulfilled, (state, action) => {
        state.loading = false;
        state.pastHospitalHistory = action.payload.data || [];
      })
      .addCase(GetPatientPastHospitalHistoryByPatientId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Post Past Current Hospital History
      .addCase(PostPastCurrentHospitalHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(PostPastCurrentHospitalHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.data = action.payload.data || action.payload;
      })
      .addCase(PostPastCurrentHospitalHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Past Current Hospital History
      .addCase(GetPastCurrentHospitalHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetPastCurrentHospitalHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.pastCurrentHospitalHistory = action.payload.data || [];
      })
      .addCase(GetPastCurrentHospitalHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Post Diseases
      .addCase(PostDiseases.pending, (state) => {
        state.loading = true;
      })
      .addCase(PostDiseases.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(PostDiseases.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Diseases by Patient ID
      .addCase(GetDiseasesByPatientId.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetDiseasesByPatientId.fulfilled, (state, action) => {
        state.loading = false;
        state.diseases = action.payload;
      })
      .addCase(GetDiseasesByPatientId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Disease Status
      .addCase(UpdateDiseasesStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(UpdateDiseasesStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update disease status in the state
        const updatedId = action.meta.arg;
        const index = state.diseases.findIndex((d) => d.id === updatedId);
        if (index !== -1) {
          state.diseases[index].status = action.payload.status;
        }
      })
      .addCase(UpdateDiseasesStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Post Ongoing Medication
      .addCase(PostOngoingMedication.pending, (state) => {
        state.loading = true;
      })
      .addCase(PostOngoingMedication.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.data = action.payload.data || action.payload;
      })
      .addCase(PostOngoingMedication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Ongoing Medication
      .addCase(GetOngoingMedication.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetOngoingMedication.fulfilled, (state, action) => {
        state.loading = false;
        state.ongoingMedication = action.payload.data || [];
      })
      .addCase(GetOngoingMedication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //post clinical notes
      .addCase(PostClinicalNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(PostClinicalNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.data = action.payload.data || action.payload;
      })
      .addCase(PostClinicalNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Clinical Notes
      .addCase(GetClinicalNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetClinicalNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.clinicalNotes = action.payload.data || [];
      })
      .addCase(GetClinicalNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Post Medicine
      .addCase(PostMedicine.pending, (state) => {
        state.loading = true;
      })
      .addCase(PostMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.data = action.payload.data || action.payload;
      })
      .addCase(PostMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Medicine by Patient ID
      .addCase(GetMedicineByPatientId.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetMedicineByPatientId.fulfilled, (state, action) => {
        state.loading = false;
        state.medicine = action.payload.data || [];
      })
      .addCase(GetMedicineByPatientId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Post Certificate
      .addCase(PostCertificate.pending, (state) => {
        state.loading = true;
      })
      .addCase(PostCertificate.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.data = action.payload.data || action.payload;
      })
      .addCase(PostCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Certificates
      .addCase(GetCertificates.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetCertificates.fulfilled, (state, action) => {
        state.loading = false;
        state.certificates = action.payload.data || [];
      })
      .addCase(GetCertificates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Post Attachment
      .addCase(PostAttachment.pending, (state) => {
        state.loading = true;
      })    
      .addCase(PostAttachment.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.data = action.payload.data || action.payload;
      })
      .addCase(PostAttachment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Attachments by Patient ID
      .addCase(GetAttachmentsByPatientId.pending, (state) => {
        state.loading = true;
      })
      .addCase(GetAttachmentsByPatientId.fulfilled, (state, action) => {
        state.loading = false;
        state.attachments = action.payload.data || [];
      })
      .addCase(GetAttachmentsByPatientId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export default patientHistorySlice.reducer;
