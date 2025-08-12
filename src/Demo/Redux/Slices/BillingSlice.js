import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import BillingApi from "../API/BillingApi";
import { message } from "antd";
import { act } from "react";

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
  async ({ bill_id, payment_mode, status, patient_id }, { rejectWithValue }) => {
    try {
      const response = await BillingApi.UpdatePayment(bill_id, {
        payment_mode,
        status,
        patient_id,
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

export const updatePerticular = createAsyncThunk(
  "billing/updatePerticular",
  async ({ id, name, amount, description }, { rejectWithValue }) => {
    try {
      const response = await BillingApi.UpdatePerticulars(id, {
        name,
        amount,
        description,
      });
      message.success(response.data.message || "Updated successfully");
      return { updatedPerticular: response.data.data };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update particular"
      );
    }
  }
);

// Thunk to get invoice
export const getInvoice = createAsyncThunk(
  "billing/getInvoice",
  async (_, { rejectWithValue }) => {
    try {
      const response = await BillingApi.GetInvoice();
      return response.data;
    } catch (error) { 
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch invoice"
      );
    }
  }
);

// thunk to post suppliers
export const postSuppliers = createAsyncThunk(
  "billing/postSuppliers",
  async (data, { rejectWithValue }) => {
    try {
      const response = await BillingApi.PostSuppliers(data);  
      message.success(response.data.message || "Supplier added successfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to add supplier"
      );
    } 
  }
);

// Thunk to get suppliers
export const getSuppliers = createAsyncThunk(
  "billing/getSuppliers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await BillingApi.getSuppliers();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to fetch suppliers"
      );
    }
  }
);

// Thunk to update prescriptions
export const updatePrescriptions = createAsyncThunk(
  "billing/updatePrescriptions",
  async (prescription_id, { rejectWithValue }) => {
    try {
      const response = await BillingApi.UpdatePrescriptions(prescription_id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update prescriptions"
      );
    }
  }
);

// Thunk to post pharmacy bill
export const postPharmacyBill = createAsyncThunk(
  "billing/postPharmacyBill",
  async (data, { rejectWithValue }) => {
    try {
      const response = await BillingApi.PostPharmacyBill(data);
      message.success(response.data.message || "Pharmacy bill posted successfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to post pharmacy bill"
      );
    }
  }
);

// Thunk to update pharmacy bill
export const updatePharmacyBill = createAsyncThunk(
  "billing/updatePharmacyBill",
  async ({ bill_id, data }, { rejectWithValue }) => {
    try {
      const response = await BillingApi.UpdatePharmacyBill(bill_id, data);
      message.success(response.data.message || "Pharmacy bill updated successfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to update pharmacy bill"
      );
    }
  }
);

//Post stock medicine
export const postStockMedicine = createAsyncThunk(
  "billing/postStockMedicine",  
  async (data, { rejectWithValue }) => {
    try {
      const response = await BillingApi.PostStockMedicine(data);
      message.success(response.data.message || "Stock medicine posted successfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || "Failed to post stock medicine"
      );
    }
  }
);


const billingSlice = createSlice({
  name: "billing",
  initialState: {
    billData: [],
    billParticulars: [],
    invoice: [],
    suppliers: [],
    hospital: {},
    pharmacyMedicines:[],
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
        state.hospital = action.payload.hospital;
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
      })

      // updatePerticular
      .addCase(updatePerticular.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePerticular.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.updatedPerticular;
        state.billParticulars = state.billParticulars.map((item) =>
          item.id === updated.id ? updated : item
        );
      })
      .addCase(updatePerticular.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update bill particular";
      })

      // getInvoice
      .addCase(getInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoice = action.payload.data || [];
        state.hospital = action.payload.hospital || {};
      })
      .addCase(getInvoice.rejected, (state, action) => {    
        state.loading = false;
        state.error = action.payload || "Failed to fetch invoice";
      })

      // postSuppliers
      .addCase(postSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        // Assuming suppliers are part of the hospital data
        state.hospital.suppliers = [
          ...(state.hospital.suppliers || []),
          action.payload.data,
        ];
      })
      .addCase(postSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add supplier";
      })

      // getSuppliers
      .addCase(getSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = action.payload || [];
      })
      .addCase(getSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch suppliers";
      })

      // updatePrescriptions
      .addCase(updatePrescriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        // Assuming the response contains updated prescription data
        const updatedPrescription = action.payload;
        state.billData = state.billData.map((bill) =>
          bill.prescriptions.map((prescription) =>
            prescription.id === updatedPrescription.id
              ? updatedPrescription
              : prescription
          )
        );
      })
      .addCase(updatePrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update prescriptions";
      })

      // postPharmacyBill
      .addCase(postPharmacyBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postPharmacyBill.fulfilled, (state, action) => {
        state.loading = false;
        // Assuming the response contains the new pharmacy bill data
        state.billData.push(action.payload.data);
      })
      .addCase(postPharmacyBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to post pharmacy bill";
      })

      // updatePharmacyBill
      .addCase(updatePharmacyBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePharmacyBill.fulfilled, (state, action) => {
        state.loading = false;
        // Assuming the response contains the updated pharmacy bill data
        const updatedBill = action.payload.data;
        state.billData = state.billData.map((bill) =>
          bill.id === updatedBill.id ? updatedBill : bill
        );
      })
      .addCase(updatePharmacyBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update pharmacy bill";
      })

      // POST STOCK MEDICINE
      .addCase(postStockMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postStockMedicine.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(postStockMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBillData } = billingSlice.actions;
export default billingSlice.reducer;