import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { selectBackDrop } from "../../redux/layout/layout.selector";
// import { setBackDrop } from "../../redux/layout/layout.slice";

export default function ProgressBackdrop() {
  // const dispatch = useDispatch();
  // const backDrop = useSelector(selectBackDrop);

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      // open={backDrop.show}
      // onClick={() => {
      //     dispatch(setBackDrop({show: false}));
      // }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
