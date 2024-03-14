import React from "react";
import { Button, Box, Stack } from "@mui/material";
// "#545b66"
export default function ActionBar({ buttons, data }) {
  return buttons && buttons.length > 0 ? (
    <Stack spacing={2} direction="row" justifyContent="flex-end">
      {buttons.map((btn) =>
        btn.variant === "contained" ? (
          <Button
            key={btn.label}
            variant={btn.variant ? btn.variant : "outlined"}
            size="small"
            style={{ borderRadius: 2, fontSize: "12px", color: "white" }}
            onClick={() => btn.onClick(data)}
          >
            {btn.label}
          </Button>
        ) : (
          <Button
            key={btn.label}
            variant={btn.variant ? btn.variant : "outlined"}
            size="small"
            style={{
              borderRadius: 2,
              color: "black",
              fontWeight: 700,
              fontSize: "12px",
              backgroundColor: "white",
            }}
            onClick={() => btn.onClick(data)}
          >
            {btn.label}
          </Button>
        )
      )}
    </Stack>
  ) : (
    <Box style={{ height: "29px" }} />
  );
}
