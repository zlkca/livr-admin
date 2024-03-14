import { get, post, put, del } from "./http";
import { buildApiUrl } from "./utils";

export const authAPI = {
  hasEmail: async (data) => {
    const url = buildApiUrl("/email-check");
    return await post(url, data);
  },

  login: async (data) => {
    const url = buildApiUrl("/login");
    return await post(url, data);
  },

  loginByToken: async () => {
    const url = buildApiUrl("/token-login");
    return await get(url);
  },

  signup: async (data) => {
    const url = buildApiUrl("/signup");
    return await post(url, data);
  },

  // data --- {email, password, oldPassword}
  changePassword: async (data) => {
    const url = buildApiUrl("/password");
    return await put(url, data);
  },

  // data --- {email, password}
  resetPassword: async (data) => {
    const url = buildApiUrl("/resetPassword");
    return await put(url, data);
  },
};
