import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import MDBox from "components/MDBox";
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import { Card, Grid } from "@mui/material";
import Footer from "layouts/Footer";
import ProfileForm from "components/ProfileForm";
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

  const handleBranchChange = (event) => {
    const b = branches.find((r) => r._id === event.target.value);
    const v = { _id: b._id, name: b.name, displayAddress: b.displayAddress };
    setProfile({ ...profile, branch: v });
  };

  const handleSubmit = () => {
    if (profile._id) {
      accountAPI.updateAccount(profile._id, profile).then((r) => {
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
      });
    } else {
      accountAPI.createAccount(profile).then((r) => {
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
      });
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardHead title={employee._id ? t("Edit Employee") : t("Create Employee")} />

              <MDSection title={t("Profile")}>
                {profile && (
                  <ProfileForm
                    signedInUser={signedInUser}
                    mode={"new"}
                    type="employee"
                    profile={profile}
                    onFieldChange={handleFeildChange}
                    onSubmit={handleSubmit}
                    error={error}
                  />
                )}
              </MDSection>
              <MDSection title={t("Belong to")}>
                {profile && (
                  <Grid item xs={5}>
                    <MDSelect
                      name="branch"
                      label={t("Branch")}
                      value={profile && profile.branch ? profile.branch._id : ""} // controlled
                      options={branchOptions}
                      onChange={handleBranchChange} // (event, child) => { }
                      styles={{ root: mStyles.formControl }}
                    />
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
