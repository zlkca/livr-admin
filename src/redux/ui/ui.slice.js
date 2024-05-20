import { createSlice } from "@reduxjs/toolkit";
// import { uiThunkReducers } from './ui.thunk.js'

export const initialUIState = {
  miniSidenav: false,
  transparentSidenav: false,
  whiteSidenav: false,
  hideSidenav: false,
  sidenavColor: "info",
  transparentNavbar: true,
  fixedNavbar: true,
  openConfigurator: false,
  direction: "ltr",
  layout: "dashboard",
  darkMode: false,
  language: "en",
  snackbar: { title: "", content: "", datetime: "", open: false },
  dialog: { open: false },
};

export const uiSlice = createSlice({
  name: "ui",
  initialState: initialUIState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setSnackbar: (state, action) => {
      state.snackbar = action.payload;
    },
    setDialog: (state, action) => {
      state.dialog = action.payload;
    },
    setMiniSidenav: (state, action) => {
      state.miniSidenav = action.payload;
    },
    setTransparentSidenav: (state, action) => {
      state.transparentSidenav = action.payload;
    },
    setWhiteSidenav: (state, action) => {
      state.whiteSidenav = action.payload;
    },
    setSidenavColor: (state, action) => {
      state.sidenavColor = action.payload;
    },
    setTransparentNavbar: (state, action) => {
      state.transparentNavbar = action.payload;
    },
    setFixedNavbar: (state, action) => {
      state.fixedNavbar = action.payload;
    },
    setOpenConfigurator: (state, action) => {
      state.openConfigurator = action.payload;
    },
    setDirection: (state, action) => {
      state.direction = action.payload;
    },
    setLayout: (state, action) => {
      state.layout = action.payload;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
    setHideSidenav: (state, action) => {
      state.hideSidenav = action.payload;
    },
  },
  // extraReducers: uiThunkReducers
});

export const {
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  setSidenavColor,
  setTransparentNavbar,
  setFixedNavbar,
  setOpenConfigurator,
  setDirection,
  setLayout,
  setDarkMode,
  setLanguage,
  setSnackbar,
  setDialog,
  setHideSidenav,
} = uiSlice.actions;

export default uiSlice.reducer;
