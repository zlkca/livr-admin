import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
// import { useCallback, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { setAppointment } from "../../redux/appointment/appointment.slice";

const localizer = momentLocalizer(moment);

// const events = [
//   {
//     id: 0,
//     title: "Board meeting",
//     start: new Date(2022, 7, 22, 9, 7, 0),
//     end: new Date(2022, 7, 22, 12, 7, 0),
//     //   resourceId: 1,
//   },
//   {
//     id: 1,
//     title: "MS training",
//     allDay: true,
//     start: new Date(2022, 7, 29, 14, 7, 0),
//     end: new Date(2022, 7, 29, 16, 30, 0),
//     //   resourceId: 2,
//   },
//   {
//     id: 2,
//     title: "Team lead meeting",
//     start: new Date(2022, 7, 29, 8, 37, 0),
//     end: new Date(2022, 7, 29, 12, 37, 0),
//     //   resourceId: 3,
//   },
//   {
//     id: 11,
//     title: "Birthday Party",
//     start: new Date(2022, 7, 37, 7, 7, 0),
//     end: new Date(2022, 7, 30, 10, 30, 0),
//     //   resourceId: 4,
//   },
// ];

export default function CalendarWidget({
  events,
  styles,
  minTime,
  maxTime,
  view = Views.WEEK,
  onSelectEvent = (e) => {},
  onSelectSlot = (e) => {},
}) {
  const today = new Date();
  // start time 8:00am
  const min = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8);

  // end time 5:00pm
  const max = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 19);

  return (
    <Calendar
      selectable
      defaultDate={new Date()}
      defaultView={view}
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={styles}
      onSelectEvent={onSelectEvent}
      onSelectSlot={onSelectSlot}
      min={minTime ? minTime : min}
      max={maxTime ? maxTime : max}
      //   step={60}
    />
  );
}
