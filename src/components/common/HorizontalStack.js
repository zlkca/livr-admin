import Stack from "@mui/material/Stack";

export default function HorizontalStack({ children }) {
  return (
    <Stack direction="row" spacing={2} justifyContent="flex-end" style={{ width: "100%" }}>
      {children}
    </Stack>
  );
}
