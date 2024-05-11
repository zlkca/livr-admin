import moment from "moment";
import { get, post, put, del } from "./http";
import { buildApiUrl } from "./utils";

export const appointmentAPI = {
  fetchAppointments: async (query) => {
    const url = buildApiUrl("/appointments", query);
    return await get(url);
  },

  fetchAppointment: async (params) => {
    const url = buildApiUrl("/appointments", params);
    return await get(url);
  },

  createAppointment: async (data) => {
    const url = buildApiUrl("/appointments");
    return await post(url, data);
  },

  updateAppointment: async (params, data) => {
    const url = buildApiUrl("/appointments", params);
    return await put(url, data);
  },

  deleteAppointment: async (params) => {
    const url = buildApiUrl("/appointments", params);
    return await del(url);
  },

  searchAppointments: async (query) => {
    const url = buildApiUrl("/search/appointments");
    return await post(url, query);
  },
};
