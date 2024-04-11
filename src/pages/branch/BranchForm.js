import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import MDBox from "components/MDBox";
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import { Card, Grid } from "@mui/material";
import Footer from "layouts/Footer";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import AddressForm from "components/AddressForm";
import { branchAPI } from "services/branchAPI";
import { selectBranch } from "redux/branch/branch.selector";
import { setBranch } from "redux/branch/branch.slice";
import { setSnackbar } from "redux/ui/ui.slice";
import CardHead from "components/CardHead";
import MDSection from "components/MDSection";

const mStyles = {
  root: {
    width: "100%",
  },
  formControl: {
    width: "100%",
    marginBottom: 15,
  },
  row: {
    width: "100%",
    display: "flex",
    justifyContent: "start",
    marginTop: 20,
  },
  col: {
    width: "33%",
    float: "left",
    paddingBottom: 15,
  },
  card: {
    // root: { width: theme.card.width },
  },
  buttonRow: {
    // width: theme.card.width,
    flex: "0 0 100%",
    paddingRight: 10,
  },
};

export default function BranchForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const [error, setError] = useState({});
  const [branch, setData] = useState({
    address: {
      unitNumber: "",
      streetNumber: "",
      streetName: "",
      city: "",
      province: "",
      country: "",
      postcode: "",
    },
  });
  const data = useSelector(selectBranch);

  useEffect(() => {
    if (data) {
      setData({ ...data });
    } else {
      if (params && params.id) {
        // what if id === new ??
        if (!data) {
          // refetch if page refreshed
          branchAPI.fetchBranch(params.id).then((r) => {
            if (r.status === 200) {
              setData({ ...r.data });
            }
          });
        }
      }
    }
  }, [data]);

  const validate = (d) => {
    if (!d.address || !d.address.streetName) {
      setError({ ...error, address: t("Address is required") });
      return false;
    }
    if (!d.name) {
      setError({ ...error, name: t("Name is required") });
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    const d = {
      ...branch,
    };
    if (!validate(d)) {
      return false;
    }
    if (branch._id) {
      branchAPI.updateBranch(branch._id, d).then((r) => {
        if (r.status === 200) {
          dispatch(setBranch(r.data));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t("Updated Successfully!"),
              open: true,
            })
          );
          navigate("/branches");
        }
      });
    } else {
      branchAPI
        .createBranch({
          ...d,
        })
        .then((r) => {
          if (r.status === 200) {
            dispatch(setBranch(r.data));
            dispatch(
              setSnackbar({
                color: "success",
                icon: "check",
                title: "",
                content: t("Created Successfully!"),
                open: true,
              })
            );
            navigate("/branches");
          }
        });
    }
  };

  const handleNameChange = (event) => {
    const a = { ...branch, name: event.target.value };
    setData(a);
    setError();
  };

  const handleNotesChange = (event) => {
    const a = { ...branch, notes: event.target.value };
    setData(a);
  };

  const handleAddressChange = (obj) => {
    setData({
      ...branch,
      address: { ...branch.address, ...obj },
    });
    setError();
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHead title={branch._id ? t("Edit Branch") : t("Create Branch")} />
              {branch && (
                <MDSection>
                  <Grid container>
                    <Grid item xs={12} sm={10} md={10} lg={8} xl={8}>
                      <MDInput
                        // style={{ width: 400 }}
                        xs={12}
                        sm={10}
                        md={10}
                        lg={4}
                        xl={4}
                        name="Name"
                        label={t("Branch Name")}
                        value={branch.name}
                        onChange={handleNameChange}
                        helperText={error && error.name ? error.name : ""}
                        FormHelperTextProps={error && error.name ? { error: true } : null}
                      />
                    </Grid>

                    <Grid item xs={12} sm={10} md={10} lg={8} xl={8}>
                      {/* <CardWidget title={t("Address")} styles={mStyles.card}> */}
                      {/* <AddressAutocomplete keyword={keyword} onInputChange={handleAddressAutocompleteChange} onChange={handleSelectAddress} /> */}

                      <AddressForm
                        address={branch ? branch.address : {}}
                        onChange={handleAddressChange}
                      />
                      {/* </CardWidget> */}
                    </Grid>
                    <Grid item xs={12} sm={10} md={10} lg={8} xl={8}>
                      {/* <CardWidget title={t("Other Information")} styles={mStyles.card}> */}
                      <div style={mStyles.row}>
                        <MDInput
                          name="notes"
                          label={t("Notes")}
                          value={branch ? branch.notes : ""} // controlled
                          onChange={handleNotesChange}
                          // styles={{ root: { width: 500, float: "left" } }}
                          maxRows={5}
                          minRows={5}
                          multiline
                        />
                      </div>
                      {/* </CardWidget> */}
                    </Grid>
                  </Grid>
                </MDSection>
              )}
              <Grid display="flex" justifyContent="flex-end" xs={12} px={2} py={2}>
                <MDButton
                  color="secondary"
                  variant="outlined"
                  style={{ marginRight: 20 + "px" }}
                  onClick={() => navigate(-1)}
                >
                  {t("Cancel")}
                </MDButton>
                <MDButton variant="gradient" color="info" onClick={handleSubmit}>
                  {t("Save")}
                </MDButton>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
