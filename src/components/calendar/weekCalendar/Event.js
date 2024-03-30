import React from "react";
import { utcToLocalTime } from "../utils";

export function Event({ data, styles }) {
  const mStyles = {
    position: "absolute",
    // width: "120px",
    padding: "5px",
    ...styles,
  };
  return styles.top >= 0 ? (
    <div className="event" style={mStyles} key={data.start}>
      <p style={{ fontSize: 14 }}>{data.employee ? data.employee.username : "Unknown"}</p>
      <p style={{ fontSize: 13 }}>{`${utcToLocalTime(data.start)} - ${utcToLocalTime(
        data.end
      )}`}</p>
    </div>
  ) : (
    <div key={data.start} />
  );
}
