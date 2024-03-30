import React from "react";
import { utcToLocal } from "../utils";

export function Event({ data, styles }) {
  const mStyles = {
      position: 'absolute',
      width: '160px',
      ...styles
  };
  return (
    styles.top >= 0 ?
    <div className="event" style={mStyles} key={data.start}>
      <p>{data.sales}</p>
      <p>{`${utcToLocal(data.start)} - ${utcToLocal(data.end)}`}</p>
    </div>
    :
    <div key={data.start} />
  );
}

