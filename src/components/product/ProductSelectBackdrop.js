import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Backdrop, Card, CardHeader, Grid } from "@mui/material";

import theme from "../../theme";
import MDButton from "../MDButton";
import ProductSelect from "./ProductSelect";

export default function ProductSelectBackdrop({
  open,
  products,
  selected,
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
          <ProductSelect selected={selected} products={products} onSelect={handleSelect} />
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
            {t("Choose Product")}
          </MDButton>
        </Grid>
      </Card>
      {/* </CardWidget> */}
    </Backdrop>
  );
}
