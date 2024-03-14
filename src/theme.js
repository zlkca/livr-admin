import { createTheme } from "@mui/material/styles";

export default createTheme({
  palette: {
    tertiary: {
      main: "#2A5135", // '#f44336',
      light: "#ff7961",
      dark: "#ba000d",
      contrastText: "#ffffff",
    },
    background: {
      grey: "#9e9e9e",
    },
  },
  topBar: {
    height: 64,
  },
  leftNav: {
    expanded: {
      width: 240,
    },
    collapsed: {
      width: 72,
    },
  },
  content: {
    padding: "10px 40px",
  },
  card: {
    width: 1200,
    height: 700,
    maxWidth: 1400,
  },
  table: {
    height: 540,
  },
  input: {
    width: "480px",
    padding: "8px 0px",
  },
  select: {
    width: "480px",
    padding: "8px 0px",
  },
  gold: {
    main: "#A07D2D",
    dark: "#A2802D",
    light: "#D1C094",
    midLight: "#AF924C",
  },
  green: {
    light: "#6E8077",
    main: "#2A5135",
    dark: "#2C4D37",
    midLight: "#B4C5B9",
    utralLight: "#D9E1DB",
  },
  grey: {
    main: "#4d4d4d",
    light: "#a0a0a0",
  },
  faq: {
    gold: "#e3d9bf",
    green: "#e2e9e4",
  },
  h1: {
    fontFamily: "Avant Garde Book",
    fontSize: "4.452em", // '106.85px',
    // color: '#A2802D',
    fontWeight: 300,
  },
  h1a: {
    fontFamily: "Avant Garde Book",
    fontSize: "2.643em", // '63.45px',
    color: "#6E8077", // light green
    fontWeight: 300,
  },
  h2: {
    fontFamily: "Avant Garde Book",
    fontSize: "2.5em", // '60px',
    // color: '#A2802D',
    fontWeight: 300,
  },
  h2a: {
    fontFamily: "Avant Garde Book",
    fontSize: "2.4em", // '58px',
    // color: '#A2802D',
    fontWeight: 300,
  },
  h3: {
    fontFamily: "Avant Garde Book",
    fontSize: "1.667em", // '40px',
    color: "#A2802D",
    fontWeight: 300,
  },
  h4: {
    fontFamily: "Avant Garde Medium",
    fontSize: "1.25em", // 30px',
    fontWeight: 500,
    color: "#2C4D37",
  },
  h5: {
    fontFamily: "Avant Garde Book",
    fontSize: "1.167em", // '28px',
    fontWeight: 300,
  },
  h6: {
    fontFamily: "Avant Garde Book",
    fontSize: "0.833em", //'20px',
    fontWeight: 300,
  },
  body1: {
    fontFamily: "Avant Garde Book",
    fontSize: "1.083em", // '26px',
    fontWeight: 300,
    color: "#4D4D4D",
  },
  body2: {
    fontFamily: "Avant Garde Book",
    fontSize: "1em", // '24px',
    fontWeight: 300,
    color: "#4D4D4D",
  },
  body3: {
    fontFamily: "Avant Garde Book",
    fontSize: "0.916em", // '22px',
    fontWeight: 300,
    color: "#4D4D4D",
  },
  body4: {
    fontFamily: "Avant Garde Book",
    fontSize: "0.583em", // '14px',
    fontWeight: 300,
    color: "#4D4D4D",
  },
  subtitle1: {
    fontFamily: "Avant Garde Medium",
    fontSize: "1.25em", // '30px',
    weight: 500,
  },
  subtitle2: {
    fontFamily: "Avant Garde Medium",
    fontSize: "1.125em", // '27px',
    weight: 500,
  },
  subtitle3: {
    fontFamily: "Avant Garde Medium",
    fontSize: "1.083em", // '26px',
    weight: 500,
  },
  subtitle4: {
    fontFamily: "Avant Garde Medium",
    fontSize: "1em", // '24px',
    weight: 500,
  },
  title1: {
    fontFamily: "Avant Garde Bold",
    fontSize: "1.25em", // '30px',
    weight: 700,
  },
  title2: {
    fontFamily: "Avant Garde Bold",
    fontSize: "1.083em", // '26px',
    weight: 700,
    color: "#2C4D37",
  },
  title3: {
    fontFamily: "Avant Garde Bold",
    fontSize: "1em", // '24px',
    weight: 700,
  },
  title4: {
    fontFamily: "Avant Garde Bold",
    fontSize: "1em", // '24px',
    weight: 300,
  },
  iconTitle: {
    fontSize: "2.167em", // '52px',
  },
  navText: {
    fontFamily: "Avant Garde Book",
    fontSize: "0.833em", // '20px',
    color: "#2C4D37",
    weight: 300,
  },
  phoneText: {
    fontFamily: "Avant Garde Book",
    fontSize: "1.083em", // '26px',
    color: "#FFFFFF",
    weight: 300,
  },
});
