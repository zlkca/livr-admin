import { useTranslation } from "react-i18next";
import { DatePicker, DateRangePicker, Grid, InputNumber, Radio, RadioGroup } from "rsuite";

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
      <Grid item xs={12}>
        <Radio value="year" style={{ width: 114, fontSize: 14 }}>
          {t("By Year")}
        </Radio>
        <Grid item style={{ width: 300, display: "inline-block" }}>
          <InputNumber
            defaultValue={parseInt(new Date().getFullYear())}
            value={year}
            onChange={onYearChange}
            style={{ width: "221px" }}
          />
        </Grid>
      </Grid>
      <Grid item xs={12} style={{ marginTop: 5 }}>
        <Radio value="month" style={{ width: 118, fontSize: 14 }}>
          {t("By Month")}
        </Radio>
        <DatePicker
          defaultValue={new Date()}
          format="yyyy-MM"
          value={month}
          onChange={onMonthChange}
        />
      </Grid>
      <Grid item xs={12} style={{ marginTop: 5 }}>
        <Radio value="range" style={{ width: 118, fontSize: 14 }}>
          {t("By Range")}
        </Radio>
        <DateRangePicker value={range} onChange={onRangeChange} />
      </Grid>
    </RadioGroup>
  );
}
