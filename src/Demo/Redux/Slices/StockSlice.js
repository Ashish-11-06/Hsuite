import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import StockApi from "../API/StockApi";
import { message } from "antd";
import { act } from "react";

//post pharmacy medicine stock
export const postPharmacyMedicineStock = createAsyncThunk(
  "stock/postPharmacyMedicineStock",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await StockApi.PostPharmacyMedicineStock(payload);
      message.success(response.data.message || "Pharmacy medicine stock posted successfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to post pharmacy medicine stock"
      );
    }
  }
);

//get pharmacy medicine 
export const getPharmacyMedicine = createAsyncThunk(
  "stock/getPharmacyMedicine",
  async (_, { rejectWithValue }) => {
    try {
      const response = await StockApi.GetPharmacyMedicine();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to get Pharamacy Medicine"
      );
    }
  }
);

//get medicine stock
export const getMedicineStock = createAsyncThunk(
  "stcok/getMedicineStock",
  async (_, { rejectWithValue }) => {
    try {
      const response = await StockApi.GetMedicineStock();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to get Medicine stock"
      );
    }
  }
);

//get pharamacy bill yby patient id
export const fetchPharmacyBillByPatientId = createAsyncThunk(
  "pharmacyBill/fetchByPatientId",
  async ({ patient_id }, { rejectWithValue }) => {
    try {
      const response = await StockApi.GetPharmacyBillByPatientId({ patient_id });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch bill");
    }
  }
);

//post pharmacy out bill
export const postPharmacyOutBill = createAsyncThunk(
  "pharmacyBill/postPharmacyOutBill",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await StockApi.PostPharmacyOutBill(payload);
      message.success(response.data.message || "posted successfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to post"
      );
    }
  }
);

// PATCH: Update payment for pharmacy out bill
export const updatePaymentPharmacyOutBill = createAsyncThunk(
  "pharmacyBill/updatePaymentPharmacyOutBill",
  async ({ id, payment_status, payment_mode }, { rejectWithValue }) => {
    try {
      const response = await StockApi.UpdatePaymentPharmacyOutBill(id, {
        payment_status,
        payment_mode,
      });
      message.success(response.data.message || "Payment updated successfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update payment"
      );
    }
  }
);

// GET: All pharmacy out bills
export const getPharmacyOutBills = createAsyncThunk(
  "pharmacyBill/getPharmacyOutBills",
  async (_, { rejectWithValue }) => {
    try {
      const response = await StockApi.GetPharmacyOutBill();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch out bills"
      );
    }
  }
);

// GET: Prescription Invoices
export const getPrescriptionInvoices = createAsyncThunk(
  "stock/getPrescriptionInvoices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await StockApi.GetPrescriptionInvoice();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch prescription invoices"
      );
    }
  }
);

// GET: Pharmacy Out Invoices
export const getPharmacyOutInvoices = createAsyncThunk(
  "stock/getPharmacyOutInvoices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await StockApi.GetInvoiceOutPharmacyBill();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch pharmacy out invoices"
      );
    }
  }
);

const StockSlice = createSlice({
  name: "stock",
  initialState: {
    billData: [],
    pharmacyMedicines: [],
    stockMedicines: [],
    billDataByPatient: [],
    outBillList: [],
    prescriptionInvoices: [],
    outInvoices: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPharmacyMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPharmacyMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.pharmacyMedicines = action.payload.data;
      })
      .addCase(getPharmacyMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //get GetMedicineStock
      .addCase(getMedicineStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMedicineStock.fulfilled, (state, action) => {
        state.loading = false;
        state.stockMedicines = action.payload.medicine_stock;
      })
      .addCase(getMedicineStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // POST PHARMACY MEDICINE STOCK
      .addCase(postPharmacyMedicineStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postPharmacyMedicineStock.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(postPharmacyMedicineStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //post pharmacy out bill
      .addCase(postPharmacyOutBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postPharmacyOutBill.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(postPharmacyOutBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchPharmacyBillByPatientId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPharmacyBillByPatientId.fulfilled, (state, action) => {
        state.loading = false;
        state.billData = action.payload;
      })
      .addCase(fetchPharmacyBillByPatientId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET: Pharmacy Out Bills
      .addCase(getPharmacyOutBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPharmacyOutBills.fulfilled, (state, action) => {
        state.loading = false;
        state.billData = action.payload; // or action.payload.data if needed
      })
      .addCase(getPharmacyOutBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PATCH: Update payment
      .addCase(updatePaymentPharmacyOutBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePaymentPharmacyOutBill.fulfilled, (state) => {
        state.loading = false;
        // Optionally refetch or update local state if needed
      })
      .addCase(updatePaymentPharmacyOutBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Prescription Invoices
      .addCase(getPrescriptionInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPrescriptionInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.prescriptionInvoices = action.payload?.data || [];
      })
      .addCase(getPrescriptionInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Pharmacy Out Invoices
      .addCase(getPharmacyOutInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPharmacyOutInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.outInvoices = action.payload?.data || [];
      })
      .addCase(getPharmacyOutInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default StockSlice.reducer;