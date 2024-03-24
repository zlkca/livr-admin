import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

// import Input from "./common/Input";
import Select from "./common/Select";
import RadioGroupWidget from "./common/RadioGroup";
import SelectWidget from "./common/Select";
import MDInput from "./MDInput";
// import { getRoleOptions } from "utils";
import MDSelect from "./MDSelect";
import MDBox from "./MDBox";
import { sourceOptions } from "const";

// import { selectRoles } from "../redux/role/role.selector";

const mStyles = {
  root: { width: "100%", flex: "0 0 100%", padding: "0px 0px" },
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
    width: 400,
    marginRight: 20,
  },
  smallCol: {
    width: 200,
  },
};

export default function ProfileForm({
  signedInUser,
  mode,
  profile, // {id, firstName, middleName, lastName}
  type,
  error,
  onFieldChange,
}) {
  const { t } = useTranslation();
  const [roles, setRoles] = useState([]);

  const languages = [
    { id: "English", label: "English" },
    { id: "French", label: "French" },
    { id: "Mandarin", label: "Mandarin" },
    { id: "Cantonese", label: "Cantonese" },
  ];

  const bestTimeToCallOptions = [
    { id: "morning", label: "Morning (8am - 12am)" },
    { id: "afternoon", label: "Afternoon (12am - 5pm)" },
    { id: "evening", label: "Evening (After 5pm)" },
    { id: "other", label: "Other" },
  ];

  const titleOptions = [
    { id: "Mr", label: "Mr", value: "Mr" },
    { id: "Mrs", label: "Mrs", value: "Mrs" },
    { id: "Miss", label: "Miss", value: "Miss" },
    { id: "Ms", label: "Ms", value: "Ms" },
    { id: "Dr", label: "Dr", value: "Dr" },
  ];

  const preferredContactOptions = [
    { id: "phone", label: "Phone", value: "phone" },
    { id: "email", label: "Email", value: "email" },
  ];

  const industryOptions = [
    { id: "Interior designer", label: "Interior designer" },
    { id: "Architecture firm", label: "Architecture firm" },
    { id: "Property developer", label: "Property developer" },
    { id: "Contractor", label: "Contractor" },
    { id: "Real estate broker", label: "Real estate broker" },
    { id: "Wholesale/Buyer/Retailer", label: "Wholesale/Buyer/Retailer" },
    { id: "Other", label: "Other" },
  ];

  const getRoleOptions = (role) => {
    if (role === "partner") {
      return [{ id: "client", label: t("Client") }];
    } else if (role === "root") {
      return [
        { id: "admin", label: t("Admin") },
        { id: "store manager", label: t("Store Manager") },
        // { id: "partner", label: "Partner" },
        { id: "sales", label: t("Sales") },
        { id: "technician", label: t("Technician") },
        // { id: "engineer", label: "Engineer" },
        // { id: "accountant", label: "Accountant" },
        // {id:"temp", label: "Temp"}
      ];
    } else if (role === "admin") {
      return [
        // { id: "client", label: t("Client") },
        { id: "store manager", label: t("Store Manager") },
        { id: "sales", label: t("Sales") },
        { id: "technician", label: t("Technician") },
        // { id: "engineer", label: "Engineer" },
        // { id: "accountant", label: "Accountant" },
        // {id:"temp", label: "Temp"}
      ];
    } else if (role === "store manager") {
      return [
        // { id: "client", label: t("Client") },
        // { id: "partner", label: "Partner" },
        { id: "sales", label: t("Sales") },
        { id: "technician", label: t("Technician") },
        // { id: "engineer", label: "Engineer" },
        // { id: "accountant", label: "Accountant" },
      ];
    } else if (role === "sales" || role === "technician" || role === "engineer") {
      return [
        // { id: "client", label: t("Client") },
        // { id: "partner", label: "Partner" },
        { id: "sales", label: t("Sales") },
        { id: "technician", label: t("Technician") },
        // { id: "engineer", label: "Engineer" },
      ];
    } else {
      return [{ id: "client", label: t("Client") }];
    }
  };

  useEffect(() => {
    if (signedInUser) {
      const rs = getRoleOptions(signedInUser.role);
      setRoles(rs);
    }
  }, [signedInUser]);

  const handleRoleChange = (event) => {
    const role = event.target.value;
    onFieldChange({ ...profile, role });
  };

  const handleSourceChange = (event) => {
    const source = sourceOptions.find((r) => r.id === event.target.value);
    onFieldChange({ ...profile, source: source.id });
  };
  const handleIndustryChange = (event) => {
    const industry = industryOptions.find((r) => r.id === event.target.value);
    onFieldChange({ ...profile, industry: industry.id });
  };
  const handleCompanyChange = (event) => {
    onFieldChange({ ...profile, company: event.target.value });
  };

  const handleWebsiteChange = (event) => {
    onFieldChange({ ...profile, website: event.target.value });
  };

  const handleLanguageChange = (event) => {
    const language = languages.find((r) => r.id === event.target.value);
    onFieldChange({ ...profile, language: language.id });
  };

  const handleBestTimeToCallChange = (event) => {
    const bestTimeToCall = bestTimeToCallOptions.find((r) => r.id === event.target.value);
    onFieldChange({ ...profile, bestTimeToCall: bestTimeToCall.id });
  };

  const handleEmailChange = (event) => {
    onFieldChange({ ...profile, email: event.target.value });
  };

  const handlePhoneChange = (event) => {
    onFieldChange({ ...profile, phone: event.target.value });
  };

  const handleUsernameChange = (event) => {
    onFieldChange({ ...profile, username: event.target.value });
  };

  const handlePasswordChange = (event) => {
    onFieldChange({ ...profile, password: event.target.value });
  };

  const handleEmployeeIdChange = (event) => {
    onFieldChange({ ...profile, employeeId: event.target.value });
  };

  const handleFirstNameChange = (event) => {
    onFieldChange({ ...profile, firstName: event.target.value });
  };

  const handleMiddleNameChange = (event) => {
    onFieldChange({ ...profile, middleName: event.target.value });
  };

  const handleLastNameChange = (event) => {
    onFieldChange({ ...profile, lastName: event.target.value });
  };

  const handleTitleChange = (e) => {
    onFieldChange({ ...profile, title: e.target.value });
  };

  const handlePreferredContactChange = (e) => {
    onFieldChange({ ...profile, preferredContact: e.target.value });
  };

  return (
    <div style={mStyles.root}>
      <div style={{ width: "100%", flex: "0 0 100%" }}>
        {type === "client" && (
          <div style={mStyles.row}>
            <RadioGroupWidget
              label={t("Title.")}
              horizontal={true}
              options={titleOptions}
              value={profile.title}
              onChange={handleTitleChange}
            />
          </div>
        )}
        <div style={mStyles.row}>
          <div style={mStyles.col}>
            <MDInput
              style={{ width: 400 }}
              name="firstName"
              label={t("First Name")}
              value={profile.firstName}
              onChange={handleFirstNameChange}
              helperText={error && error.firstName ? error.firstName : ""}
              FormHelperTextProps={error && error.firstName ? { error: true } : null}
            />
          </div>
          <div style={mStyles.col}>
            <MDInput
              name="middleName"
              label={t("Middle Name")}
              value={profile.middleName}
              onChange={handleMiddleNameChange}
            />
          </div>
          <div style={mStyles.col}>
            <MDInput
              name="lastName"
              label={t("Last Name")}
              value={profile.lastName}
              onChange={handleLastNameChange}
              helperText={error && error.lastName ? error.lastName : ""}
              FormHelperTextProps={error && error.lastName ? { error: true } : null}
            />
          </div>
        </div>

        <div style={mStyles.row}>
          {signedInUser && profile && (
            <div style={mStyles.col}>
              <MDSelect
                readOnly={signedInUser.role === "partner" || signedInUser.role === "client"}
                name="role"
                label={t("Role")}
                value={profile.role} // controlled
                options={roles}
                onChange={handleRoleChange}
              />
            </div>
          )}

          {type === "employee" && (
            <div style={mStyles.col}>
              <MDInput
                name="employeeId"
                label={t("Employee Id")}
                value={profile && profile.employeeId ? profile.employeeId : ""} // controlled
                onChange={handleEmployeeIdChange}
                helperText={error && error.employeeId ? error.employeeId : ""}
                FormHelperTextProps={error && error.employeeId ? { error: true } : null}
              />
            </div>
          )}
        </div>

        <div style={mStyles.row}>
          <div style={mStyles.col}>
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
          </div>
          <div style={mStyles.col}>
            <MDInput
              name="phone"
              label={t("Phone")}
              type="phone"
              value={profile.phone}
              onChange={handlePhoneChange}
              helperText={error && error.phone ? error.phone : ""}
              FormHelperTextProps={error && error.phone ? { error: true } : null}
            />
          </div>

          {type === "client" && (
            <div style={mStyles.col}>
              <MDSelect
                name="bestTimeToCall"
                label={t("Best Time to Call")}
                value={profile && profile.bestTimeToCall ? profile.bestTimeToCall : ""} // controlled
                options={bestTimeToCallOptions}
                onChange={handleBestTimeToCallChange}
              />
            </div>
          )}
        </div>

        {type === "client" && (
          <div style={mStyles.row}>
            <RadioGroupWidget
              label={t("Preferred Contact")}
              horizontal={true}
              options={preferredContactOptions}
              value={profile.preferredContact}
              onChange={handlePreferredContactChange}
            />
          </div>
        )}

        <div style={mStyles.row}>
          <div style={mStyles.col}>
            <MDInput
              name="username"
              label={t("Username")}
              value={profile.username}
              onChange={handleUsernameChange}
            />
          </div>
        </div>

        <div style={mStyles.row}>
          {type === "client" && (
            <div style={mStyles.col}>
              {languages && languages.length > 0 && (
                <MDSelect
                  name="language"
                  label={t("Language")}
                  value={profile && profile.language ? profile.language : ""} // controlled
                  options={languages}
                  onChange={handleLanguageChange}
                />
              )}
            </div>
          )}
          {(type === "client" || type === "partner") && (
            <div style={mStyles.col}>
              <MDSelect
                name="source"
                label={t("Source")}
                value={profile && profile.source ? profile.source : ""} // controlled
                options={sourceOptions}
                onChange={handleSourceChange}
              />
            </div>
          )}
          {type === "partner" && (
            <div style={mStyles.col}>
              <MDSelect
                name="industry"
                label={t("Industry")}
                value={profile && profile.industry ? profile.industry : ""} // controlled
                options={industryOptions}
                onChange={handleIndustryChange}
              />
            </div>
          )}
        </div>

        {signedInUser && signedInUser.role === "partner" && (
          <div style={mStyles.row}>
            <div style={mStyles.col}>
              <MDInput
                name="company"
                label={t("Company")}
                type="text"
                value={profile && profile.company ? profile.company : ""} // controlled
                onChange={handleCompanyChange}
                styles={{ formControl: { width: "80%", float: "left" } }}
              />
            </div>

            <div style={mStyles.col}>
              <MDInput
                name="website"
                label={t("Website")}
                type="text"
                value={profile && profile.website ? profile.website : ""} // controlled
                onChange={handleWebsiteChange}
                styles={{ formControl: { width: "80%", float: "left" } }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
