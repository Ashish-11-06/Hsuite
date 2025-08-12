import React, { act } from "react";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import OpdApi from "../API/OpdApi";
import { message } from "antd";

//----async thunk to post OPD data------
export const PostOPD = createAsyncThunk(
    "opd/postOpd",
    async (data, { rejectWithValue }) => {
        try {
            const response = await OpdApi.PostOPD(data);
            message.success(response.data.message || "OPD record saved successfully!")
            return response.data;
        } catch (error) {
            message.error("Failed to save OPD record");
            return rejectWithValue(error.response.data);
        }
    }
);

//----async thunk to get all OPD records------
export const GetAllOPD = createAsyncThunk(
    "opd/getAllOpd",
    async (_, { rejectWithValue }) => {
        try {
            const response = await OpdApi.GetAllOPD();
            return response.data;
        } catch (error) {
            message.error("Failed to fetch OPD records");
            return rejectWithValue(error.response.data);
        }
    }
);

//----async thunk to update OPD status------
export const UpdateOPDStatus = createAsyncThunk(
    "opd/updateOpdStatus",
    async ({ id, body }, { rejectWithValue }) => {
        try {
            const response = await OpdApi.UpdateStatus(id, body);
            message.success(response.data.message || "OPD status updated successfully!");
            return response.data;
        } catch (error) {
            message.error("Failed to update OPD status");
            return rejectWithValue(error.response.data);
        }
    }
);

//----async thunk to get OPD records by doctor ID------
export const GetOpdByDoctorId = createAsyncThunk(
    "opd/getOpdByDoctorId",
    async (doctorId, { rejectWithValue }) => {
        try {
            const response = await OpdApi.GetOpdByDoctorId(doctorId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const PostPrescription = createAsyncThunk(
    "opd/postprescription",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await OpdApi.PostPrescription(payload);
            message.success(response.data.message || "posted successfully");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

//----async thunk to get medicine names------
export const GetMedicinesNames = createAsyncThunk(
    "opd/getMedicinesNames",
    async (_, { rejectWithValue }) => {
        try {
            const response = await OpdApi.GetMedicinesNames();
            return response.data.medicine_names;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

//---async thunk to get prescription by patient id----
export const FetchPrescriptionByPatientId = createAsyncThunk(
    "opd/getPrescriptionByPatientId",
    async (patient_id, { rejectWithValue }) => {
        try {
            const response = await OpdApi.GetPrescriptionByPatientId(patient_id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

//---async thunk to post new bill perticular---
export const PostPerticulars = createAsyncThunk(
    "opd/postBillPerticulars",
    async (data, { rejectWithValue }) => {
        try {
            const response = await OpdApi.PostBillPreticulars(data);
            message.success(response.data.message || "posted successfully");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

//----async thunk to post bill ---
export const PostBill = createAsyncThunk(
    "opd/postBill",
    async (data, { rejectWithValue }) => {
        try {
            const response = await OpdApi.PostBill(data);
            message.success(response.data.message || "posted successfully");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

//async thunk of all past opd
export const GetPastOPD = createAsyncThunk(
    "opd/getPastOpd",
    async (doctorId, { rejectWithValue }) => {
        try {
            const response = await OpdApi.GetPastOPD(doctorId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const GetAllPastOPD = createAsyncThunk(
    "opd/getAllPastOpd",
    async (_, { rejectWithValue }) => {
        try {
            const response = await OpdApi.GetAllPastOPD();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

//----slice------
const OpdSlice = createSlice({
    name: "opd",
    initialState: {
        opdData: [],
        opdByDoctor: [],
        medicineNames: [],
        prescriptions: [],
        pastopd: [],
        medicineNamesFetched: false,
        opdStatus: null,
        loading: false,
        error: null,
    },
    reducers: {
        resetOpdState: (state) => {
            state.opdData = [];
            state.loading = false;
            state.error = null;
        },
        resetPrescriptions: (state) => {
            state.prescriptions = [];
            state.hospital = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(PostOPD.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(PostOPD.fulfilled, (state, action) => {
                state.loading = false;
                if (Array.isArray(state.opdData?.data)) {
                    state.opdData.data.push(action.payload);
                } else {
                    state.opdData = { data: [action.payload] };
                }
            })

            .addCase(PostOPD.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get all OPD records
            .addCase(GetAllOPD.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetAllOPD.fulfilled, (state, action) => {
                state.loading = false;
                state.opdData = action.payload;
            })
            .addCase(GetAllOPD.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update OPD status
            .addCase(UpdateOPDStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(UpdateOPDStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updatedOpd = state.opdData.map((opd) =>
                    opd.id === action.payload.id ? action.payload : opd
                );
                state.opdData = updatedOpd;
            })
            .addCase(UpdateOPDStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get OPD records by doctor ID
            .addCase(GetOpdByDoctorId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetOpdByDoctorId.fulfilled, (state, action) => {
                state.loading = false;
                state.opdByDoctor = action.payload;
            })
            .addCase(GetOpdByDoctorId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Post Prescription
            .addCase(PostPrescription.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(PostPrescription.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(PostPrescription.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get medicine names
            .addCase(GetMedicinesNames.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetMedicinesNames.fulfilled, (state, action) => {
                // state.loading = false;
                state.medicineNames = action.payload;
                state.medicineNamesFetched = true;
            })
            .addCase(GetMedicinesNames.rejected, (state, action) => {
                // state.loading = false;
                // state.error = action.payload;
                state.medicineNamesFetched = false;
            })

            //get prescription by patient id
            .addCase(FetchPrescriptionByPatientId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(FetchPrescriptionByPatientId.fulfilled, (state, action) => {
                state.loading = false;
                state.prescriptions = action.payload.data;
                state.hospital = action.payload.hospital;
            })
            .addCase(FetchPrescriptionByPatientId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Post Perticulars
            .addCase(PostPerticulars.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(PostPerticulars.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(PostPerticulars.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //post bill
            .addCase(PostBill.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(PostBill.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(PostBill.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            //get past opd
            .addCase(GetPastOPD.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetPastOPD.fulfilled, (state, action) => {
                state.loading = false;
                state.pastopd = action.payload;
            })
            .addCase(GetPastOPD.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(GetAllPastOPD.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(GetAllPastOPD.fulfilled, (state, action) => {
                state.loading = false;
                state.pastopd = action.payload;
            })
            .addCase(GetAllPastOPD.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { resetOpdState, resetPrescriptions } = OpdSlice.actions;
export default OpdSlice.reducer;