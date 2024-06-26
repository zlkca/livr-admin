import { ACCOUNT_COOKIE } from "const";
import { JWT_COOKIE } from "const";
import Cookies from "js-cookie";

const merge = require("deepmerge");

export const toDateTimeString = (s) => {
  if (s) {
    const ds = s.split("T");
    const date = ds ? ds[0] : "";
    const ts = ds[1].split(".");
    const time = ts[0];
    return `${date} ${time}`;
  } else {
    return "";
  }
};

export const getAddressString = (address, withPostcode = false) => {
  const unit = address.unitNumber ? address.unitNumber : "";
  const postcode = withPostcode ? address.postcode : "";
  return unit
    ? `${unit} ${address.streetNumber} ${address.streetName}, ${address.city} ${address.province}, ${address.country} ${postcode}`.trim()
    : `${address.streetNumber} ${address.streetName}, ${address.city} ${address.province}, ${address.country} ${postcode}`.trim();
};

export const deepMerge = (x, y) => {
  return merge(x, y ? y : {});
};

// emplyee Id is 4 digital string
export const isValidEmployeeId = (s) => {
  let isDigitalString = /^\d+$/.test(s);
  return isDigitalString && s.length === 4;
};

export const toInchValue = (s) => {
  const a = s.split(`"`);
  if (a[1] === "") {
    return parseInt(a[0]);
  } else {
    return parseInt(a[0]) + parseInt(a[1]) / 16;
  }
};

export const getRoomIds = (buildings) => {
  const roomIds = [];
  if (buildings && buildings.length > 0) {
    buildings.forEach((building) => {
      const floors = building.floors;
      if (floors && floors.length > 0) {
        floors.forEach((floor) => {
          const rooms = floor.rooms;
          if (rooms && rooms.length > 0) {
            rooms.forEach((room) => {
              roomIds.push(room._id);
            });
          }
        });
      }
    });
  }
  return roomIds;
};

export const isValidEmail = (email) => {
  const emailRegex = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i;
  return emailRegex.test(email);
};

var timeout;

export function debounce(cb, delay = 300) {
  return (...args) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}

export function getHttpContentTypeByExt(ext) {
  switch (ext) {
    case "doc":
      return "application/msword";
    case "dot":
      return "application/msword";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "dotx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.template";
    case "docm":
      return "application/vnd.ms-word.document.macroEnabled.12";
    case "dotm":
      return "application/vnd.ms-word.template.macroEnabled.12";
    case "xls":
      return "application/vnd.ms-excel";
    case "xlt":
      return "application/vnd.ms-excel";
    case "xla":
      return "application/vnd.ms-excel";
    case "xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case "xltx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.template";
    case "xlsm":
      return "application/vnd.ms-excel.sheet.macroEnabled.12";
    case "xltm":
      return "application/vnd.ms-excel.template.macroEnabled.12";
    case "xlam":
      return "application/vnd.ms-excel.addin.macroEnabled.12";
    case "xlsb":
      return "application/vnd.ms-excel.sheet.binary.macroEnabled.12";
    case "ppt":
      return "application/vnd.ms-powerpoint";
    case "pot":
      return "application/vnd.ms-powerpoint";
    case "pps":
      return "application/vnd.ms-powerpoint";
    case "ppa":
      return "application/vnd.ms-powerpoint";
    case "pptx":
      return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    case "potx":
      return "application/vnd.openxmlformats-officedocument.presentationml.template";
    case "ppsx":
      return "application/vnd.openxmlformats-officedocument.presentationml.slideshow";
    case "ppam":
      return "application/vnd.ms-powerpoint.addin.macroEnabled.12";
    case "pptm":
      return "application/vnd.ms-powerpoint.presentation.macroEnabled.12";
    case "potm":
      return "application/vnd.ms-powerpoint.template.macroEnabled.12";
    case "ppsm":
      return "application/vnd.ms-powerpoint.slideshow.macroEnabled.12";
    case "mdb":
      return "application/vnd.ms-access";
    default:
      return `application/${ext}`;
  }
}

export function getRamdomString(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function generateProjectNumber() {
  const now = new Date().toISOString();
  const date = now.split("T")[0].split("-").join("");
  return `${date.substring(2)}${getRamdomString(6)}`;
}

export function logout() {
  Cookies.set(JWT_COOKIE, "");
  Cookies.set(ACCOUNT_COOKIE, "");
  window.location.href = "/authentication/sign-in";
}

export function numToString(num) {
  if (num === undefined || num === null) return "";
  if (num >= 1000 && num < 1000000) {
    return (num / 1000).toFixed(1) + "K"; // Convert to Kilos
  } else if (num >= 1000000 && num < 1000000000) {
    return (num / 1000000).toFixed(1) + "M"; // Convert to Millions
  } else if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B"; // Convert to Billions
  } else if (num <= -1000 && num > -1000000) {
    return (num / 1000).toFixed(1) + "K"; // Convert to negative Kilos
  } else if (num <= -1000000 && num > -1000000000) {
    return (num / 1000000).toFixed(1) + "M"; // Convert to negative Millions
  } else if (num <= -1000000000) {
    return (num / 1000000000).toFixed(1) + "B"; // Convert to negative Billions
  } else {
    return num.toFixed(2); // Return the original number
  }
}

export function getFinanceSummary(orders) {
  let preTax = 0;
  let total = 0;
  let balance = 0;
  for (let i in orders) {
    const d = orders[i];
    if (d.taxOpt === "include") {
      total += parseFloat(d.amount);
    } else {
      total += parseFloat(d.amount) * 1.13;
    }
    balance += parseFloat(d.balance);
    preTax += parseFloat(d.amount);
  }
  return { preTax, total, receivable: -balance, received: total + balance };
}

export function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}
export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1);
}
export function getLastDayOfMonth(year, month) {
  return new Date(year, month + 1, 0, 23, 59, 59);
}
export function getFirstDayOfYear(year) {
  return new Date(year, 0, 1);
}
export function getLastDayOfYear(year) {
  return new Date(year, 13, 0, 23, 59, 59);
}
export function getMonthRangeQuery() {
  const today = new Date();
  const firstDay = getFirstDayOfMonth(today.getFullYear(), today.getMonth());
  const lastDay = getLastDayOfMonth(today.getFullYear(), today.getMonth());
  const fd = `${firstDay.toISOString()}`;
  const ld = `${lastDay.toISOString()}`;
  return { created: { $gte: fd, $lte: ld } };
}

// the 1st day of last month to last day of next month
export function getDefaultDateRange() {
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();

  let startMonth = month - 1;
  let startYear = year;

  // If month is now past December, decrement year
  if (startMonth < 0) {
    startYear = year - 1;
    startMonth = 11;
  }

  let endMonth = month + 1;
  let endYear = year;

  if (endMonth > 11) {
    endYear = year + 1;
    endMonth = 0;
  }

  const firstDay = new Date(startYear, startMonth, 1);
  const lastDay = getLastDayOfMonth(endYear, endMonth);

  return [firstDay, lastDay];
}

export function getDefaultDateRangeQuery() {
  const range = getDefaultDateRange();

  const fd = `${range[0].toISOString()}`;
  const ld = `${range[1].toISOString()}`;
  return { created: { $gte: fd, $lte: ld } };
}

export function getNextMonthRange(date) {
  let year = date.getFullYear();
  let month = date.getMonth();

  month++;

  // If month is now past December, increment year
  if (month > 11) {
    year++;
    month = 0;
  }

  const firstDay = new Date(year, month, 1);
  const lastDay = getLastDayOfMonth(year, month + 1);

  return {
    firstDay,
    lastDay,
    iMonth: month,
    year,
  };
}

export function getPrevMonthRange(date) {
  let year = date.getFullYear();
  let month = date.getMonth();

  month--;

  // If month is now past December, decrement year
  if (month < 0) {
    year--;
    month = 11;
  }

  const firstDay = new Date(year, month, 1);
  const lastDay = getLastDayOfMonth(year, month + 1);

  return {
    firstDay,
    lastDay,
    iMonth: month,
    year,
  };
}

export function getUiPath(pathname) {
  const arr = pathname.split("/");
  if (arr.length > 2) {
    return arr[1];
  } else {
    return pathname.replace("/", "");
  }
}
