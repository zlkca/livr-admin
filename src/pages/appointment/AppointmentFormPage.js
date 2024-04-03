import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, Checkbox, FormControlLabel, FormGroup, Grid } from "@mui/material";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";

import { setAppointment } from "redux/appointment/appointment.slice";
import { selectSignedInUser } from "redux/auth/auth.selector";
import ProjectSelectBackdrop from "components/project/ProjectSelectBackdrop";
import { appointmentAPI } from "services/appointmentAPI";
import { selectAppointment } from "redux/appointment/appointment.selector";
import { projectAPI } from "services/projectAPI";
import AppointmentForm from "components/appointment/AppointmentForm";
import { setSnackbar } from "redux/ui/ui.slice";
import MDSection from "components/MDSection";
import CardHead from "components/CardHead";
import AddressForm from "components/AddressForm";
import { getItemsQuery } from "permission";
import { selectBranch } from "redux/branch/branch.selector";

const mStyles = {
  root: {
    width: "100%",
  },
  formControl: {
    width: "100%",
    marginBottom: 15,
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

export default function AppointmentFormPage() {
  const { t } = useTranslation();

  // appointment
  const [data, setData] = useState({
    project: null,
    client: null,
    employee: null,
    type: "",
    notes: "",
    start: "",
    end: "",
    creator: null,
  });
  const [sameAddress, setSameAddress] = useState();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [backdrop, setBackdrop] = useState({ opened: false });
  // const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [error, setError] = useState({});
  const [projects, setProjects] = useState([]);
  const signedInUser = useSelector(selectSignedInUser);
  const appointment = useSelector(selectAppointment);
  const branch = useSelector(selectBranch);

  useEffect(() => {
    if (appointment) {
      setData({
        ...appointment,
        timeRange: [new Date(appointment.start), new Date(appointment.end)],
      });
    } else {
      if (params && params.id) {
        if (!appointment) {
          // refetch if page refreshed
          appointmentAPI.fetchAppointment(params.id).then((r) => {
            if (r.status === 200) {
              setData({ ...r.data, timeRange: [new Date(r.data.start), new Date(r.data.end)] });
            }
          });
        }
      }
    }
  }, [appointment]);

  const validate = (mode) => {
    const errs = {};
    if (!data.firstName) {
      errs["firstName"] = "Please enter your first name";
    }
    if (!data.lastName) {
      errs["lastName"] = "Please enter your last name";
    }
    if (!data.email) {
      errs["email"] = "Please enter your email";
    } else if (!isValidEmail(data.email)) {
      errs["email"] = "Invalid email format";
    }
    if (!data.phone) {
      errs["phone"] = "Please enter your phone number";
    }

    // if (mode === "new" && !data.account.password) {
    //   errs["password"] = "Please enter your password";
    // }
    return errs;
  };

  const handleAddressChange = (obj) => {
    setData({
      ...data,
      address: { ...data.address, ...obj },
    });
  };

  const handleSameAddrCheckboxChange = (event) => {
    const newV = !sameAddress;
    setSameAddress(newV);

    if (newV) {
      // if (data) {
      //   setData({
      //     ...data,
      //     address: { ...data.address },
      //   });
      // }
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
  const handleOpenBackdrop = () => {
    const q = getItemsQuery(signedInUser, branch ? branch._id : "");
    projectAPI.searchProjects(q).then((r) => {
      setProjects(r.data);
      const p = data.project ? r.data.find((it) => it._id === data.project._id) : null;
      setBackdrop({ opened: true, project: p });
    });
  };

  const handleSubmit = () => {
    if (!data.id) {
      setError({ project: "Please select a project" });
      return;
    }
    if (!data.type) {
      setError({ type: "Please select a type" });
      return;
    }
    if (!data.start) {
      setError({ timeRange: "Please select start and end date time" });
      return;
    }
    if (!data.end) {
      setError({ timeRange: "Please select start and end date time" });
      return;
    }
    if (data._id) {
      appointmentAPI.updateAppointment(data._id, data).then((r) => {
        if (r.status === 200) {
          dispatch(setAppointment(r.data));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t(t("Updated Successfully!")),
              open: true,
            })
          );
          navigate("/appointments");
        }
      });
    } else {
      const doc = {
        ...data,
        creator: {
          _id: signedInUser._id,
          username: signedInUser.username,
          email: signedInUser.email,
        },
      };
      appointmentAPI.createAppointment(doc).then((r) => {
        if (r.status === 200) {
          dispatch(setAppointment(r.data));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t("Created Successfully!"),
              open: true,
            })
          );
          navigate("/appointments");
        }
      });
    }
  };

  const handleSelectProject = (project) => {
    if (project) {
      setData({
        ...data,
        id: project.id,
        project: { _id: project._id },
        address: project.address,
        client: project.client,
        // employee: data.type === "measure" ? project.sales : project.technician,
      });
      setError({ ...error, project: "" });
    }
  };

  const handleAppointmentChange = (v, field) => {
    setData(v);
    setError({ ...error, [field]: "" });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Card>
          <CardHead title={data._id ? t("Edit Appointment") : t("Create Appointment")} />
          {data && (
            <MDSection>
              <Grid container xs={12} spacing={2}>
                <Grid item xs={3}>
                  <MDInput
                    readOnly
                    name="project"
                    label={t("Order #")}
                    value={data && data.id ? data.id : ""}
                    onClick={() => handleOpenBackdrop()}
                    helperText={error && error.project ? error.project : ""}
                  />
                </Grid>
              </Grid>
              <Grid container xs={12} spacing={2}>
                {/* {data && !data._id && (
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
                )} */}
                <Grid item xs={12} sm={10} md={10} lg={8} xl={8}>
                  <AddressForm
                    readOnly={true}
                    address={data ? data.address : {}}
                    onChange={handleAddressChange}
                  />
                </Grid>
              </Grid>

              {data.client && (
                <Grid container xs={12} spacing={2} style={{ marginTop: 25 + "px" }}>
                  <Grid item xs={3}>
                    <MDInput
                      readOnly
                      label={t("Client")}
                      value={data.client ? data.client.username : ""}
                    />
                  </Grid>
                </Grid>
              )}
              <Grid container xs={12} spacing={2} style={{ marginTop: 15 }}>
                <Grid item xs={12}>
                  <AppointmentForm data={data} error={error} onChange={handleAppointmentChange} />
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
      </MDBox>
      <ProjectSelectBackdrop
        projects={projects}
        open={backdrop.opened}
        selected={backdrop.project}
        onCancel={() => {
          setBackdrop({ opened: false });
        }}
        onChoose={handleSelectProject}
      />
      <Footer />
    </DashboardLayout>
  );
}
