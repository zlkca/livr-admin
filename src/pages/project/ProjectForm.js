import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, Checkbox, FormControlLabel, FormGroup, Grid } from "@mui/material";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";
import { accountAPI } from "services/accountAPI";
import { selectSignedInUser } from "redux/auth/auth.selector";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import AddressForm from "components/AddressForm";
import { projectAPI } from "services/projectAPI";
import { selectProject } from "redux/project/project.selector";
import { setProject } from "redux/project/project.slice";
import { setSnackbar } from "redux/ui/ui.slice";
import { isAdmin } from "permission";
import CardHead from "components/CardHead";
import MDSection from "components/MDSection";
import { setClient } from "redux/account/account.slice";
import AccountSelectBackdrop from "components/account/AccountSelectBackdrop";
import { getAccountsQuery } from "permission";
import { selectBranch } from "redux/branch/branch.selector";
import { getClientsQuery } from "permission";
import { SalesRoles } from "permission";
import { isEmployee } from "permission";
import { getEmployeesQueryByRoles } from "permission";

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

export default function ProjectForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  // const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [error, setError] = useState({});
  const [backdrop, setBackdrop] = useState({ opened: false });
  const [data, setData] = useState({
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
  const [accounts, setAccounts] = useState([]);
  const [selectedClient, setSelectedClient] = useState();
  const [sameAddress, setSameAddress] = useState();

  const signedInUser = useSelector(selectSignedInUser);
  const project = useSelector(selectProject);
  const branch = useSelector(selectBranch);

  useEffect(() => {
    if (project) {
      setData({ ...project });
      setSelectedClient(project.client);
    } else {
      if (params && params.id) {
        // what if id === new ??
        if (!project) {
          // refetch if page refreshed
          projectAPI.fetchProject(params.id).then((r) => {
            if (r.status === 200) {
              setData({ ...r.data });
              setSelectedClient(r.data.client);
            }
          });
        }
      }
    }
  }, [project]);

  const validate = (d) => {
    if (!d.sales) {
      alert(t("Please select a sales"));
      return false;
    }
    if (!d.client) {
      alert(t("Please select a client"));
      return false;
    }
    if (!d.address || !d.address.streetName) {
      alert(t("Address is required"));
      return false;
    }
    return true;
  };

  const handleSameAddrCheckboxChange = (event) => {
    const newV = !sameAddress;
    setSameAddress(newV);

    if (newV) {
      if (selectedClient) {
        setData({
          ...data,
          address: { ...selectedClient.address },
        });
      }
    } else {
      setData({
        ...data,
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
    }
  };

  const handleSelectAccount = (account) => {
    if (account && isEmployee(account)) {
      const sales = account;
      setData({
        ...data,
        branch: sales.branch,
        sales: {
          _id: sales._id,
          username: sales.username,
          email: sales.email,
          phone: sales.phone,
        },
      });
      setError({ ...error, sales: "" });
    }

    if (account && account.roles.includes("client")) {
      const client = account;
      setSelectedClient(account);
      // dispatch(setClient(client));
      setData({
        ...data,
        client: {
          _id: client._id,
          username: client.username,
          email: client.email,
          phone: client.phone,
          branch: client.branch,
        },
      });
      setError({ ...error, client: "" });
    }
  };
  const handleSubmit = () => {
    const d = {
      ...data,
    };

    if (!d.client) {
      setError({ client: "Please select a client" });
      return;
    }
    if (!d.sales) {
      setError({ sales: "Please select a sales" });
      return;
    }

    if (d._id) {
      projectAPI.updateProject(d._id, d).then((r) => {
        if (r.status === 200) {
          dispatch(setProject(r.data));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t("Updated Successfully!"),
              open: true,
            })
          );
          navigate("/projects");
        }
      });
    } else {
      projectAPI
        .createProject({
          ...d,
          creator: {
            _id: signedInUser._id,
            username: signedInUser.username,
          },
        })
        .then((r) => {
          if (r.status === 200) {
            dispatch(setProject(r.data));
            dispatch(
              setSnackbar({
                color: "success",
                icon: "check",
                title: "",
                content: t("Created Successfully!"),
                open: true,
              })
            );
            navigate("/projects");
          }
        });
    }
  };

  const handleNotesChange = (event) => {
    const a = { ...data, notes: event.target.value };
    setData(a);
  };

  const handleAddressChange = (obj) => {
    setData({
      ...data,
      address: { ...data.address, ...obj },
    });
  };

  // type --- 'sales', 'client'
  const handleOpenBackdrop = (type) => {
    const q =
      type === "client"
        ? getClientsQuery(signedInUser, branch ? branch._id : "")
        : getEmployeesQueryByRoles(signedInUser, branch ? branch._id : "", SalesRoles);

    accountAPI.searchAccounts(q).then((r) => {
      const d = r.status === 200 ? r.data : [];
      setAccounts(d);

      let account;
      if (type === "client") {
        account = data.client;
      } else if (type === "sales") {
        account = data.sales;
      }
      setBackdrop({ opened: true, type, account });
    });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHead title={data._id ? t("Edit Project") : t("Create Project")} />

              {1 && (
                <MDSection title={t("Basic Info")}>
                  <Grid item xs={12} sm={10} md={10} lg={8} xl={8}>
                    <MDBox display="flex" alignItems="center" mb={0.5} ml={0}>
                      <MDBox width="80%" ml={0.5}>
                        <MDTypography variant="button" fontWeight="regular" color="text">
                          {`Project #: ${data ? data.id : ""}`}
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                  </Grid>
                  <Grid item xs={12} sm={10} md={10} lg={8} xl={8}>
                    <MDInput
                      readOnly
                      label={t("Client")}
                      value={data && data.client ? data.client.username : ""}
                      onClick={() => handleOpenBackdrop("client")}
                      style={{ marginTop: 30 }}
                      helperText={error && error.client ? error.client : ""}
                    />
                  </Grid>
                  <Grid container xs={12} spacing={2} display={"flex"}>
                    <Grid item xs={3}>
                      <MDInput
                        readOnly
                        label={t("Sales")}
                        value={data && data.sales ? data.sales.username : ""}
                        onClick={() => handleOpenBackdrop("sales")}
                        style={{ marginTop: 30 }}
                        helperText={error && error.sales ? error.sales : ""}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <MDInput
                        readOnly
                        label={t("Branch")}
                        style={{ marginTop: 30 }}
                        value={data.branch ? data.branch.name : ""}
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12} sm={10} md={10} lg={8} xl={8}>
                    <div style={mStyles.row}>
                      <MDInput
                        name="notes"
                        label={t("Notes")}
                        value={data ? data.notes : ""} // controlled
                        onChange={handleNotesChange}
                        // styles={{ root: { width: 500, float: "left" } }}
                        maxRows={5}
                        minRows={5}
                        multiline
                      />
                    </div>
                  </Grid>
                </MDSection>
              )}
              {data && (
                <MDSection title={t("Address")}>
                  {data && !data._id && (
                    <Grid item xs={12} sm={10} md={10} lg={8} xl={8} pt={2}>
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={sameAddress}
                              onChange={handleSameAddrCheckboxChange}
                              inputProps={{ "aria-label": "controlled" }}
                            />
                          }
                          label={t("Same as Client's Home Address")}
                        />
                      </FormGroup>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={10} md={10} lg={8} xl={8}>
                    <AddressForm
                      address={data ? data.address : {}}
                      onChange={handleAddressChange}
                    />
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

      <AccountSelectBackdrop
        accounts={accounts}
        open={backdrop.opened}
        selected={backdrop.account}
        type={backdrop.type}
        onCancel={() => {
          setBackdrop({ opened: false });
        }}
        onChoose={handleSelectAccount}
      />
      <Footer />
    </DashboardLayout>
  );
}
