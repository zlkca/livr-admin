import React, { useLayoutEffect, useRef } from "react";
import { useState, useEffect } from "react";
import "../styles.css";
import { DayColumn } from "./DayColumn";
import { TimeColumn } from "./TimeColumn";
import { Event } from "./Event";
import {
  getCurrentWeekDates,
  getNextWeekDates,
  getPrevWeekDates,
  getEventMapByDate,
  toLocalDateString,
} from "../utils";
import { useTranslation } from "react-i18next";

const CellHeight = 80;
const HeaderHeight = 60;

export function WeekCalendar({ events, onNextWeek, onPrevWeek }) {
  const [dates, setDates] = useState([]);
  const [eventsByDate, setEventsByDate] = useState({});
  const [cellWidth, setCellWidth] = useState(120);
  const gridRef = useRef();
  const { t } = useTranslation();

  useEffect(() => {
    const dates = getCurrentWeekDates();
    setDates(dates);
  }, []);
  useEffect(() => {
    if (events) {
      const em = getEventMapByDate(events);
      setEventsByDate(em);
    }
  }, [events]);

  useLayoutEffect(() => {
    if (gridRef.current) {
      console.log(gridRef.current.offsetWidth);
      setCellWidth(parseInt(gridRef.current.offsetWidth) / 8);
    }
  }, []);

  const handleNextWeek = () => {
    const ds = getNextWeekDates(dates);
    setDates(ds);
    onNextWeek(ds);
  };

  const handlePrevWeek = () => {
    const ds = getPrevWeekDates(dates);
    setDates(ds);
    onPrevWeek(ds);
  };

  const hours = [];
  for (let i = 8; i <= 20; i++) {
    hours.push(i);
  }

  return (
    <div className="root">
      <div sytle={{ paddingBottom: 8 }}>
        <button onClick={handlePrevWeek} style={{ marginRight: 8, padding: "5px 10px" }}>
          {t("Previous Week")}
        </button>
        <button onClick={handleNextWeek} style={{ marginRight: 8, padding: "5px 10px" }}>
          {t("Next Week")}
        </button>
      </div>
      <div className="calendar-grid" ref={gridRef}>
        <TimeColumn
          title=""
          hours={hours}
          cellStyles={{
            width: cellWidth,
            height: CellHeight,
            borderBottom: "1px solid #ddd",
          }}
        />
        <div className="week">
          {dates.map((date) => {
            return (
              <DayColumn
                cellStyles={{
                  width: cellWidth,
                  height: CellHeight,
                  borderBottom: "1px solid #ddd",
                }}
                headerStyles={{ height: HeaderHeight }}
                key={date}
                date={date}
                hours={hours}
                events={eventsByDate[toLocalDateString(date)]}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
