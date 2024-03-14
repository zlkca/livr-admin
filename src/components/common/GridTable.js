import React, { memo } from "react";
import { Box } from "@mui/material";
import { DataGrid, GridLogicOperator, GridToolbarQuickFilter } from "@mui/x-data-grid";
// import { AgGridReact } from 'ag-grid-react';

// import 'ag-grid-community/dist/styles/ag-grid.css';
// import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

// import { deepMerge } from "../../utils";

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
    //    <div className="ag-theme-alpine" style={mStyles.root}>
    //        <AgGridReact
    //            rowData={data}
    //            columnDefs={columns}
    //            rowSelection='single'
    //             onSelectionChanged={onSelect}
    //         >
    //        </AgGridReact>
    //    </div>
    // <Box sx={mStyles.root}>
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
      // checkboxSelection={checkboxSelection}
      // disableSelectionOnClick={disableSelectionOnClick}
      // pageSize={nRows}
      // rowsPerPageOptions={[nRows]}
      pagination={{ paginationModel: { pageSize: nRows } }}
      experimentalFeatures={{ newEditingApi: true }}
      onRowClick={handleRowClick}
      getRowClassName={getRowClassName}
      getRowId={getRowId ? getRowId : (it) => it._id}
      // sortModel={sortModel}
      // autoHeight={true}
      // sx={{
      //   // boxShadow: 2,
      //   // border: 2,
      //   // borderColor: "primary.light",
      //   // "& .MuiDataGrid-cell:hover": {
      //   //   color: "primary.main",
      //   // },
      // }}
    />
    // </Box>
  );
});
