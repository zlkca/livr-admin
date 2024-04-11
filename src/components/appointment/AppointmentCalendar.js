import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Grid, useMediaQuery } from "@mui/material";

import { WeekCalendar } from "components/calendar/weekCalendar";
import { getEmployeesQuery } from "permission";
// import { setEmployees } from "redux/account/account.slice";
import { setSignedInUser } from "redux/auth/auth.slice";
import { accountAPI } from "services/accountAPI";
import { logout } from "utils";
import { EmployeeFilter } from "components/account/EmployeeFilter";
import { generateColors } from "components/calendar/utils";
import theme from "theme";

export function AppointmentCalendar({ appointments, user, branch }) {
  const dispatch = useDispatch();
  const colors = generateColors(12);
  const [events, setEvents] = useState([]);
  //   const employees = useSelector(selectEmployees);
  const [employees, setEmployees] = useState([]);
  const [employeeColorMap, setEmployeeColorMap] = useState({});
  const isMobile = useMediaQuery(theme.breakpoints.up("xs"));
  useEffect(() => {
    const q = getEmployeesQuery(user, branch ? branch._id : "");
    accountAPI
      .searchAccounts({
        ...q,
      })
      .then((r) => {
        if (r.status == 200) {
          const es = r.data.map((it, i) => ({ ...it, color: colors[i] }));
          setEmployees(es);
          const map = {};
          es.forEach((employee) => {
            if (employee.color) {
              map[employee._id] = employee.color;
            }
          });
          setEmployeeColorMap(map);
        } else if (r.status === 401) {
          dispatch(setSignedInUser());
          logout();
        }
      });
  }, []);

  useEffect(() => {
    if (employees && employees.length > 0 && appointments && appointments.length > 0) {
      const es = filterAppointmentsByEmployees(appointments, employees);
      setEvents(es);
    }
  }, [employees, appointments]);

  function filterAppointmentsByEmployees(appointments, employees) {
    const ret = [];
    appointments.forEach((appointment) => {
      // Check if appointment matches employees
      const matchesEmployees = employees.some((employee) => {
        return employee._id === appointment.employee._id;
      });

      if (matchesEmployees) {
        // Get employee color
        const color = employeeColorMap[appointment.employee._id];

        // Return a copy of the appointment with color added
        ret.push({
          ...appointment,
          color,
        });
      }
    });
    return ret;
  }

  const handleSelectEmployees = (employeeIds) => {
    const es = employees.filter((it) => employeeIds.includes(it._id));
    const evs = filterAppointmentsByEmployees(appointments, es);
    setEvents(evs);
  };

  return (
    <Grid container>
      <Grid item xs={12} md={2}>
        <EmployeeFilter accounts={employees} user={user} onChange={handleSelectEmployees} />
      </Grid>
      <Grid item xs={12} md={10} style={{ paddingRight: isMobile ? 0 : 15 }}>
        <WeekCalendar events={events} onNextWeek={() => {}} onPrevWeek={() => {}} />
      </Grid>
    </Grid>
  );
}
