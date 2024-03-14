import { useMemo } from "react";
import "chart.js/auto";
import { Bar } from "react-chartjs-2";

import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";
import ScheduleIcon from "@mui/icons-material/Schedule";

import configs from "./barChartData";
import { Box, Typography } from "@mui/material";

const mStyles = {
  title: {
    width: "100%",
    float: "left",
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: "26px",
    textAlign: "left",
  },
  description: {
    width: "100%",
    float: "left",
    fontSize: "14px",
    lineHeight: "21px",
    textAlign: "left",
  },
  updated: {
    width: "100%",
    float: "left",
    fontSize: "14px",
    textAlign: "left",
    paddingBottom: "20px",
  },
  divider: {
    marginTop: "16px",
    marginBottom: "16px",
    width: "100%",
    height: "2px",
    float: "left",
  },
};
export default function BarChartCard({ color, title, description, date, chart }) {
  const { data, options } = configs(chart.labels || [], chart.datasets || {});

  return (
    <Card sx={{ height: "100%" }}>
      <Box padding="1rem">
        {useMemo(
          () => (
            <Box
              variant="gradient"
              style={{ backgroundColor: color }}
              borderRadius="lg"
              py={2}
              pr={0.5}
              mt={-5}
              height="12.5rem"
            >
              <Bar data={data} options={options} />
            </Box>
          ),
          [chart, color]
        )}
        <Box pt={3} pb={1} px={1}>
          <Typography variant="h6" textTransform="capitalize" style={mStyles.title}>
            {title}
          </Typography>
          <Typography
            component="div"
            variant="button"
            color="text"
            fontWeight="light"
            style={mStyles.description}
          >
            {description}
          </Typography>
          <Divider style={mStyles.divider} />
          <Box display="flex" alignItems="center" style={mStyles.updated}>
            <Typography variant="button" color="text" lineHeight={1} sx={{ mt: 0.15, mr: 0.5 }}>
              <Icon>
                <ScheduleIcon />
              </Icon>
            </Typography>
            <Typography variant="button" color="text" fontWeight="light">
              {date}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}
