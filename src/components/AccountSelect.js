import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, Radio } from "@mui/material";
import { useTranslation } from "react-i18next";

import GridTable from "./common/GridTable";

import { accountAPI } from "../services/accountAPI";

const mStyles = {
  root: {
    width: "100%",
    height: 500,
    backgroundColor: "white",
    display: "flex",
  },
  table: { root: { width: "100%", height: 544 } },
  formControl: {
    width: "100%",
    marginBottom: 15,
  },
  row: {
    width: "100%",
    marginBottom: "8px",
  },
};

export default function AccountSelect({ accounts, selected, onSelect }) {
  const { t } = useTranslation();

  //   const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [highlightedItem, setHighlightedItem] = useState();

  const [selectedRow, setSelectedRow] = useState();

  useEffect(() => {
    if (selected) {
      setSelectedRow(selected);
    }
  }, [selected]);

  const handleRadioChange = (e, row) => {
    setSelectedRow(row);
    const account = accounts.find((it) => it._id === row._id);
    onSelect(account);
  };

  const columns = [
    {
      field: "radio",
      headerName: " ",
      width: 60,
      renderCell: (params) => (
        <Radio
          checked={selectedRow ? params.row._id === selectedRow._id : false}
          onChange={(e) => handleRadioChange(e, params.row)}
          value={params.row._id}
          name={`radio-${params.row._id}`}
        />
      ),
    },
    { headerName: t("Username"), field: "username", width: 140 },
    {
      headerName: t("Branch"),
      field: "branch",
      maxWidth: 300,
      valueGetter: (params) => (params.row?.branch ? params.row?.branch.name : t("Unassigned")),
      flex: 1,
    },
    // { headerName: t("Email"), field: "email", width: 200 },
    { headerName: t("Phone"), field: "phone", width: 140 },
    {
      headerName: t("Role"),
      field: "role",
      width: 100,
      valueGetter: (params) => (params.row?.role ? params.row?.role : t("Unknown")),
    },
  ];

  const handleHighlightRow = (row) => {
    setHighlightedItem(row);
  };

  const handleSearch = (keyword) => {
    // const q = getEmployeeRoleIdQuery(roles);
    // const q = keyword ? { roleId: role._id, keyword } : { roleId: role._id};
    // fetchAccounts(q).then((r) => {
    //   dispatch(setEmployees(r.status === 200 ? r.data : []));
    // });
  };

  return (
    <div style={mStyles.root}>
      <div style={{ width: "98%", height: 500, paddingTop: 10 }}>
        {/* <div style={mStyles.row}>
            <SearchBar onSearch={handleSearch} />
          </div> */}
        <GridTable
          autoPageSize
          data={accounts}
          columns={columns}
          onRowClick={handleHighlightRow}
          rowsPerPage={7}
          styles={mStyles.table}
          // sx={{ "--DataGrid-overlayHeight": "300px" }}
        />
      </div>

      {/* {highlightedItem && 
      <div style={{ width: "66%", paddingLeft: 10, paddingTop: 20 }}>
        <EmployeeScheduler employeeId={highlightedItem._id} />
        </div>
        } */}
    </div>
  );
}
