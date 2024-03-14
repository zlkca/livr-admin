import React, { useEffect, useRef } from "react";
import theme from "../../theme";
import { deepMerge } from "../../utils";

export default function TextArea({ name, value, label, rows, readOnly, onChange, styles }) {
  const ref = useRef();

  const baseStyles = {
    root: {
      ...theme.body2,
      boxSizing: "border-box",
      width: "100%",
      aspectRatio: 3.46,
      border: "0px",
      borderTop: `1px solid ${theme.grey.light}`,
      paddingLeft: "4.65%",
      paddingRight: "4.65%",
      backgroundColor: "#e2e9e4",
      paddingTop: "3.5%",
      paddingBottom: "3.5%",
      // "&::placeholder": {
      //     ...theme.body1
      // },
      overflowY: "auto",
    },
  };

  const mStyles = deepMerge(baseStyles, styles);

  useEffect(() => {
    ref.current.placeholder = ref.current.placeholder.replace(/\\n/g, "\n\n");
  }, []);

  return (
    <textarea
      ref={ref}
      className="zTextArea"
      name={name}
      placeholder={label}
      rows={rows ? rows : 5}
      // readonly={readOnly}
      value={value ?? ""} // controlled component
      onChange={onChange}
      style={mStyles.root}
    />
  );
}
