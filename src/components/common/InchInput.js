import { InputAdornment } from "@mui/material";
import InputWidget from "./InputWidget";

const mStyles = {
  formControl: {
    width: "150px",
    marginBottom: 15,
  },
};

export default function InchInput({ name, label, value, error, onChange }) {
  return (
    <InputWidget
      name={name}
      label={label}
      value={value} // controlled
      onChange={onChange}
      styles={{ root: mStyles.formControl }}
      adornment={{
        endAdornment: <InputAdornment position="end">/16</InputAdornment>,
      }}
      helperText={error && error[name] ? error[name] : 'eg. 12"15 or 15"'}
      FormHelperTextProps={error && error[name] ? { error: true } : null}
    />
  );
}
