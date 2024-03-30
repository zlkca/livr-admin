import React from "react";
function formatHour(hour) {
  return `${hour}:00`; // ${hour > 11 ? "pm" : "am"}
}

export function TimeColumn({ title, hours, cellStyles }) {
  const mStyles = {
    flex: 1,
    padding: "0px",
    ...cellStyles,
  };
  return (
    <div className="time-column">
      <div key="header" className="header">
        {title}
      </div>
      {hours.map((hour) => (
        <div key={hour} style={mStyles}>
          {formatHour(hour)}
        </div>
      ))}
    </div>
  );
}
