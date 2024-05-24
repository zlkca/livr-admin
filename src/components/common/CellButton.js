import Button from "./Button";

export default function CellButton({ onClick, children }) {
  return (
    <Button variant="contained" size="small" style={{ color: "white" }} onClick={onClick}>
      {children}
    </Button>
  );
}
