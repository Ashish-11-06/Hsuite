import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import BillingApi from "../API/BillingApi";
import { message } from "antd";

// Thunk to get bill by patient ID
export const fetchBillByPatientId = createAsyncThunk(
  "billing/fetchBillByPatientId",
  async (patientId, { rejectWithValue }) => {
    try {
      const response = await BillingApi.GetBillByPatientId(patientId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch billing data"
      );
    }
  }
);

// Thunk to get all bill particulars
export const getBillParticulars = createAsyncThunk(
  "billing/getBillParticulars",
  async (_, { rejectWithValue }) => {
    try {
      const response = await BillingApi.GetBillPerticulars();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch bill particulars"
      );
    }
  }
);

// Thunk to update payment for a specific bill
export const updatePayment = createAsyncThunk(
  "billing/updatePayment",
  async ({ bill_id, payment_mode, status }, { rejectWithValue }) => {
    try {
      const response = await BillingApi.UpdatePayment(bill_id, {
        payment_mode,
        status,
      });
      message.success(response.data.message || "updated successfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update payment"
      );
    }
  }
);

//thunk to delete perticular
export const DeletePerticular = createAsyncThunk(
  "billing/deletePerticular",
  async (perticular_id, { rejectWithValue }) => {
    try {
      const response = await BillingApi.DeletePerticulars(perticular_id);
      message.success(response.data.message || "deleted");
      return { perticular_id, ...response.data };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "failed to delete"
      );
    }
  }
);

const billingSlice = createSlice({
  name: "billing",
  initialState: {
    billData: [],
    billParticulars: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearBillData: (state) => {
      state.billData = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBillByPatientId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillByPatientId.fulfilled, (state, action) => {
        state.loading = false;
        state.billData = action.payload.data;
      })
      .addCase(fetchBillByPatientId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unknown error occurred";
      })

      // getBillParticulars
      .addCase(getBillParticulars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBillParticulars.fulfilled, (state, action) => {
        state.loading = false;
        state.billParticulars = action.payload.data || [];
        state.hospital = action.payload.hospital;
      })
      .addCase(getBillParticulars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching particulars";
      })

      // updatePayment
      .addCase(updatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Payment update failed";
      })

      // deleteBillPerticular
      .addCase(DeletePerticular.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(DeletePerticular.fulfilled, (state, action) => {
        state.loading = false;
        state.billParticulars = state.billParticulars.filter(
          (item) => item.id !== action.payload.perticular_id
        );
      })
      .addCase(DeletePerticular.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete bill particular";
      });

  },
});

export const { clearBillData } = billingSlice.actions;
export default billingSlice.reducer;