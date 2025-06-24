import React from "react";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import OpdApi from "../API/OpdApi";
import { message } from "antd";

//----async thunk to post OPD data------
export const PostOPD = createAsyncThunk(
    "opd/postOpd",
    async (data, { rejectWithValue }) => {
        try {
            const response = await OpdApi.PostOPD(data);
            message.success("OPD record saved successfully!")
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
    async ({id, body}, { rejectWithValue }) => {
        try {
            const response = await OpdApi.UpdateStatus(id, body);
            message.success("OPD status updated successfully!");
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
            message.error("Failed to fetch OPD records for the doctor");
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
    },
    extraReducers: (builder) => {
        builder
            .addCase(PostOPD.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(PostOPD.fulfilled, (state, action) => {
                state.loading = false;
                state.opdData.push(action.payload);
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
            });

    }
});

export const { resetOpdState } = OpdSlice.actions;
export default OpdSlice.reducer;