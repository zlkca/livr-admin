import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDSection from "components/MDSection";
import VField from "components/VField";
import ActionBar from "components/common/ActionBar";
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { accountAPI } from "services/accountAPI";

import { selectEmployee } from "redux/account/account.selector";
import { setEmployee } from "redux/account/account.slice";
import MDButton from "components/MDButton";
import { useEffect, useState } from "react";
import { setSnackbar } from "redux/ui/ui.slice";
import CardHead from "components/CardHead";
import { setAccounts } from "redux/account/account.slice";

export default function EmployeeDetails() {
  const { t } = useTranslation();
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const employee = useSelector(selectEmployee);
  const [profile, setProfile] = useState();

  const handleEdit = () => {
    if (employee) {
      const _id = employee._id;
      accountAPI.fetchAccount(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setEmployee(r.data));
          navigate(`/employees/${_id}/form`);
        }
      });
    }
  };

  const handleDelete = () => {
    if (employee) {
      const _id = employee._id;
      accountAPI.deleteAccount(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setAccounts(rows.filter((it) => it._id !== r.data._id)));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t(t("Deleted Successfully!")),
              open: true,
            })
          );
          navigate("/employees");
        }
      });
    }
  };

  useEffect(() => {
    if (employee) {
      setProfile({ ...employee });
    } else {
      if (params && params.id) {
        if (!employee) {
          accountAPI.fetchAccount(params.id).then((r) => {
            if (r.status === 200) {
              setProfile({ ...r.data });
            }
          });
        }
      }
    }
  }, [employee]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {profile && (
              <Card>
                <CardHead title={t("Employee")}>
                  <Grid container spacing={2} direction="row" justifyContent="flex-end">
                    <Grid item>
                      <MDButton size="small" variant={"outlined"} onClick={handleEdit}>
                        {t("Edit")}
                      </MDButton>
                    </Grid>
                  </Grid>
                </CardHead>
                <MDSection title={t("Basic Info")}>
                  <Grid display="flex">
                    <VField label={t("Username")} value={profile.username} />
                    <VField label={t("Firstname")} value={profile.firstName} />
                    <VField label={t("Lastname")} value={profile.lastName} />
                    <VField
                      label={t("Branch")}
                      value={profile.branch ? profile.branch.name : "N/A"}
                    />
                    <VField label={t("Role")} value={profile.role} />
                  </Grid>
                </MDSection>

                <MDSection title={t("Contact")}>
                  <Grid display="flex">
                    <VField label={t("Email")} value={profile.email} />
                    <VField label={t("Phone")} value={profile.phone} />
                  </Grid>
                </MDSection>

                <Grid display="flex" justifyContent="flex-end" xs={12} px={2} py={2}>
                  <MDButton variant="outlined" color="secondary" onClick={() => navigate(-1)}>
                    {t("Back")}
                  </MDButton>
                </Grid>
              </Card>
            )}
          </Grid>
        </Grid>
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}
