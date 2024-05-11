import axios from "axios";
import { JWT_COOKIE } from "const";
import Cookies from "js-cookie";
import { logout } from "utils";

const REQ_TIMEOUT = 1000 * 80; // 80 seconds

export const get = async (url) => {
  const token = Cookies.get(JWT_COOKIE);
  const config = {
    timeout: REQ_TIMEOUT,
    headers: {
      Authorization: token,
    },
  };
  try {
    return await axios.get(url, config);
  } catch (e) {
    if (e.code === "ECONNABORTED") {
      // server no response, Service Unavailable
      return { data: [], status: 503 };
    } else if (e.code === "ERR_NETWORK") {
      // host is down, Gatway Timeout
      return { data: [], status: 504 };
    } else if (e.code === "ERR_BAD_REQUEST") {
      if (e.response.status === 440) {
        logout();
      }
      return { data: [], status: 440 };
    } else {
      const { data, status } = e.response;
      return { data, status };
    }
  }
};

export const post = async (url, data) => {
  const token = Cookies.get(JWT_COOKIE);
  const config = {
    timeout: REQ_TIMEOUT,
    headers: {
      Authorization: token,
    },
  };
  try {
    return await axios.post(url, data, config);
  } catch (e) {
    if (e.code === "ECONNABORTED") {
      // server no response, Service Unavailable
      return { data: null, status: 503 };
    } else if (e.code === "ERR_NETWORK") {
      // host is down, Gatway Timeout
      return { data: null, status: 504 };
    } else if (e.code === "ERR_BAD_REQUEST") {
      if (e.response.status === 440) {
        logout();
      }
      return { data: null, status: 440 };
    } else {
      const { data, status } = e.response;
      return { data, status };
    }
  }
};

export const put = async (url, data) => {
  const token = Cookies.get(JWT_COOKIE);
  const config = {
    timeout: REQ_TIMEOUT,
    headers: {
      Authorization: token,
    },
  };
  try {
    return await axios.put(url, data, config);
  } catch (e) {
    if (e.code === "ECONNABORTED") {
      // server no response, Service Unavailable
      return { data: null, status: 503 };
    } else if (e.code === "ERR_NETWORK") {
      // host is down, Gatway Timeout
      return { data: null, status: 504 };
    } else if (e.code === "ERR_BAD_REQUEST") {
      if (e.response.status === 440) {
        logout();
      }
      return { data: null, status: 440 };
    } else {
      const { data, status } = e.response;
      return { data, status };
    }
  }
};

export const del = async (url) => {
  const token = Cookies.get(JWT_COOKIE);
  const config = {
    timeout: REQ_TIMEOUT,
    headers: {
      Authorization: token,
    },
  };
  try {
    return await axios.delete(url, config);
  } catch (e) {
    if (e.code === "ECONNABORTED") {
      // server no response, Service Unavailable
      return { data: null, status: 503 };
    } else if (e.code === "ERR_NETWORK") {
      // host is down, Gatway Timeout
      return { data: null, status: 504 };
    } else if (e.code === "ERR_BAD_REQUEST") {
      if (e.response.status === 440) {
        logout();
      }
      return { data: null, status: 440 };
    } else {
      const { data, status } = e.response;
      return { data, status };
    }
  }
};
