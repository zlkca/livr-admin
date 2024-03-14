/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "../../layouts/CoverLayout";

// Images
import bgImage from "assets/images/bg-reset-cover.jpeg";
import { useTranslation } from "react-i18next";
import { authAPI } from "services/authAPI";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSignedInUser } from "redux/auth/auth.selector";

function Cover() {
  const { t } = useTranslation();

  const [credential, setCredential] = useState({});
  const [error, setError] = useState();

  const signedInUser = useSelector(selectSignedInUser);

  useEffect(() => {
    if (signedInUser) {
      setCredential({ ...credential, email: signedInUser.email });
    }
  }, [signedInUser]);

  const handleSubmit = () => {
    authAPI.changePassword(credential).then((r) => {
      if (r && r.status === 200) {
        window.location.href = "/dashboard";
      } else {
        if (r && r.status !== 200) {
          if (r.data) {
            const field = r.data.field;
            setError({ [field]: t(r.data.message) });
          } else {
            console.log(r);
          }
        } else {
          console.log(r);
        }
      }
    });
  };

  const handleChangeEmail = (e) => {
    const email = e.target.value;
    setCredential({ ...credential, email });
  };
  const handleChangeOldPassword = (e) => {
    const oldPassword = e.target.value;
    setCredential({ ...credential, oldPassword });
  };
  const handleChangePassword = (e) => {
    const password = e.target.value;
    setCredential({ ...credential, password });
  };
  return (
    <CoverLayout coverHeight="50vh" image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          py={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
            {t("Change Password")}
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                value={credential ? credential.email : ""}
                onChange={handleChangeEmail}
                helperText={error ? error.email : ""}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Old password"
                fullWidth
                onChange={handleChangeOldPassword}
                helperText={error ? error.oldPassword : ""}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="New password"
                fullWidth
                onChange={handleChangePassword}
                helperText={error ? error.password : ""}
              />
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handleSubmit}>
                {t("Submit")}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
