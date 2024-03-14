import queryString from "query-string";
import { RootApiUrl } from "../const";

// RootApiUrl [string] --- global
// path [string] --- the path without trailing /
// params [object or string]
export const buildApiUrl = (path, params) => {
  let url = RootApiUrl + (path.startsWith("/") ? path : `/${path}`);
  if (typeof params === "string") {
    // path/:id
    return `${url}/${params}`;
  }
  if (typeof params === "object") {
    // path?q=x&py
    return `${url}?${queryString.stringify(params)}`;
  }
  return url;
};
