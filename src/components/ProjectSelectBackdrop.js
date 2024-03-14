import { useState } from "react";
import pascalcase from "pascalcase";
import { useTranslation } from "react-i18next";
import { Backdrop, Card, CardHeader, Grid } from "@mui/material";

import theme from "../theme";
import MDButton from "./MDButton";
import ProjectSelect from "./ProjectSelect";

const mStyles = {
  card: { root: { width: 1800, height: 700 } },
  buttonRow: { width: theme.card.maxWidth, flex: "0 0 100%", marginTop: 15, paddingRight: 10 },
};
export default function ProjectSelectBackdrop({
  open,
  projects,
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
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1, margin: "auto" }}
      open={open}
    >
      <Card style={{ padding: 30, height: 640, width: 1000 }}>
        <CardHeader title={title ? title : ""} />
        <Grid container spacing={2} direction="row" justifyContent="flex-end">
          <ProjectSelect selected={selected} projects={projects} onSelect={handleSelect} />
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
            // {...{ ...btnSubmit.attributes, disabled: submitButtonDisabled }}
            // key={btnSubmit.attributes.label}
            disabled={!data}
            onClick={() => {
              onChoose(data);
              onCancel();
            }}
          >
            {role ? t(`Choose ${pascalcase(role, { pascalCase: true })}`) : t("Choose Project")}
          </MDButton>
        </Grid>
      </Card>
      {/* </CardWidget> */}
    </Backdrop>
  );
}
