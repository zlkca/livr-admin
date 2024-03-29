import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CheckboxGroup, Checkbox } from "rsuite";
import { Card, Grid } from "@mui/material";

import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";

import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDSelect from "components/MDSelect";
import MDInput from "components/MDInput";
import MDSection from "components/MDSection";
import MDTypography from "components/MDTypography";

import { selectClient } from "redux/account/account.selector";
import { accountAPI } from "services/accountAPI";
import { setClient } from "redux/account/account.slice";
import { selectSignedInUser } from "redux/auth/auth.selector";
import { branchAPI } from "services/branchAPI";
import { setBranches } from "redux/branch/branch.slice";
import { selectBranches } from "redux/branch/branch.selector";
import { setSnackbar } from "redux/ui/ui.slice";

import AddressForm from "components/AddressForm";
import { isAdmin } from "permission";
import CardHead from "components/CardHead";
import { BrandName } from "config";
import AccountSelectBackdrop from "components/account/AccountSelectBackdrop";
import { getEmployeesQueryByRole } from "permission";
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

export default function ClientForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const sourceOptions = [
    { id: "Home Shows", label: t("Home Shows"), value: "Home Shows" },
    { id: "HomeStars", label: "HomeStars", value: "HomeStars" },
    { id: "Referral", label: t("Referral"), value: "Referral" },
    { id: "Lawn Signs", label: t("Lawn Signs"), value: "Lawn Signs" },
    { id: "Flyers", label: t("Flyers"), value: "Flyers" },
    { id: "Google", label: "Google", value: "Google" },
    { id: "Facebook", label: "Facebook", value: "Facebook" },
    { id: "Instagram", label: "Instagram", value: "Instagram" },
    { id: "Pinterest", label: "Pinterest", value: "Pinterest" },
    { id: "Youtube", label: "Youtube", value: "Youtube" },
    { id: "TikTok", label: "TikTok", value: "TikTok" },
    { id: "Kijiji", label: "Kijiji", value: "Kijiji" },
    { id: "51.ca", label: "51.ca", value: "51.ca" },
    { id: "Yorkbbs", label: "Yorkbbs", value: "Yorkbbs" },
    {
      id: "XiaoHongShu",
      label: t("Little Red Book"),
      value: "XiaoHongShu",
    },
    {
      id: `${BrandName} Web`,
      label: `${BrandName} Website`,
      value: `${BrandName} Web`,
    },
    {
      id: "Other Social Media",
      label: t("Other Social Media"),
      value: "Other Social Media",
    },
    { id: "Radio", label: t("Radio"), value: "Radio" },
    { id: "Walk in", label: t("Walk in"), value: "Walk in" },
    { id: "Contractor", label: t("Contractor"), value: "Contractor" },
    { id: "Other", label: t("Other"), value: "Other" },
  ];
  const languages = [
    { id: "english", label: t("English") },
    { id: "french", label: t("French") },
    { id: "mandarin", label: t("Mandarin") },
    { id: "cantonese", label: t("Cantonese") },
  ];

  const bestTimeToCallOptions = [
    { id: "morning", label: t("Morning (8am - 12am)") },
    { id: "afternoon", label: t("Afternoon (12am - 5pm)") },
    { id: "evening", label: t("Evening (After 5pm)") },
    { id: "other", label: t("Other") },
  ];

  const titleOptions = [
    { id: "Mr", label: "Mr", value: "Mr" },
    { id: "Mrs", label: "Mrs", value: "Mrs" },
    { id: "Miss", label: "Miss", value: "Miss" },
    { id: "Ms", label: "Ms", value: "Ms" },
    { id: "Dr", label: "Dr", value: "Dr" },
  ];

  const preferredContactOptions = [
    { id: "none", label: t("N/A"), value: "none" },
    { id: "phone", label: t("Phone"), value: "phone" },
    { id: "email", label: t("Email"), value: "email" },
  ];

  const [backdrop, setBackdrop] = useState({ opened: false });
  const [error, setError] = useState({});
  const [profile, setProfile] = useState({
    role: "client",
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
  const [branchOptions, setBranchOptions] = useState();

  const signedInUser = useSelector(selectSignedInUser);
  const client = useSelector(selectClient);
  const branches = useSelector(selectBranches);
  const branch = useSelector(selectBranch);

  useEffect(() => {
    branchAPI.fetchBranches().then((r1) => {
      if (r1.status === 200) {
        dispatch(setBranches(r1.data));
        setBranchOptions(r1.data.map((it) => ({ id: it._id, label: it.name })));
      }
    });
  }, []);

  useEffect(() => {
    if (client) {
      setProfile({ ...client });
    } else {
      if (params && params.id) {
        if (!client) {
          // refetch if page refreshed
          accountAPI.fetchAccount(params.id).then((r) => {
            if (r.status === 200) {
              setProfile({ ...r.data });
            }
          });
        }
      }
    }
  }, [client]);

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

  const handleSourceChange = (event) => {
    const source = sourceOptions.find((r) => r.id === event.target.value);
    setProfile({ ...profile, source: source.id });
  };

  const handleToggleLanguages = (v) => {
    setProfile({ ...profile, languages: v });
  };

  const handleBestTimeToCallChange = (event) => {
    const bestTimeToCall = bestTimeToCallOptions.find((r) => r.id === event.target.value);
    setProfile({ ...profile, bestTimeToCall: bestTimeToCall.id });
  };

  const handleEmailChange = (event) => {
    setProfile({ ...profile, email: event.target.value });
  };

  const handlePhoneChange = (event) => {
    setProfile({ ...profile, phone: event.target.value });
  };

  const handleUsernameChange = (event) => {
    setProfile({ ...profile, username: event.target.value });
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

  const handleTitleChange = (event) => {
    const t = titleOptions.find((r) => r.id === event.target.value);
    setProfile({ ...profile, title: t.id });
  };

  const handlePreferredContactChange = (event) => {
    const t = preferredContactOptions.find((r) => r.id === event.target.value);
    setProfile({ ...profile, preferredContact: t.id });
  };

  const handleBranchChange = (event) => {
    const b = branches.find((r) => r._id === event.target.value);
    const v = { _id: b._id, name: b.name, displayAddress: b.displayAddress };
    setProfile({ ...profile, branch: v });
  };

  const handleAddressChange = (obj) => {
    setProfile({
      ...profile,
      address: { ...profile.address, ...obj },
    });
    // setError();
  };

  const handleSelectAccount = (account) => {
    if (account && ["sales", "store manager", "admin"].includes(account.role)) {
      const sales = account;
      setProfile({
        ...profile,
        branch: sales.branch,
        sales: {
          _id: sales._id,
          username: sales.username,
          email: sales.email,
          phone: sales.phone,
          branch: sales.branch,
        },
      });
      setError({ ...error, sales: "" });
    }
  };

  const handleSubmit = () => {
    profile.role = "client";

    if (!isAdmin(signedInUser)) {
      profile.sales = {
        _id: signedInUser._id,
        username: signedInUser.username,
        email: signedInUser.email,
      };
    }

    if (profile._id) {
      accountAPI.updateAccount(profile._id, profile).then((r) => {
        if (r.status === 200) {
          dispatch(setClient(r.data));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t("Updated Successfully!"),
              open: true,
            })
          );
          navigate("/clients");
        }
      });
    } else {
      accountAPI.createAccount(profile).then((r) => {
        if (r.status === 200) {
          dispatch(setClient(r.data));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t("Created Successfully!"),
              open: true,
            })
          );
          navigate("/clients");
        }
      });
    }
  };

  const handleOpenBackdrop = (role) => {
    const q = getEmployeesQueryByRole(signedInUser, branch ? branch._id : "", "sales");

    accountAPI.searchAccounts(q).then((r) => {
      const d = r.status === 200 ? r.data : [];
      setAccounts(d);
      setBackdrop({ opened: true, role, account: profile.sales });
    });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {profile && (
              <Card>
                <CardHead title={profile._id ? t("Edit Client") : t("Create Client")} />
                <MDSection title={t("Profile")}>
                  <Grid container xs={12} display="flex" pt={2} spacing={2}>
                    <Grid item xs={3}>
                      <MDInput
                        name="username"
                        label={t("Username")}
                        value={profile.username}
                        onChange={handleUsernameChange}
                      />
                    </Grid>
                  </Grid>
                  <Grid container xs={12} display="flex" pt={2} spacing={2}>
                    <Grid item xs={3}>
                      <MDSelect
                        label={t("Title.")}
                        options={titleOptions}
                        value={profile && profile.title ? profile.title : ""}
                        onChange={handleTitleChange}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <MDInput
                        name="firstName"
                        label={t("First Name")}
                        value={profile.firstName}
                        onChange={handleFirstNameChange}
                        helperText={error && error.firstName ? error.firstName : ""}
                        FormHelperTextProps={error && error.firstName ? { error: true } : null}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <MDInput
                        name="middleName"
                        label={t("Middle Name")}
                        value={profile.middleName}
                        onChange={handleMiddleNameChange}
                      />
                    </Grid>
                    <Grid item xs={3}>
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
                    <Grid item xs={3}>
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
                    <Grid item xs={3}>
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
                    <Grid item xs={12}>
                      <MDTypography variant="caption" color="text" fontWeight="regular">
                        {t("Language")}
                      </MDTypography>
                      <CheckboxGroup
                        inline
                        name="checkbox-group"
                        value={profile.languages}
                        onChange={handleToggleLanguages}
                      >
                        <Checkbox value="english" style={{ marginRight: 40, fontSize: 15 }}>
                          {t("English")}
                        </Checkbox>
                        <Checkbox value="french" style={{ marginRight: 40, fontSize: 15 }}>
                          {t("French")}
                        </Checkbox>
                        <Checkbox value="mandarin" style={{ marginRight: 40, fontSize: 15 }}>
                          {t("Mandarin")}
                        </Checkbox>
                        <Checkbox value="cantonese" style={{ marginRight: 40, fontSize: 15 }}>
                          {t("Cantonese")}
                        </Checkbox>
                      </CheckboxGroup>
                    </Grid>
                  </Grid>
                  <Grid container xs={12} display="flex" pt={2} spacing={2}>
                    <Grid item xs={3}>
                      <MDSelect
                        name="source"
                        label={t("Source")}
                        value={profile && profile.source ? profile.source : ""} // controlled
                        options={sourceOptions}
                        onChange={handleSourceChange}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <MDSelect
                        name="bestTimeToCall"
                        label={t("Best Time to Call")}
                        value={profile && profile.bestTimeToCall ? profile.bestTimeToCall : ""} // controlled
                        options={bestTimeToCallOptions}
                        onChange={handleBestTimeToCallChange}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <MDSelect
                        label={t("Preferred Contact")}
                        options={preferredContactOptions}
                        value={profile && profile.preferredContact ? profile.preferredContact : ""}
                        onChange={handlePreferredContactChange}
                      />
                    </Grid>
                  </Grid>
                </MDSection>
                <MDSection title={t("Home Address")}>
                  <Grid item xs={12} sm={10} md={10} lg={8} xl={8}>
                    <AddressForm
                      address={profile ? profile.address : {}}
                      onChange={handleAddressChange}
                    />
                  </Grid>
                </MDSection>
                <MDSection title={t("Belong to")}>
                  <Grid container xs={12} display="flex" spacing={2}>
                    <Grid item xs={3}>
                      <MDInput
                        readOnly
                        label={t("Sales")}
                        value={profile && profile.sales ? profile.sales.username : ""}
                        onClick={() => handleOpenBackdrop("sales")}
                        helperText={error && error.sales ? error.sales : ""}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <MDSelect
                        readOnly
                        name="branch"
                        label={t("Branch")}
                        value={profile && profile.branch ? profile.branch._id : ""} // controlled
                        options={branchOptions}
                        onChange={handleBranchChange} // (event, child) => { }
                        styles={{ root: mStyles.formControl }}
                      />
                    </Grid>
                  </Grid>

                  <Grid container display="flex" justifyContent="flex-end" xs={12} px={2} py={2}>
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
                </MDSection>
              </Card>
            )}
          </Grid>
        </Grid>
      </MDBox>
      <AccountSelectBackdrop
        accounts={accounts}
        open={backdrop.opened}
        selected={backdrop.account}
        role={backdrop.role}
        onCancel={() => {
          setBackdrop({ opened: false });
        }}
        onChoose={handleSelectAccount}
      />
      <Footer />
    </DashboardLayout>
  );
}
