import React from "react";
import { useTranslation } from "react-i18next";
import MDInput from "./MDInput";
import MDSelect from "./MDSelect";

// import Select from "../common/Select";
// import Input from "../common/Input";

const mStyles = {
  root: {
    width: "100%",
  },
  row: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    marginTop: 20,
  },
  col: {
    width: 250,
    marginRight: 40,
  },
  shortCol: {
    width: 150,
    marginRight: 40,
  },
  longCol: {
    width: 440,
    marginRight: 40,
  },
  formControl: {
    width: "100%",
    marginBottom: 15,
  },
};

export default function AddressForm({ address, onChange, readOnly }) {
  const { t } = useTranslation();

  const cities = [
    { id: "Toronto", label: "Toronto" },
    { id: "North York", label: "North York" },
    { id: "Scarborough", label: "Scarborough" },
    { id: "Vaughan", label: "Vaughan" },
    { id: "Markham", label: "Markham" },
    { id: "Richmond Hill", label: "Richmond Hill" },
    { id: "Whitchurch-Stouffville", label: "Whitchurch-Stouffville" },
    { id: "Newmarket", label: "Newmarket" },
    { id: "Aurora", label: "Aurora" },

    { id: "Mississauga", label: "Mississauga" },
    { id: "Brampton", label: "Brampton" },
    { id: "Oakville", label: "Oakville" },
    { id: "Burlington", label: "Burlington" },
    { id: "Milton", label: "Milton" },

    { id: "Pickering", label: "Pickering" },
    { id: "Ajax", label: "Ajax" },
    { id: "Oshawa", label: "Oshawa" },
    { id: "Whitby", label: "Whitby" },

    { id: "Hamilton", label: "Hamilton" },
    { id: "London", label: "London" },
    { id: "Kitchener", label: "Kitchener" },
    { id: "Waterloo", label: "Waterloo" },
    { id: "Guelph", label: "Guelph" },

    { id: "Brantford", label: "Brantford" },
    { id: "St. Catharines", label: "St. Catharines" },
    { id: "Niagara-on-the-Lake", label: "Niagara-on-the-Lake" },
    { id: "Niagara Falls", label: "Niagara Falls" },
  ];
  const states = [{ id: "ON", label: "Ontario" }];
  const countries = [
    { id: "CA", label: "Canada" },
    { id: "US", label: "USA" },
  ];

  const handleUnitNumberChange = (event) => {
    onChange({ unitNumber: event.target.value });
  };

  const handleStreetNumberChange = (event) => {
    onChange({ streetNumber: event.target.value });
  };

  const handleStreetNameChange = (event) => {
    onChange({ streetName: event.target.value });
  };

  const handleCityChange = (event) => {
    onChange({ city: event.target.value });
  };

  const handleProvinceChange = (event) => {
    onChange({ province: event.target.value });
  };

  const handleCountryChange = (event) => {
    onChange({ country: event.target.value });
  };

  const handlePostcodeChange = (event) => {
    onChange({ postcode: event.target.value });
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={mStyles.row}>
        <div style={mStyles.shortCol}>
          <MDInput
            readOnly={readOnly}
            name="unitNumber"
            label={t("Unit Number")}
            type="text"
            value={address ? address.unitNumber : ""} // controlled
            onChange={handleUnitNumberChange}
            styles={{ root: mStyles.formControl }}
          />
        </div>
        <div style={mStyles.shortCol}>
          <MDInput
            readOnly={readOnly}
            name="streetNumber"
            label={t("Street Number")}
            type="text"
            value={address ? address.streetNumber : ""} // controlled
            onChange={handleStreetNumberChange}
            styles={{ root: mStyles.formControl }}
          />
        </div>
        <div style={mStyles.longCol}>
          <MDInput
            readOnly={readOnly}
            name="streetName"
            label={t("Street Name")}
            type="text"
            value={address ? address.streetName : ""} // controlled
            onChange={handleStreetNameChange}
            styles={{ formControl: { width: "100%", float: "left" } }}
          />
        </div>
      </div>

      <div style={mStyles.row}>
        <div style={mStyles.col}>
          <MDSelect
            readOnly={readOnly}
            name="city"
            label={t("City")}
            value={address ? address.city : ""} // controlled
            options={cities}
            onChange={handleCityChange} // (event, child) => { }
            styles={{ root: mStyles.formControl }}
          />
        </div>
        <div style={mStyles.shortCol}>
          <MDSelect
            readOnly={readOnly}
            name="province"
            label={t("Province")}
            value={address ? address.province : ""} // controlled
            options={states}
            onChange={handleProvinceChange} // (event, child) => { }
            styles={{ root: mStyles.formControl }}
          />
        </div>
        <div style={mStyles.shortCol}>
          <MDSelect
            readOnly={readOnly}
            name="country"
            label={t("Country")}
            value={address ? address.country : ""} // controlled
            options={countries}
            onChange={handleCountryChange} // (event, child) => { }
            styles={{ root: mStyles.formControl }}
          />
        </div>

        <div style={mStyles.shortCol}>
          <MDInput
            readOnly={readOnly}
            name="postcode"
            label={t("Postal Code")}
            type="text"
            value={address ? address.postcode : ""} // controlled
            onChange={handlePostcodeChange}
            styles={{ root: mStyles.formControl }}
          />
        </div>
      </div>
    </div>
  );
}
