import { DatePicker } from "rsuite";

export default function MDYearPicker({ value, onChange, styles }) {
  return <DatePicker format="yyyy" value={value} onChange={onChange} />;
}
