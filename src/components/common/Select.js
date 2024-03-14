import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import theme from "../../theme";
import { deepMerge } from "../../utils";

const baseStyles = {
  root: {
    ...theme.select,
  },
  formControl: {
    width: "100%",
    marginBottom: 15,
    paddingRight: 15,
  },
};

// options --- [{id, label}]
export default function SelectWidget({
  name,
  value,
  options,
  label,
  readOnly,
  variant,
  onChange,
  styles,
}) {
  const mStyles = deepMerge(baseStyles, styles);

  return (
    <div style={mStyles.root}>
      <FormControl variant={variant ? variant : "standard"} style={mStyles.formControl}>
        <InputLabel id="single-select-label">{label}</InputLabel>
        <Select
          style={{ textAlign: "left" }}
          id="single-select"
          labelId="single-select-label"
          name={name ? name : "select"}
          value={value ?? ""} // controlled component
          onChange={onChange}
          inputProps={{ readOnly }}
        >
          {options &&
            options.length > 0 &&
            options.map((opt) => (
              <MenuItem key={opt.id} value={opt.id}>
                {opt.label}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
}
