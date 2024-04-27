import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
import { DatePicker, InputNumber, Radio, RadioGroup } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import { Unstable_NumberInput as NumberInput } from "@mui/base/Unstable_NumberInput";

export default function DashboardFilter({
  mode,
  onModeChange,
  year,
  onYearChange,
  month,
  onMonthChange,
}) {
  const { t } = useTranslation();
  return (
    <RadioGroup
      value={mode}
      onChange={onModeChange}
      defaultValue={"month"}
      name="radio-buttons-group"
    >
      <Grid container xs={12} pt={2} display="flex">
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
            cleanable={false}
          />
        </Grid>
      </Grid>
      <Grid container xs={12} display="flex" style={{ marginTop: 5 }}>
        <Grid item xs={4}>
          <Radio value="all" style={{ fontSize: 14 }}>
            {t("All")}
          </Radio>
        </Grid>
      </Grid>
    </RadioGroup>
  );
}
