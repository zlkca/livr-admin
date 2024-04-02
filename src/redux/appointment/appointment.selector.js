import { createSelector } from "@reduxjs/toolkit";

export const selectAppointments = (state) =>
  state.appointment ? state.appointment.appointments : [];
export const selectAppointment = (state) =>
  state.appointment ? state.appointment.appointment : null;
