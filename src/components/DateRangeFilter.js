import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import { DatePicker, DateRangePicker, InputNumber, Radio, RadioGroup } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
export default function DateRangeFilter({
  mode,
  onModeChange,
  year,
  onYearChange,
  month,
  onMonthChange,
  range,
  onRangeChange,
}) {
  const { t } = useTranslation();
  return (
    <RadioGroup
      value={mode}
      onChange={onModeChange}
      defaultValue={"month"}
      name="radio-buttons-group"
    >
      <Grid container xs={12} display="flex">
        <Grid item xs={4}>
          <Radio value="year" style={{ fontSize: 14 }}>
            {t("By Year")}
          </Radio>
        </Grid>
        <Grid item xs={8}>
          <InputNumber
            defaultValue={parseInt(new Date().getFullYear())}
            value={year}
            onChange={onYearChange}
          />
        </Grid>
      </Grid>
      <Grid container xs={12} display="flex" style={{ marginTop: 5 }}>
        <Grid item xs={4}>
          <Radio value="month" style={{ fontSize: 14 }}>
            {t("By Month")}
          </Radio>
        </Grid>
        <Grid item xs={8}>
          <DatePicker
            defaultValue={new Date()}
            format="yyyy-MM"
            value={month}
            onChange={onMonthChange}
            style={{ width: "100%" }}
            caretAs={CalendarMonthIcon}
          />
        </Grid>
      </Grid>
      <Grid container xs={12} display="flex" style={{ marginTop: 5 }}>
        <Grid item xs={4}>
          <Radio value="range" style={{ fontSize: 14 }}>
            {t("By Range")}
          </Radio>
        </Grid>
        <Grid item xs={8}>
          <DateRangePicker
            value={range}
            onChange={(r) => {
              if (r && r.length > 1) {
                r[1].setHours(23, 59, 59);
              }
              onRangeChange(r);
            }}
          />
        </Grid>
      </Grid>
    </RadioGroup>
  );
}
