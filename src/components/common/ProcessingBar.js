import * as React from "react";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

export default function ProcessingBar() {
  return (
    <div style={{ width: "300px", margin: "auto" }}>
      <LinearProgress />
    </div>
  );
}
