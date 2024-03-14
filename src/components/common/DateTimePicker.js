import * as React from "react";
import TextField from "@mui/material/TextField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { deepMerge } from "../../utils";

const baseStyles = {
  root: {
    margin: "16px 0px",
    width: "100%",
  },
};

export default function DateTimePickerWidget({ label, value, onChange, styles }) {
  const mStyles = deepMerge(baseStyles, styles);

  const toDateTimeString = (s) => {
    const a = s.split("T");
    return `${a[0]} ${a[1]}:00`;
  };

  return (
    <div style={mStyles.root}>
      {/* <LocalizationProvider dateAdapter={AdapterMoment}>
        <DateTimePicker
          type="datetime-local"
          label={label}
          value={value}
          onChange={onChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider> */}

      <TextField
        id="datetime-local"
        label={label}
        type="datetime-local"
        value={value}
        onChange={(e) => onChange(toDateTimeString(e.target.value))}
        // defaultValue="2017-05-24T10:30"
        sx={{ width: 250 }}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </div>
  );
}
