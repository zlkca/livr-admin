import React, { memo } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridLogicOperator, GridToolbarQuickFilter } from "@mui/x-data-grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const baseStyles = {
  root: {
    height: "100%",
    width: "100%",
    marginTop: "10px",
    // flex: 1,
  },
};

function QuickSearchToolbar() {
  return (
    <Box
      sx={{
        p: 0.5,
        pb: 0,
      }}
    >
      <GridToolbarQuickFilter
        quickFilterParser={(searchInput) =>
          searchInput
            .split(",")
            .map((value) => value.trim())
            .filter((value) => value !== "")
        }
      />
    </Box>
  );
}
export default memo(function GridTable(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.up("xs"));

  const {
    data,
    columns,
    onRowClick,
    rowsPerPage,
    // checkboxSelection,
    // disableSelectionOnClick,
    selectedRow,
    getRowId,
    sortModel,
  } = props;

  const mStyles = baseStyles; // deepMerge(baseStyles, styles);
  const nRows = rowsPerPage ? rowsPerPage : 5;

  const handleRowClick = (param, event) => {
    onRowClick(param.row);
  };

  const getRowClassName = (params) => {
    if (getRowId) {
      const id = getRowId(selectedRow);
      if (selectedRow && id) {
        return params.id === id ? "selected" : "";
      } else {
        return "";
      }
    } else {
      if (selectedRow && selectedRow.id) {
        return params.id === selectedRow.id ? "selected" : "";
      } else {
        return "";
      }
    }
  };

  return (
    <DataGrid
      {...props}
      initialState={{
        ...data.initialState,
        filter: {
          ...data.initialState?.filter,
          filterModel: {
            items: [],
            quickFilterLogicOperator: GridLogicOperator.Or,
          },
        },
      }}
      slots={{ toolbar: QuickSearchToolbar }}
      rowHeight={42}
      rows={data}
      columns={columns}
      pagination={{ paginationModel: { pageSize: nRows } }}
      experimentalFeatures={{ newEditingApi: true }}
      onRowClick={handleRowClick}
      getRowClassName={getRowClassName}
      getRowId={getRowId ? getRowId : (it) => it._id}
    />
  );
});
