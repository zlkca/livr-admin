import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import MDBox from "components/MDBox";
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import { Card, Grid } from "@mui/material";
import Footer from "layouts/Footer";
import { accountAPI } from "services/accountAPI";
import { setEmployee } from "redux/account/account.slice";
import { selectSignedInUser } from "redux/auth/auth.selector";
import MDButton from "components/MDButton";
import { selectEmployee } from "redux/account/account.selector";
import MDSelect from "components/MDSelect";
import { selectBranches } from "redux/branch/branch.selector";
import { branchAPI } from "services/branchAPI";
import { setBranches } from "redux/branch/branch.slice";
import { setSnackbar } from "redux/ui/ui.slice";
import CardHead from "components/CardHead";
import MDSection from "components/MDSection";
import MDInput from "components/MDInput";
import { RoleCheckGroup } from "components/account/RoleCheckGroup";
import { isValidEmail } from "utils";
import { authAPI } from "services/authAPI";

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

  row: {
    width: "100%",
    display: "flex",
    justifyContent: "start",
    marginTop: 20,
  },
  smallCol: {
    width: 200,
  },
};

export default function EmployeeForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const [error, setError] = useState({});
  const [profile, setProfile] = useState();
  const [branchOptions, setBranchOptions] = useState();

  const signedInUser = useSelector(selectSignedInUser);
  const employee = useSelector(selectEmployee);
  const branches = useSelector(selectBranches);

  useEffect(() => {
    branchAPI.fetchBranches().then((r1) => {
      if (r1.status === 200) {
        dispatch(setBranches(r1.data));
        setBranchOptions(r1.data.map((it) => ({ id: it._id, label: it.name })));
      }
    });
  }, []);

  useEffect(() => {
    if (employee) {
      setProfile({ ...employee });
    } else {
      if (params && params.id) {
        if (!employee) {
          // refetch if page refreshed
          branchAPI.fetchBranches().then((r) => {
            if (r.status === 200) {
              dispatch(setBranches(r.data));
            }
          });
          if (params.id !== "new") {
            accountAPI.fetchAccount(params.id).then((r) => {
              if (r.status === 200) {
                setProfile({ ...r.data });
              }
            });
          }
        }
      }
    }
  }, [employee]);

  const validate = (mode) => {
    const errs = {};
    if (!profile.firstName) {
      errs["firstName"] = "Please enter your first name";
    }
    if (!profile.lastName) {
      errs["lastName"] = "Please enter your last name";
    }
    if (!profile.email) {
      errs["email"] = "Please enter your email";
    } else if (!isValidEmail(profile.email)) {
      errs["email"] = "Invalid email format";
    }
    if (!profile.phone) {
      errs["phone"] = "Please enter your phone number";
    }

    // if (mode === "new" && !profile.account.password) {
    //   errs["password"] = "Please enter your password";
    // }
    return errs;
  };

  // if (Object.keys(errs).length > 0) {

  const handleFeildChange = (v) => {
    setProfile(v);
  };

  const handleEmailChange = (event) => {
    setProfile({ ...profile, email: event.target.value });
    setError({ ...error, email: "" });
  };

  const handlePhoneChange = (event) => {
    setProfile({ ...profile, phone: event.target.value });
  };

  const handleUsernameChange = (event) => {
    setProfile({ ...profile, username: event.target.value });
  };

  const handlePasswordChange = (event) => {
    setProfile({ ...profile, password: event.target.value });
  };

  const handleEmployeeIdChange = (event) => {
    setProfile({ ...profile, employeeId: event.target.value });
  };

  const handleFirstNameChange = (event) => {
    setProfile({ ...profile, firstName: event.target.value });
  };

  const handleMiddleNameChange = (event) => {
    setProfile({ ...profile, middleName: event.target.value });
  };

  const handleLastNameChange = (event) => {
    setProfile({ ...profile, lastName: event.target.value });
  };

  const handleBranchChange = (event) => {
    const b = branches.find((r) => r._id === event.target.value);
    const v = { _id: b._id, name: b.name, displayAddress: b.displayAddress };
    setProfile({ ...profile, branch: v });
    setError({ ...error, branch: "" });
  };

  const handleRoleToggle = (vs) => {
    setProfile({ ...profile, roles: vs });
    setError({ ...error, roles: "" });
  };

  const handleSubmit = async () => {
    if (!profile.email) {
      setError({ ...error, email: t("Please input an email address") });
      return;
    } else if (profile.email && !isValidEmail(profile.email)) {
      setError({ ...error, email: t("Please input a valid email address") });
      return;
    } else {
      const r = await authAPI.checkEmail({ email: profile.email });
      if (r.status === 200 && r.data.dup) {
        setError({ ...error, email: t("Email exists, please try another") });
        return;
      }
    }
    if (!profile.roles || profile.roles.length === 0) {
      setError({ ...error, roles: t("Please select one or multiple roles") });
      return;
    }
    if (!profile.branch) {
      setError({ ...error, branch: t("Please select a branch") });
      return;
    }
    if (profile._id) {
      const r = await accountAPI.updateAccount(profile._id, profile);
      if (r.status === 200) {
        dispatch(setEmployee(r.data));
        dispatch(
          setSnackbar({
            color: "success",
            icon: "check",
            title: "",
            content: t("Updated Successfully!"),
            open: true,
          })
        );
        navigate("/employees");
      }
    } else {
      const r = await accountAPI.createAccount(profile);
      if (r.status === 200) {
        dispatch(setEmployee(r.data));
        dispatch(
          setSnackbar({
            color: "success",
            icon: "check",
            title: "",
            content: t("Created Successfully!"),
            open: true,
          })
        );
        navigate("/employees");
      }
    }
  };
  // ProfileForm
  //   signedInUser={signedInUser}
  //   mode={"new"}
  //   type="employee"
  //   profile={profile}
  //   onFieldChange={handleFeildChange}
  //   onSubmit={handleSubmit}
  //   error={error}
  //
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHead title={employee._id ? t("Edit Employee") : t("Create Employee")} />
              {profile && (
                <MDSection title={t("Profile")}>
                  <Grid container xs={12} display="flex" pt={2} spacing={2}>
                    <Grid item xs={12}>
                      <RoleCheckGroup roles={profile.roles} onToggle={handleRoleToggle} />
                      {error && error.roles && (
                        <div style={{ color: "red", fontSize: 14 }}>
                          {t("Please select one or multiple roles")}
                        </div>
                      )}
                    </Grid>
                  </Grid>
                  <Grid container xs={12} display="flex" pt={2} spacing={2}>
                    <Grid item xs={4} sm={3}>
                      <MDInput
                        name="firstName"
                        label={t("First Name")}
                        value={profile.firstName}
                        onChange={handleFirstNameChange}
                        helperText={error && error.firstName ? error.firstName : ""}
                        FormHelperTextProps={error && error.firstName ? { error: true } : null}
                      />
                    </Grid>
                    <Grid item xs={4} sm={3}>
                      <MDInput
                        name="middleName"
                        label={t("Middle Name")}
                        value={profile.middleName}
                        onChange={handleMiddleNameChange}
                      />
                    </Grid>
                    <Grid item xs={4} sm={3}>
                      <MDInput
                        name="lastName"
                        label={t("Last Name")}
                        value={profile.lastName}
                        onChange={handleLastNameChange}
                        helperText={error && error.lastName ? error.lastName : ""}
                        FormHelperTextProps={error && error.lastName ? { error: true } : null}
                      />
                    </Grid>
                  </Grid>

                  <Grid container xs={12} display="flex" pt={2} spacing={2}>
                    {/* <Grid item xs={3}>
                      <MDInput
                        name="employeeId"
                        label={t("Employee Id")}
                        value={profile && profile.employeeId ? profile.employeeId : ""} // controlled
                        onChange={handleEmployeeIdChange}
                        helperText={error && error.employeeId ? error.employeeId : ""}
                        FormHelperTextProps={error && error.employeeId ? { error: true } : null}
                      />
                    </Grid> */}
                    <Grid item xs={12} sm={3}>
                      <MDInput
                        readOnly={profile._id}
                        name="email"
                        label={t("Email")}
                        type="email"
                        value={profile.email}
                        onChange={handleEmailChange}
                        helperText={error && error.email ? error.email : ""}
                        FormHelperTextProps={error && error.email ? { error: true } : null}
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <MDInput
                        name="phone"
                        label={t("Phone")}
                        type="phone"
                        value={profile.phone}
                        onChange={handlePhoneChange}
                        helperText={error && error.phone ? error.phone : ""}
                        FormHelperTextProps={error && error.phone ? { error: true } : null}
                      />
                    </Grid>
                  </Grid>
                  <Grid container xs={12} display="flex" pt={2} spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <MDInput
                        name="username"
                        label={t("Username")}
                        value={profile.username}
                        onChange={handleUsernameChange}
                      />
                    </Grid>
                  </Grid>
                </MDSection>
              )}
              <MDSection title={t("Belong to")}>
                {profile && (
                  <Grid item xs={12} sm={5}>
                    <MDSelect
                      name="branch"
                      label={t("Branch")}
                      value={profile && profile.branch ? profile.branch._id : ""} // controlled
                      options={branchOptions}
                      onChange={handleBranchChange} // (event, child) => { }
                      styles={{ root: mStyles.formControl }}
                    />
                    {error && error.branch && (
                      <div style={{ color: "red", fontSize: 14 }}>
                        {t("Please select a branch")}
                      </div>
                    )}
                  </Grid>
                )}
              </MDSection>
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
