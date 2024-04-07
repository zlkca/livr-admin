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
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import Cookies from "js-cookie";
import { authAPI } from "services/authAPI";
import { JWT_COOKIE } from "const";
import { setTokenId } from "redux/auth/auth.slice";
import { setSignedInUser } from "redux/auth/auth.slice";
import { ACCOUNT_COOKIE } from "const";
import { branchAPI } from "services/branchAPI";
import { setBranches } from "redux/branch/branch.slice";
import { setLayout } from "redux/ui/ui.slice";
import { isAdmin } from "permission";
import { setBranch } from "redux/branch/branch.slice";
import { BrandName } from "config";

export default function SignIn() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [credential, setCredential] = useState({});
  const [error, setError] = useState();

  useEffect(() => {
    dispatch(setLayout("auth"));
  }, []);

  const handleSubmit = () => {
    let cred = credential;
    if (BrandName === "demo" && !credential.email && !credential.password) {
      cred = { email: "test@gmail.com", password: "123456" };
    }
    authAPI.login(cred).then((r) => {
      if (r && r.status === 200) {
        const data = r.data;
        Cookies.set(JWT_COOKIE, data.token);
        Cookies.set(ACCOUNT_COOKIE, JSON.stringify(data.account));
        dispatch(setTokenId(data.token));
        dispatch(setSignedInUser(data.account));
        dispatch(setLayout("dashboard"));
        branchAPI.fetchBranches().then((r1) => {
          if (r1.status === 200) {
            dispatch(setBranches(r1.data));
          }
        });
        if (data.account.branch) {
          branchAPI.fetchBranch(data.account.branch._id).then((r2) => {
            if (r2 && r2.data) {
              dispatch(setBranch(r2.data));
            }
          });
        }
        if (isAdmin(data.account)) {
          // window.location.href = "/dashboard";
          navigate("/dashboard");
        } else {
          navigate("/clients");
          //window.location.href = "/clients";
        }
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

  const [rememberMe, setRememberMe] = useState(false);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleChangeEmail = (e) => {
    const email = e.target.value;
    setCredential({ ...credential, email });
  };

  const handleChangePassword = (e) => {
    const password = e.target.value;
    setCredential({ ...credential, password });
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            {t("Login")}
          </MDTypography>
          <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="email"
                label={t("Email")}
                fullWidth
                onChange={handleChangeEmail}
                helperText={error ? error.email : ""}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label={t("Password")}
                fullWidth
                onChange={handleChangePassword}
                helperText={error ? error.password : ""}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp; {t("Remember me")}
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton variant="gradient" color="info" fullWidth onClick={handleSubmit}>
                {t("Login")}
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                {t("Don't have an account?")}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-up"
                  variant="button"
                  color="info"
                  fontWeight="medium"
                  textGradient
                >
                  {t("Sign Up")}
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}
