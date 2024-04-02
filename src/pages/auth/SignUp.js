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

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/CoverLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import { authAPI } from "services/authAPI";
import { Alert } from "@mui/material";
import MDAlert from "components/MDAlert";
import { setLayout } from "redux/ui/ui.slice";
import { useDispatch } from "react-redux";

const alertContent = (message) => (
  <MDTypography variant="body2" color="white">
    {message}
  </MDTypography>
);

export default function SignUp() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [data, setData] = useState({ roles: ["user"] });
  const [error, setError] = useState();
  const [alertMessage, setAlertMessage] = useState();

  useEffect(() => {
    dispatch(setLayout("auth"));
  }, []);

  const handleCreateAccount = () => {
    authAPI.signup(data).then((r) => {
      if (r && r.status === 200) {
        setAlertMessage("Sign up successfully, please wait your admin's approval");
      } else {
        if (r.status !== 200) {
          const field = r.data.field;
          setError({ [field]: t(r.data.message) });
        }
      }
    });
  };

  const handleChangeUsername = (e) => {
    const username = e.target.value;
    setData({ ...data, username });
  };

  const handleChangeEmail = (e) => {
    const email = e.target.value;
    setData({ ...data, email });
  };

  const handleChangePassword = (e) => {
    const password = e.target.value;
    setData({ ...data, password });
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password to register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Username"
                variant="standard"
                fullWidth
                onChange={handleChangeUsername}
                helperText={error ? error.username : ""}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                onChange={handleChangeEmail}
                helperText={error ? error.email : ""}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                variant="standard"
                fullWidth
                onChange={handleChangePassword}
                helperText={error ? error.password : ""}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;I agree the&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handleCreateAccount}>
                sign up
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
      {alertMessage && (
        <MDAlert color="primary" dismissible>
          {alertContent(alertMessage)}
        </MDAlert>
      )}
    </CoverLayout>
  );
}
