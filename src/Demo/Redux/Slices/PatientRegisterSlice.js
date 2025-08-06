import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import PatientRegister from "../API/PatientRegister";
import { message } from "antd";

// 1. Hospital fetch by ID
export const fetchHospitalById = createAsyncThunk(
  "patientRegister/fetchHospitalById",
  async (hospitalId, { rejectWithValue }) => {
    try {
      const response = await PatientRegister.GetHospitalById(hospitalId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch hospital");
    }
  }
);

// 2. Patient registration
export const patientRegistration = createAsyncThunk(
  "patientRegister/patientRegistration",
  async (data, { rejectWithValue }) => {
    try {
      const response = await PatientRegister.PatientRegistration(data);
      message.success(response.data.message || "added sucessfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

// 3. OTP verification
export const patientVerifyOtp = createAsyncThunk(
  "patientRegister/patientVerifyOtp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await PatientRegister.PatientVerifyOTP(data);
      message.success(response.data.message || "added sucessfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "OTP verification failed");
    }
  }
);

// 4. Patient login
export const patientLogin = createAsyncThunk(
  "patientRegister/patientLogin",
  async ({ body, hospitalId }, { rejectWithValue }) => {
    try {
      const response = await PatientRegister.PatientLogin(body, hospitalId);
      message.success(response.data.message || "added sucessfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);


// 5. Forgot password
export const patientForgotPassword = createAsyncThunk(
  "patientRegister/patientForgotPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await PatientRegister.PatientForgetPassword(data);
      message.success(response.data.message || "added sucessfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Forgot password failed");
    }
  }
);

// 6. Password OTP verify
export const patientPasswordVerifyOtp = createAsyncThunk(
  "patientRegister/patientPasswordVerifyOtp",
  async (data, { rejectWithValue }) => {
    try {
      const response = await PatientRegister.patientPasswordVerifyOTP(data);
      message.success(response.data.message || "added sucessfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "OTP verification failed");
    }
  }
);

// 7. Password reset
export const patientResetPassword = createAsyncThunk(
  "patientRegister/patientResetPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await PatientRegister.patientResentPassword(data);
      message.success(response.data.message || "added sucessfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Reset password failed");
    }
  }
);

//post doctor time table
export const addDoctorTimeTable = createAsyncThunk(
  "patientRegister/postDoctorTimeTable",
  async (data, { rejectWithValue }) => {
    try {
      const response = await PatientRegister.postDoctorTimeTable(data);
      message.success(response.data.message || "added sucessfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// get doctor timetable by doctor ID
export const getDoctorTimeTable = createAsyncThunk(
  "patientRegister/getDoctorTimeTable",
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await PatientRegister.getDoctorTimetable(doctorId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch doctor timetable");
    }
  }
);

//update doctor timetable
export const updateDoctorTimeTable = createAsyncThunk(
  "patientRegister/updateDoctorTimeTable",
  async ({ timetableId, data }, { rejectWithValue }) => {
    try {
      const response = await PatientRegister.UpdateDoctorTimeTable(timetableId, data);
      message.success(response.data.message || "updated sucessfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);

// Get Appointments by Doctor ID
export const fetchAppointmentsByDoctorId = createAsyncThunk(
  "patientRegister/fetchAppointmentsByDoctorId",
  async (doctorId, { rejectWithValue }) => {
    try {
      const response = await PatientRegister.GetAppointmentByDoctorId(doctorId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch appointments");
    }
  }
);

// Update Appointment Doctor Status
export const updateAppointmentDoctorStatus = createAsyncThunk(
  "patientRegister/updateAppointmentDoctorStatus",
  async ({ appointmentId, data }, { rejectWithValue }) => {
    try {
      const response = await PatientRegister.UpdateAppointmentDoctor(appointmentId, data);
      message.success(response.data.message || "updated sucessfully");
      return response.data;
    } catch (error) {
      const errorMessage =
        error?.response?.data?.non_field_errors?.[0] ||
        error?.response?.data?.message ||
        "Failed to update appointment status";
      message.error(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Post a new appointment
export const postPatientAppointment = createAsyncThunk(
  "patientRegister/postPatientAppointment",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await PatientRegister.PostPatientAppointment(payload);
      message.success(response.message || "Appointment created successfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create appointment");
    }
  }
);

// Update patient appointment (patient response)
export const updatePatientAppointment = createAsyncThunk(
  "patientRegister/updatePatientAppointment",
  async ({appointmentId, patient_status}, { rejectWithValue }) => {
    try {
      const response = await PatientRegister.UpdatePatientAppointment(appointmentId, {patient_status});
      message.success(response.data.message || "Appointment updated successfully");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update appointment");
    }
  }
);

// Get appointments by patient ID
export const fetchAppointmentsByPatientId = createAsyncThunk(
  "patientRegister/fetchAppointmentsByPatientId",
  async (patientId, { rejectWithValue }) => {
    try {
      const response = await PatientRegister.GetAppointmentsByPatientId(patientId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch patient appointments");
    }
  }
);

//get patinet id
export const fetchPatientById = createAsyncThunk(
  "patientRegister/fetchPatientById",
  async (patient_id, {rejectWithValue}) => {
    try {
      const response = await PatientRegister.GetByPatientId(patient_id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "failed to fetch");
    }
  }
);


// 🔽 Slice
const patientRegisterSlice = createSlice({
  name: "patientRegister",
  initialState: {
    hospital: null,
    loading: false,
    error: null,
    patientData: null,
    otpVerified: false,
    loginSuccess: false,
    passwordResetSuccess: false,
    responseData: null,
    doctorTimetable: [],
    updateDoctorTimeTableResponse: null,
    appointments: [],
    updateAppointmentDoctorResponse: null,
    updateAppointment: null,
    appointmentsByDoctor: [],
    patient: [],
  },
  reducers: {
    resetDoctorTimeTableState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.responseData = null;
    },
    logoutPatient: (state) => {
      state.patientData = null;
      localStorage.removeItem("patient-user"); // clear saved login
    }
  },
  extraReducers: (builder) => {
    builder

      // Hospital
      .addCase(fetchHospitalById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHospitalById.fulfilled, (state, action) => {
        state.loading = false;
        state.hospital = action.payload.hospital;
      })
      .addCase(fetchHospitalById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Registration
      .addCase(patientRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patientRegistration.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(patientRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify OTP
      .addCase(patientVerifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patientVerifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.otpVerified = true;
        state.otpData = action.payload;
      })
      .addCase(patientVerifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(patientLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patientLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.patientData = action.payload;
        localStorage.setItem("patient-user", JSON.stringify(action.payload));
      })
      .addCase(patientLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Forgot Password
      .addCase(patientForgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patientForgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(patientForgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify Password OTP
      .addCase(patientPasswordVerifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patientPasswordVerifyOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(patientPasswordVerifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(patientResetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patientResetPassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordResetSuccess = true;
      })
      .addCase(patientResetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // post doctor time table
      .addCase(addDoctorTimeTable.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(addDoctorTimeTable.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.responseData = action.payload;
      })
      .addCase(addDoctorTimeTable.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      })

      // get doctor time table
      .addCase(getDoctorTimeTable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDoctorTimeTable.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorTimetable = action.payload;
      })
      .addCase(getDoctorTimeTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //update doctor time table
      .addCase(updateDoctorTimeTable.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDoctorTimeTable.fulfilled, (state, action) => {
        state.loading = false;
        state.updateDoctorTimeTableResponse = action.payload;
      })
      .addCase(updateDoctorTimeTable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Appointments by Doctor ID
      // .addCase(fetchAppointmentsByDoctorId.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(fetchAppointmentsByDoctorId.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.appointmentsByDoctor = action.payload;
      // })
      // .addCase(fetchAppointmentsByDoctorId.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      // })

      // Update Appointment Doctor Status
      .addCase(updateAppointmentDoctorStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppointmentDoctorStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.updateAppointmentDoctorResponse = action.payload;
        // message.success("Appointment status updated successfully");
      })
      .addCase(updateAppointmentDoctorStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // message.error("Failed to update appointment status");
      })

      // Post Appointment
      .addCase(postPatientAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postPatientAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.responseData = action.payload;
      })
      .addCase(postPatientAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Appointment
      .addCase(updatePatientAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePatientAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.updateAppointment = action.payload;
      })
      .addCase(updatePatientAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Appointments by Patient ID
      .addCase(fetchAppointmentsByPatientId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointmentsByPatientId.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload.appointments;
      })
      .addCase(fetchAppointmentsByPatientId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

       // Get Appointments by Patient ID
      .addCase(fetchPatientById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatientById.fulfilled, (state, action) => {
        state.loading = false;
        state.patient = action.payload.data;
      })
      .addCase(fetchPatientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetDoctorTimeTableState, logoutPatient } = patientRegisterSlice.actions;
export default patientRegisterSlice.reducer;