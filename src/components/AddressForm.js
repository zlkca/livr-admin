import React from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "@mui/material";
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
const cities = [
  { id: "Ajax", label: "Ajax" },
  { id: "Amherstburg", label: "Amherstburg" },
  { id: "Arnprior", label: "Arnprior" },
  { id: "Atikokan", label: "Atikokan" },
  { id: "Aurora", label: "Aurora" },
  { id: "Aylmer", label: "Aylmer" },
  { id: "Bancroft", label: "Bancroft" },
  { id: "Blind River", label: "Blind River" },
  { id: "Bracebridge", label: "Bracebridge" },
  {
    id: "Bradford West Gwillimbury",
    label: "Bradford West Gwillimbury",
  },
  { id: "Brampton", label: "Brampton" },
  { id: "Brantford", label: "Brantford" },
  { id: "Bruce Mines", label: "Bruce Mines" },
  { id: "Burlington", label: "Burlington" },
  { id: "Caledon", label: "Caledon" },
  { id: "Carleton Place", label: "Carleton Place" },
  { id: "Cobalt", label: "Cobalt" },
  { id: "Cobourg", label: "Cobourg" },
  { id: "Cochrane", label: "Cochrane" },
  { id: "Collingwood", label: "Collingwood" },
  { id: "Deep River", label: "Deep River" },
  { id: "Deseronto", label: "Deseronto" },
  { id: "East Gwillimbury", label: "East Gwillimbury" },
  { id: "Englehart", label: "Englehart" },
  { id: "Erin", label: "Erin" },
  { id: "Espanola", label: "Espanola" },
  { id: "Essex", label: "Essex" },
  { id: "Fort Erie", label: "Fort Erie" },
  { id: "Fort Frances", label: "Fort Frances" },
  { id: "Gananoque", label: "Gananoque" },
  { id: "Georgina", label: "Georgina" },
  { id: "Goderich", label: "Goderich" },
  { id: "Gore Bay", label: "Gore Bay" },
  { id: "Grand Valley", label: "Grand Valley" },
  { id: "Gravenhurst", label: "Gravenhurst" },
  { id: "Greater Napanee", label: "Greater Napanee" },
  { id: "Grimsby", label: "Grimsby" },
  { id: "Guelph", label: "Guelph" },
  { id: "Halton Hills", label: "Halton Hills" },
  { id: "Hamilton", label: "Hamilton" },
  { id: "Hanover", label: "Hanover" },
  { id: "Hawkesbury", label: "Hawkesbury" },
  { id: "Hearst", label: "Hearst" },
  { id: "Huntsville", label: "Huntsville" },
  { id: "Ingersoll", label: "Ingersoll" },
  { id: "Innisfil", label: "Innisfil" },
  { id: "Iroquois Falls", label: "Iroquois Falls" },
  { id: "Kapuskasing", label: "Kapuskasing" },
  { id: "Kearney", label: "Kearney" },
  { id: "Kingsville", label: "Kingsville" },
  { id: "Kirkland Lake", label: "Kirkland Lake" },
  { id: "Kitchener", label: "Kitchener" },
  { id: "LaSalle", label: "LaSalle" },
  { id: "Lakeshore", label: "Lakeshore" },
  { id: "Latchford", label: "Latchford" },
  { id: "Laurentian Hills", label: "Laurentian Hills" },
  { id: "Lincoln", label: "Lincoln" },
  { id: "Lindsay", label: "Lindsay" },
  { id: "London", label: "London" },
  { id: "Marathon", label: "Marathon" },
  { id: "Markham", label: "Markham" },
  { id: "Mattawa", label: "Mattawa" },
  { id: "Midland", label: "Midland" },
  { id: "Milton", label: "Milton" },
  { id: "Minto", label: "Minto" },
  { id: "Mississauga", label: "Mississauga" },
  { id: "Mississippi Mills", label: "Mississippi Mills" },
  { id: "Mono", label: "Mono" },
  { id: "Moosonee", label: "Moosonee" },
  { id: "New Tecumseth", label: "New Tecumseth" },
  { id: "Newmarket", label: "Newmarket" },
  { id: "Niagara Falls", label: "Niagara Falls" },
  { id: "Niagara-on-the-Lake", label: "Niagara-on-the-Lake" },
  { id: "North York", label: "North York" },
  { id: "Oakville", label: "Oakville" },
  { id: "Orangeville", label: "Orangeville" },
  { id: "Oshawa", label: "Oshawa" },
  { id: "Parry Sound", label: "Parry Sound" },
  { id: "Pelham", label: "Pelham" },
  { id: "Penetanguishene", label: "Penetanguishene" },
  { id: "Perth", label: "Perth" },
  { id: "Petawawa", label: "Petawawa" },
  { id: "Petrolia", label: "Petrolia" },
  { id: "Pickering", label: "Pickering" },
  { id: "Plympton-Wyoming", label: "Plympton-Wyoming" },
  { id: "Prescott", label: "Prescott" },
  { id: "Rainy River", label: "Rainy River" },
  { id: "Renfrew", label: "Renfrew" },
  { id: "Richmond Hill", label: "Richmond Hill" },
  { id: "Saugeen Shores", label: "Saugeen Shores" },
  { id: "Scarborough", label: "Scarborough" },
  { id: "Shelburne", label: "Shelburne" },
  { id: "Smiths Falls", label: "Smiths Falls" },
  { id: "Smooth Rock Falls", label: "Smooth Rock Falls" },
  { id: "South Bruce Peninsula", label: "South Bruce Peninsula" },
  { id: "Spanish", label: "Spanish" },
  { id: "St. Catharines", label: "St. Catharines" },
  { id: "St. Marys", label: "St. Marys" },
  { id: "Tecumseh", label: "Tecumseh" },
  { id: "The Blue Mountains", label: "The Blue Mountains" },
  { id: "Thessalon", label: "Thessalon" },
  { id: "Tillsonburg", label: "Tillsonburg" },
  { id: "Toronto", label: "Toronto" },
  { id: "Vaughan", label: "Vaughan" },
  { id: "Wasaga Beach", label: "Wasaga Beach" },
  { id: "Waterloo", label: "Waterloo" },
  { id: "Whitby", label: "Whitby" },
];

export default function AddressForm({ address, onChange, readOnly }) {
  const { t } = useTranslation();

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
      <Grid container xs={12} display="flex" pt={2} spacing={2}>
        <Grid item xs={6} md={3}>
          <MDInput
            readOnly={readOnly}
            name="unitNumber"
            label={t("Unit Number")}
            type="text"
            value={address ? address.unitNumber : ""} // controlled
            onChange={handleUnitNumberChange}
            styles={{ root: mStyles.formControl }}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <MDInput
            readOnly={readOnly}
            name="streetNumber"
            label={`${t("Street Number")}*`}
            type="text"
            value={address ? address.streetNumber : ""} // controlled
            onChange={handleStreetNumberChange}
            styles={{ root: mStyles.formControl }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <MDInput
            readOnly={readOnly}
            name="streetName"
            label={`${t("Street Name")}*`}
            type="text"
            value={address ? address.streetName : ""} // controlled
            onChange={handleStreetNameChange}
            styles={{ formControl: { width: "100%", float: "left" } }}
          />
        </Grid>
      </Grid>

      <Grid container xs={12} display="flex" pt={2} spacing={2}>
        <Grid item xs={12} md={3}>
          <MDSelect
            readOnly={readOnly}
            name="city"
            label={t("City")}
            value={address ? address.city : ""} // controlled
            options={cities}
            onChange={handleCityChange} // (event, child) => { }
            styles={{ root: mStyles.formControl }}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <MDSelect
            readOnly={readOnly}
            name="province"
            label={t("Province")}
            value={address ? address.province : ""} // controlled
            options={states}
            onChange={handleProvinceChange} // (event, child) => { }
            styles={{ root: mStyles.formControl }}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <MDSelect
            readOnly={readOnly}
            name="country"
            label={t("Country")}
            value={address ? address.country : ""} // controlled
            options={countries}
            onChange={handleCountryChange} // (event, child) => { }
            styles={{ root: mStyles.formControl }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <MDInput
            readOnly={readOnly}
            name="postcode"
            label={t("Postal Code")}
            type="text"
            value={address ? address.postcode : ""} // controlled
            onChange={handlePostcodeChange}
            styles={{ root: mStyles.formControl }}
          />
        </Grid>
      </Grid>
    </div>
  );
}
