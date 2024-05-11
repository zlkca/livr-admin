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

export default function ProductSelect({ products, selected, onSelect }) {
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
    const p = products.find((it) => it._id === row._id);
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
      headerName: t("Name"),
      field: "name",
      width: 200,
      valueGetter: (params) => (params.row?.name ? params.row?.name : t("Unknown")),
    },
    {
      headerName: t("Address"),
      field: "address",
      width: 400,
      valueGetter: (params) => (params.row?.address ? params.row?.address : t("Unassigned")),
    },
    {
      headerName: t("Created Date"),
      field: "created",
      width: 200,
    },
  ];

  const handleHighlightRow = (row) => {
    setHighlightedItem(row);
  };

  return (
    <div style={mStyles.root}>
      {products && products.length > 0 && (
        <div style={{ width: "100%", height: 500, padding: 10 }}>
          {/* <div style={mStyles.row}>
            <SearchBar onSearch={handleSearch} />
          </div> */}
          <GridTable
            autoPageSize
            data={products}
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
