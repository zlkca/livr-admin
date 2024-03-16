import { useState } from "react";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";

const baseStyles = {
  root: {
    margin: "16px 0px",
    width: "100%",
  },
};

export default function MDDateRangePicker({ label, range, onChange, styles }) {
  // const [state, setState] = useState([
  //   {
  //     startDate: new Date(),
  //     endDate: addDays(new Date(), 7),
  //     key: 'selection'
  //   }
  // ]);

  return <DateRangePicker value={range} onChange={onChange} />;

  // const mStyles = deepMerge(baseStyles, styles);

  // const toDateTimeString = (s) => {
  //   const a = s.split("T");
  //   return `${a[0]} ${a[1]}:00`;
  // };

  // return (
  //   <div style={mStyles.root}>
  //     <DateTimePicker
  //       type="datetime-local"
  //       label={label}
  //       value={moment(value)}
  //       onChange={onChange}
  //       // renderInput={(params) => <TextField {...params} />}
  //     />
  //       <DateRangePicker
  //           value={value}
  //           onChange={(newValue) => setValue(newValue)}
  //       />
  //   </div>
  // );
}
