import { useState } from "react";
import pascalcase from "pascalcase";
import { useTranslation } from "react-i18next";
import { Backdrop, Card, CardHeader, Grid } from "@mui/material";

import theme from "../../theme";
import MDButton from "../MDButton";
import AccountSelect from "./AccountSelect";

const mStyles = {
  card: { root: { width: 1800, height: 700 } },
  buttonRow: { width: theme.card.maxWidth, flex: "0 0 100%", marginTop: 15, paddingRight: 10 },
};
export default function AccountSelectBackdrop({
  open,
  accounts,
  selected,
  role,
  onCancel,
  onChoose,
  title,
}) {
  const { t } = useTranslation();

  const [data, setData] = useState();

  const handleSelect = (it) => {
    setData(it);
  };

  return (
    <Backdrop
      container
      xs={12}
      spacing={2}
      direction="row"
      justifyContent={"center"}
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      {/* <CardWidget styles={mStyles.card}> */}
      <Card style={{ padding: 30, height: 640, width: 1000 }}>
        <CardHeader title={title ? title : ""} />
        <Grid container spacing={2} direction="row" justifyContent="flex-end">
          <AccountSelect selected={selected} accounts={accounts} onSelect={handleSelect} />
        </Grid>
        <Grid display="flex" justifyContent="flex-end" xs={12} px={2} py={2}>
          <MDButton
            color="secondary"
            variant={"outlined"}
            style={{ marginRight: 20 + "px" }}
            onClick={onCancel}
          >
            {t("Cancel")}
          </MDButton>
          <MDButton
            color="info"
            disabled={!data}
            onClick={() => {
              onChoose(data);
              onCancel();
            }}
          >
            {role ? t(`Choose ${pascalcase(role, { pascalCase: true })}`) : t("Choose Account")}
          </MDButton>
        </Grid>
      </Card>
      {/* </CardWidget> */}
    </Backdrop>
  );
}
