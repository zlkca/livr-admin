import { createSlice } from "@reduxjs/toolkit";

export const initialProjectState = {
  project: null,
  projects: [],
  loading: false,
};

export const projectSlice = createSlice({
  name: "project",
  initialState: initialProjectState,
  reducers: {
    fetchProjects: (state) => {},
    setProjects: (state, action) => {
      state.loading = false;
      state.projects = action.payload;
    },
    fetchProject: (state) => {},
    setProject: (state, action) => {
      state.loading = false;
      state.project = action.payload;
    },
  },
});

export const { fetchProjects, setProjects, fetchProject, setProject } = projectSlice.actions;

export default projectSlice.reducer;
