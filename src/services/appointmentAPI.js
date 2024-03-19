import moment from "moment";
import { get, post, put, del } from "./http";
import { buildApiUrl } from "./utils";

export const appointmentAPI = {
  fetchAppointments: async (query) => {
    const url = buildApiUrl("/appointments", query);
    const rsp = await get(url);
    let data = null;
    if (rsp.data) {
      data = rsp.data.map((it) => ({
        ...it,
        start: moment.utc(it.start).local().format("yyyy-MM-DD hh:mm:ss"),
        end: moment.utc(it.end).local().format("yyyy-MM-DD hh:mm:ss"),
        created: moment.utc(it.created).local().format("yyyy-MM-DD hh:mm:ss"),
        updated: moment.utc(it.updated).local().format("yyyy-MM-DD hh:mm:ss"),
      }));
    }
    return { ...rsp, data };
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
    const rsp = await post(url, query);
    let data = null;
    if (rsp.data) {
      data = rsp.data.map((it) => ({
        ...it,
        start: moment.utc(it.start).local().format("yyyy-MM-DD hh:mm:ss"),
        end: moment.utc(it.end).local().format("yyyy-MM-DD hh:mm:ss"),
        created: moment.utc(it.created).local().format("yyyy-MM-DD hh:mm:ss"),
        updated: moment.utc(it.updated).local().format("yyyy-MM-DD hh:mm:ss"),
      }));
    }
    return { ...rsp, data };
  },
};
