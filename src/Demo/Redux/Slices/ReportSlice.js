import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ReportApi from "../API/ReportApi";
import { message } from "antd";

// Async Thunks
export const postLabReport = createAsyncThunk(
    "report/postLabReport",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await ReportApi.PostLabReport(payload);
            message.success(response.data.message || "added successfully");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getLabReportsByAssistant = createAsyncThunk(
    "report/getLabReportsByAssistant",
    async (labAssistant_id, { rejectWithValue }) => {
        try {
            const response = await ReportApi.GetLabReportByLabAssistantId(labAssistant_id);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteLabReport = createAsyncThunk(
    "report/deleteLabReport",
    async (reportId, { rejectWithValue }) => {
        try {
            const response = await ReportApi.DeleteLabReport(reportId);
            message.success(response.data.message || "deleted successfully");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Birth Report Thunks
export const postBirthReport = createAsyncThunk(
    "report/postBirthReport",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await ReportApi.PostBirthReport(payload);
            message.success(response.data.message || "Birth report added successfully");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getBirthReports = createAsyncThunk(
    "report/getBirthReports",
    async (_, { rejectWithValue }) => {
        try {
            const response = await ReportApi.GetBirthReport();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Death Report Thunks
export const postDeathReport = createAsyncThunk(
    "report/postDeathReport",
    async (payload, { rejectWithValue }) => {
        try {
            const response = await ReportApi.PostDeathReport(payload);
            message.success(response.data.message || "Death report added successfully");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getDeathReports = createAsyncThunk(
    "report/getDeathReports",
    async (_, { rejectWithValue }) => {
        try {
            const response = await ReportApi.GetDeathReport();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Initial State
const initialState = {
    loading: false,
    error: null,
};

// Slice
const reportSlice = createSlice({
    name: "report",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // POST
            .addCase(postLabReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postLabReport.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(postLabReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // GET
            .addCase(getLabReportsByAssistant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLabReportsByAssistant.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(getLabReportsByAssistant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // DELETE
            .addCase(deleteLabReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteLabReport.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(deleteLabReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // POST Birth Report
            .addCase(postBirthReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postBirthReport.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(postBirthReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // GET Birth Reports
            .addCase(getBirthReports.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getBirthReports.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(getBirthReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // POST Death Report
            .addCase(postDeathReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postDeathReport.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(postDeathReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // GET Death Reports
            .addCase(getDeathReports.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getDeathReports.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(getDeathReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export default reportSlice.reducer;
