import { FormControl } from "@mui/material";
import Select from "./Select";
import Input from "./InputWidget";

const mStyles = {
  root: {
    width: "100%",
  },
  formControl: {
    width: "100%",
    marginBottom: 15,
    paddingRight: 30,
  },
};

export default function Form({ fields }) {
  return (
    <form
      style={mStyles.root}
      onSubmit={() => {
        return;
      }}
    >
      {fields &&
        fields.length > 0 &&
        fields.map((field) => {
          if (field.type === "input") {
            const { name, value, label, onChange } = field.attributes;
            return (
              <FormControl key={name} style={mStyles.formControl}>
                <Input
                  name={name}
                  label={label}
                  value={value} // controlled
                  onChange={onChange}
                />
              </FormControl>
            );
          } else if (field.type === "select") {
            const { name, value, label, options, onChange } = field.attributes;
            return (
              <FormControl key={name} style={mStyles.formControl}>
                <Select
                  name={name}
                  label={label}
                  value={value} // controlled
                  options={options}
                  onChange={onChange} // (event, child) => { }
                />
              </FormControl>
            );
          } else {
            return <div></div>;
          }
        })}
    </form>
  );
}
