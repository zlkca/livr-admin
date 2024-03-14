import * as React from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { deepMerge } from "../utils";
import moment from "moment";

const baseStyles = {
  root: {
    margin: "16px 0px",
    width: "100%",
  },
};

export default function MDDateTimePicker({ label, value, onChange, styles }) {
  const mStyles = deepMerge(baseStyles, styles);

  const toDateTimeString = (s) => {
    const a = s.split("T");
    return `${a[0]} ${a[1]}:00`;
  };

  return (
    <div style={mStyles.root}>
      <DateTimePicker
        type="datetime-local"
        label={label}
        value={moment(value)}
        onChange={onChange}
        // renderInput={(params) => <TextField {...params} />}
      />
    </div>
  );
}
