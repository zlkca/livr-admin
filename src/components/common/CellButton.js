import { XButton } from "./Button";

export default function CellButton({ onClick, children }) {
  return (
    <XButton variant="contained" size="small" style={{ color: "white" }} onClick={onClick}>
      {children}
    </XButton>
  );
}
