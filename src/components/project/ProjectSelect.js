import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Radio } from "@mui/material";
import { useTranslation } from "react-i18next";

import GridTable from "../common/GridTable";
import { getAddressString } from "../../utils";

const mStyles = {
  root: {
    width: "100%",
    backgroundColor: "white",
  },
  formControl: {
    width: "100%",
    marginBottom: 15,
  },
  row: {
    width: "100%",
    marginBottom: "8px",
  },
};

export default function ProjectSelect({ projects, selected, onSelect }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [highlightedItem, setHighlightedItem] = useState();
  const [selectedRow, setSelectedRow] = useState();

  useEffect(() => {
    if (selected) {
      setSelectedRow(selected);
    }
  }, [selected]);

  const handleRadioChange = (e, row) => {
    setSelectedRow(row);
    const p = projects.find((it) => it._id === row._id);
    onSelect(p);
  };

  const columns = [
    {
      field: "radio",
      headerName: "Confirmed",
      renderCell: (params) => (
        <Radio
          checked={selectedRow ? params.row._id === selectedRow._id : false}
          onChange={(e) => handleRadioChange(e, params.row)}
          value={params.row._id}
          name={`radio-${params.row._id}`}
        />
      ),
    },
    {
      headerName: t("Order #"),
      field: "id",
      width: 150,
    },
    {
      headerName: t("Address"),
      field: "address",
      width: 450,
      valueGetter: (params) =>
        params.row?.address ? getAddressString(params.row?.address) : t("Unassigned"),
    },
    {
      headerName: t("Client"),
      field: "client",
      width: 150,
      valueGetter: (params) => (params.row?.client ? params.row?.client.username : t("Unknown")),
    },
    {
      headerName: t("Sales"),
      field: "sales",
      width: 150,
      valueGetter: (params) => (params.row?.sales ? params.row?.sales.username : t("Unassigned")),
    },
    { headerName: t("Created Date"), field: "created", width: 200 },
  ];

  // Fetch all the projects initialization
  //   useEffect(() => {
  //     if (clientProfile) {
  //       fetchProjects({ clientId: clientProfile.account._id }).then((r) => {
  //         const projects = r.status === 200 ? r.data : [];
  //         if (projects && projects.length > 0) {
  //           setProjects(projects.map((it) => ({ ...it, id: it._id })));
  //         }
  //       });
  //     }
  //   }, [dispatch, clientProfile]);

  const handleHighlightRow = (row) => {
    setHighlightedItem(row);
  };

  const handleSearch = (keyword) => {
    // const q = getProjectRoleIdQuery(roles);
    // const q = keyword ? { roleId: role._id, keyword } : { roleId: role._id};
    // fetchAccounts(q).then((r) => {
    //   dispatch(setProjects(r.status === 200 ? r.data : []));
    // });
  };

  return (
    <div style={mStyles.root}>
      {projects && projects.length > 0 && (
        <div style={{ width: "100%", height: 500, padding: 10 }}>
          {/* <div style={mStyles.row}>
            <SearchBar onSearch={handleSearch} />
          </div> */}
          <GridTable
            autoPageSize
            data={projects}
            columns={columns}
            onRowClick={handleHighlightRow}
            rowsPerPage={7}
            styles={{ root: { width: "100%", height: 520 } }}
          />
        </div>
      )}
    </div>
  );
}
