// import {useState} from 'react';
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import theme from "theme";
// { width: "100%", typography: "body1" }
export default function LabTabs({ tabs, id, children, onChange }) {
  return (
    // <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
    <TabContext value={id}>
      <Box sx={{ borderBottom: 1, borderColor: "divider", paddingLeft: 3 }}>
        <TabList
          onChange={onChange}
          aria-label="lab API tabs example"
          sx={{
            "& .MuiTab-root.Mui-selected": { color: "white !important" },
            "& .MuiTabs-indicator": { bgcolor: "#1A73E8" },
          }}
        >
          {tabs.map((t) => (
            <Tab key={t.id} label={t.label} value={t.id} />
          ))}
        </TabList>
      </Box>
      {children}
    </TabContext>
    // </Box>
  );
}
