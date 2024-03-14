import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Grid } from "@mui/material";
import MDDateTimePicker from "./MDDateTimePicker";
import MDSelect from "./MDSelect";
import MDInput from "./MDInput";
import { accountAPI } from "services/accountAPI";
import AccountSelectBackdrop from "./AccountSelectBackdrop";

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

  const typeOptions = [
    { id: "measurement", label: t("Measurement") },
    { id: "installation", label: t("Installation") },
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
    accountAPI.fetchAccounts({ role }).then((r) => {
      const d = r.status === 200 ? r.data : [];
      setAccounts(d);
      let account = data.employee;
      setBackdrop({ opened: true, role, account });
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
            branch: account.branch,
            role: account.role,
          },
        },
        "employee"
      );

      // setError({ ...error, employee: "" });
    }
  };

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
              label={data.type === "measurement" ? t("Sales") : t("Technician")}
              value={data.employee ? data.employee.username : ""}
              onClick={() =>
                handleOpenBackdrop(data.type === "measurement" ? "sales" : "technician")
              }
              helperText={error && error.sales ? error.sales : ""}
            />
          </Grid>
        )}
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

      <Grid
        container
        xs={12}
        spacing={2}
        display="flex"
        justifyContent="start"
        style={{ marginTop: 15 }}
      >
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
