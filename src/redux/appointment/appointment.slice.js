import { createSlice } from "@reduxjs/toolkit";

export const initialAppointmentState = {
  appointment: {
    _id: "",
    title: "",
    email: "",
    phone: 0,
    client: null,
    employee: null,
  },
  appointments: [],
  loading: false,
};

export const appointmentSlice = createSlice({
  name: "appointment",
  initialState: initialAppointmentState,
  reducers: {
    createAppointment: () => {},
    fetchAppointments: (state) => {
      // state = { ...state, loading: true};
    },
    fetchAppointment: (state) => {
      // state = { ...state, loading: true};
    },
    setAppointments: (state, action) => {
      state.loading = false;
      state.appointments = action.payload;
    },
    setAppointment: (state, action) => {
      state.loading = false;
      state.appointment = action.payload;
    },
  },
});

export const {
  createAppointment,
  fetchAppointments,
  fetchAppointment,
  setAppointments,
  setAppointment,
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
