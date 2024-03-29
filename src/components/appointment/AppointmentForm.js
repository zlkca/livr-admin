import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Grid } from "@mui/material";
// import MDDateTimePicker from "../MDDateTimePicker";
import MDSelect from "../MDSelect";
import MDInput from "../MDInput";
import { accountAPI } from "services/accountAPI";
import { DateRangePicker } from "rsuite";
import AccountSelectBackdrop from "components/account/AccountSelectBackdrop";
import { getAccountsQuery } from "permission";
import { useSelector } from "react-redux";
import { selectBranch } from "redux/branch/branch.selector";
import { selectSignedInUser } from "redux/auth/auth.selector";
import { getEmployeesQuery } from "permission";

const mStyles = {
  root: {
    width: "100%",
  },
  section: {
    width: "100%",
  },
  row: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
  },
  dateCol: {
    width: 240,
    marginRight: 30,
  },
  col: {
    width: 240,
    marginRight: 30,
  },
  longCol: {
    width: "100%", // 510,
    marginRight: 30,
  },
  formControl: {
    width: "100%",
    float: "left",
  },
  error: {
    color: "red",
    textAlign: "left",
    paddingTop: -8,
    fontSize: 12,
  },
};

// data --- appointment object
export default function AppointmentForm({ data, error, onChange }) {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState([]);
  const [backdrop, setBackdrop] = useState({ opened: false });
  const branch = useSelector(selectBranch);
  const signedInUser = useSelector(selectSignedInUser);

  const typeOptions = [
    { id: "measure", label: t("Measure") },
    { id: "install", label: t("Install") },
    { id: "repair", label: t("Repair") },
  ];

  const handleTypeChange = (event) => {
    const a = { ...data, type: event.target.value };
    onChange(a, "type");
  };

  const handleNotesChange = (event) => {
    const a = { ...data, notes: event.target.value };
    onChange(a, "notes");
  };

  // v --- yyyy-mm-ddThh:mm
  const handleStartTimeChange = (v) => {
    const a = { ...data, start: v };
    onChange(a, "start");
  };

  const handleEndTimeChange = (v) => {
    const a = { ...data, end: v };
    onChange(a, "end");
  };

  const handleOpenBackdrop = (role) => {
    const q = getEmployeesQuery(signedInUser, branch ? branch._id : "", role);
    accountAPI.searchAccounts(q).then((r) => {
      const d = r.status === 200 ? r.data : [];
      setAccounts(d);
      // set the selected item
      setBackdrop({ opened: true, role, account: data.employee });
    });
  };

  const handleSelectAccount = (account) => {
    if (account) {
      onChange(
        {
          ...data,
          branch: account.branch,
          employee: {
            _id: account._id,
            username: account.username,
            email: account.email,
            phone: account.phone,
            role: account.role,
          },
        },
        "employee"
      );

      // setError({ ...error, employee: "" });
    }
  };
  const handleRangeChange = (r) => {
    if (r) {
      const a = { ...data, start: r[0].toISOString(), end: r[1].toISOString(), timeRange: r };
      onChange(a, "timeRange");
    } else {
      const a = { ...data, start: "", end: "", timeRange: null };
      onChange(a, "timeRange");
    }
  };
  // const handleSummaryChange = (event) => {
  //   const a = { ...data, summary: event.target.value };
  //   onChange(a, "summary");
  // };
  return (
    <Grid container title={t("Appointment")} styles={mStyles.root}>
      <Grid container item xs={12} spacing={2} display="flex">
        <Grid item xs={3}>
          <MDSelect
            label={t("Type")}
            value={data ? data.type : ""} // controlled
            options={typeOptions}
            onChange={handleTypeChange} // (event, child) => { }
          />
          {error && error.type && <div style={mStyles.error}>{error.type}</div>}
        </Grid>
        {data && data.type && (
          <Grid item xs={3}>
            <MDInput
              readOnly
              label={data.type === "measure" ? t("Sales") : t("Technician")}
              value={data.employee ? data.employee.username : ""}
              onClick={() => handleOpenBackdrop(data.type === "measure" ? "sales" : "technician")}
              helperText={error && error.sales ? error.sales : ""}
            />
          </Grid>
        )}
      </Grid>
      <Grid container item xs={12} spacing={2} display="flex" pt={2}>
        <Grid item xs={5} pb={2}>
          <DateRangePicker
            size="lg"
            format="yyyy-MM-dd HH:mm"
            value={data.timeRange}
            onChange={(r) => {
              // if (r && r.length > 1) {
              //   r[1].setHours(23, 59, 59);
              // }
              handleRangeChange(r);
            }}
          />
          {error && error.timeRange && <div style={mStyles.error}>{error.timeRange}</div>}
        </Grid>
      </Grid>
      <Grid container xs={12} spacing={2} style={{ marginTop: 15 }}>
        <Grid item xs={6}>
          <MDInput
            name="notes"
            label={t("Notes")}
            value={data.notes} // controlled
            onChange={handleNotesChange}
            maxRows={5}
            minRows={5}
            multiline
            // styles={{ formControl: mStyles.formControl }}
          />
        </Grid>
      </Grid>

      <AccountSelectBackdrop
        accounts={accounts}
        open={backdrop.opened}
        selected={backdrop.account}
        role={backdrop.role}
        onCancel={() => {
          setBackdrop({ opened: false });
        }}
        onChoose={handleSelectAccount}
      />
    </Grid>
  );
}

{
  /* 
        <Grid container xs={12} spacing={2} style={{ marginBottom: 30 }}>
        <Grid item xs={6}>
          <MDInput
            name="summary"
            label={t("Summary")}
            value={data.summary} // controlled
            onChange={handleSummaryChange}
          />
        </Grid>
      </Grid>
      <Grid item xs={3}>
          <MDDateTimePicker
            label={t("Start Time")}
            value={data.start}
            onChange={handleStartTimeChange} // date object
            styles={{
              root: { ...mStyles.formControl, display: "flex" },
            }}
          />
          {error && error.start && <div style={mStyles.error}>{error.start}</div>}
        </Grid>
        <Grid item xs={3}>
          <MDDateTimePicker
            label={t("End Time")}
            value={data.end}
            onChange={handleEndTimeChange} // date object
            styles={{
              root: { ...mStyles.formControl, display: "flex" },
            }}
          />
          {error && error.end && <div style={mStyles.error}>{error.end}</div>}
        </Grid> */
}
