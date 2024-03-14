import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDSection from "components/MDSection";
import VField from "components/VField";
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { accountAPI } from "services/accountAPI";

import { selectClient } from "redux/account/account.selector";
import { setClient } from "redux/account/account.slice";
import MDButton from "components/MDButton";
import { useEffect, useState } from "react";
import { selectSignedInUser } from "redux/auth/auth.selector";
import CardHead from "components/CardHead";
import { generateProjectNumber } from "utils";
import { setProject } from "redux/project/project.slice";

export default function ClientDetails() {
  const params = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const client = useSelector(selectClient);
  const signedInUser = useSelector(selectSignedInUser);

  const [profile, setProfile] = useState();

  const handleEdit = () => {
    if (client) {
      const _id = client._id;
      accountAPI.fetchAccount(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setClient(r.data));
          navigate(`/clients/${_id}/form`);
        }
      });
    }
  };

  const handleCreateProject = () => {
    if (client) {
      const id = generateProjectNumber();

      dispatch(
        setProject({
          id,
          client: {
            _id: client._id,
            username: client.username,
            email: client.email,
            phone: client.phone,
            address: client.address,
          },
          address: {},
          branch: signedInUser.branch,
          sales: {
            _id: signedInUser._id,
            username: signedInUser.username,
            email: signedInUser.email,
            phone: signedInUser.phone,
            branch: signedInUser.branch,
          },
        })
      );

      navigate("/projects/new/form");
    }
  };

  useEffect(() => {
    if (client) {
      setProfile({ ...client });
    } else {
      if (params && params.id) {
        if (!client) {
          accountAPI.fetchAccount(params.id).then((r) => {
            if (r.status === 200) {
              setProfile({ ...r.data });
            }
          });
        }
      }
    }
  }, [client]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {profile && (
              <Card>
                <CardHead title={t("Client")}>
                  <Grid container spacing={2} direction="row" justifyContent="flex-end">
                    <Grid item>
                      <MDButton size="small" variant={"outlined"} onClick={handleEdit}>
                        {t("Edit")}
                      </MDButton>
                    </Grid>
                    <Grid item>
                      <MDButton size="small" variant={"outlined"} onClick={handleCreateProject}>
                        {t("Create Project")}
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
                  </Grid>
                </MDSection>

                <MDSection title={t("Contact")}>
                  <Grid display="flex">
                    <VField label={t("Email")} value={profile.email} />
                    <VField label={t("Phone")} value={profile.phone} />
                    <VField label={t("Best time to call")} value={profile.bestTimeToCall} />
                    <VField label={t("Preferred Contact")} value={profile.preferredContact} />
                    <VField label={t("Address")} value={profile.displayAddress} />
                  </Grid>
                </MDSection>

                <MDSection title={t("Profile")}>
                  <Grid display="flex">
                    <VField label={t("Language")} value={profile.language} />
                    <VField label={t("Source")} value={profile.source} />
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
