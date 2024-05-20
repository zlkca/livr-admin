import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import theme from "../../theme";
import { deepMerge } from "../../utils";

const baseStyles = {
  root: {
    ...theme.input,
    width: "100%",
  },
  formControl: {
    width: "100%",
    marginBottom: 15,
    paddingRight: 15,
  },
  helperText: {
    fontSize: 12,
    textTransform: "none",
  },
};

export default function InputWidget({
  name,
  value,
  label,
  type,
  multiline,
  rows,
  readOnly,
  variant,
  onChange,
  styles,
  helperText,
  FormHelperTextProps,
  adornment,
}) {
  const mStyles = deepMerge(baseStyles, styles);
  const inputProps = {
    readOnly,
    ...adornment,
  };

  return (
    <div style={mStyles.root}>
      <FormControl style={mStyles.formControl}>
        <TextField
          fullWidth
          name={name}
          label={label}
          value={value ?? ""} // controlled component
          type={type ?? "text"}
          multiline={multiline ?? false}
          rows={rows ?? 1}
          // maxRows={maxRows ?? 1}
          onChange={onChange}
          variant={variant ? variant : "standard"}
          InputProps={inputProps}
          FormHelperTextProps={FormHelperTextProps}
          helperText={helperText}
        />
      </FormControl>
    </div>
  );
}
