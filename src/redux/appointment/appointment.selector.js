import { createSelector } from "@reduxjs/toolkit";

export const selectAppointments = (state) =>
  state.appointment ? state.appointment.appointments : [];
export const selectAppointment = (state) =>
  state.appointment ? state.appointment.appointment : null;

export const selectSalesAppointments = createSelector(
  (state) => state.appointment.appointments,
  (appointments) => appointments.filter((appointment) => appointment.employee.role.name === "sales")
);

export const selectTechnicianAppointments = createSelector(
  (state) => state.appointment.appointments,
  (appointments) =>
    appointments.filter((appointment) => appointment.employee.role.name === "technician")
);

const getAppointmentsByRole = (appointments, roleName) => {
  if (appointments && appointments.length > 0) {
    const rs = appointments.filter((a) => a.employee.role.name === roleName);

    return rs.map((it) => ({
      id: it._id,
      title: it.title,
      notes: it.notes,
      client: it.client.account, //.account.username,
      employee: it.employee, //.username,
      start: new Date(it.start), // toDateTimeString(it.start),
      end: new Date(it.end),
      type: it.type,
      status: it.status,
    }));
  } else {
    return [];
  }
};
