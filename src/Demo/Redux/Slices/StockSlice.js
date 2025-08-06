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
  async ({  patient_id }, { rejectWithValue }) => {
    try {
      const response = await StockApi.GetPharmacyBillByPatientId({ patient_id });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch bill");
    }
  }
);


const StockSlice = createSlice({
    name: "stock",
    initialState: {
    billData:[],
    pharmacyMedicines:[],
    stockMedicines:[],
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
        state.loading= false;
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
      });
  }
});

export default StockSlice.reducer;