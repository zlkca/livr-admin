import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

// option - {id, label}
export default function MDSelect(props) {
  const { value, label, options, onChange } = props;

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        {...props}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        // label="Age"
        onChange={onChange}
        sx={{ height: 44 }}
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
  );
}
