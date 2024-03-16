import { DatePicker } from "rsuite";

export default function MDMonthPicker({ value, onChange, styles }) {
  return <DatePicker format="yyyy-MM" value={value} onChange={onChange} />;
}
