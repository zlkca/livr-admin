import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { deepMerge } from "../../utils";

const baseStyles = {
  root: {
    float: "left",
    width: "100%",
  },
  label: {
    marginTop: "8px",
    textAlign: "left",
    fontSize: 13,
  },
};
// options --- [{id, value, label}]
export default function RadioGroupWidget({ label, value, options, onChange, horizontal, styles }) {
  const mStyles = deepMerge(baseStyles, styles);
  return (
    <FormControl style={mStyles.root}>
      <FormLabel id="radio-buttons-group-label" sx={mStyles.label}>
        {label}
      </FormLabel>
      <RadioGroup
        row={horizontal}
        aria-labelledby="radio-buttons-group-label"
        value={value}
        name="radio-buttons-group"
      >
        {options.map((opt) => (
          <FormControlLabel
            key={opt.id}
            value={opt.value}
            control={<Radio />}
            label={opt.label}
            onChange={onChange}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
