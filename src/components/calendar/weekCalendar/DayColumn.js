import React from "react";
import { getEventPosition, getWeekdayName } from "../utils";
import { Event } from "./Event";
import { useTranslation } from "react-i18next";

export function DayColumn({ date, hours, events, cellStyles, headerStyles }) {
  const { t } = useTranslation();
  const mStyles = {
    flex: 1,
    padding: "0px",
    ...cellStyles,
  };
  return (
    <div className="day-column">
      <div className="header">
        <div style={{ width: "100%" }}>{date.toISOString().split("T")[0]}</div>
        <div style={{ width: "100%" }}>{t(getWeekdayName(date))}</div>
      </div>
      <div className="hours">
        {hours.map((hour) => (
          <div key={hour} style={mStyles}></div>
        ))}
      </div>
      {events &&
        events.length > 0 &&
        events.map((event) => {
          return (
            <Event
              styles={{
                ...getEventPosition(
                  event,
                  cellStyles.width,
                  cellStyles.height,
                  headerStyles.height,
                  8
                ),
                backgroundColor: event.color,
              }}
              data={event}
            />
          );
        })}
    </div>
  );
}
