const baseStyles = {
  root: {
    width: "100%",
    height: "60px",
    paddingBottom: 14,
  },
  title: {
    width: "100%",
    fontSize: "14px",
    fontWeight: 300,
    color: "#545b66",
    textAlign: "left",
  },
  value: {
    width: "100%",
    fontSize: "14px",
    fontWeight: 400,
    color: "#161919",
    textAlign: "left",
  },
};

export default function Field({ title, value, styles }) {
  const mStyles = styles
    ? {
        root: {
          ...baseStyles.root,
          ...styles.root,
        },
        title: {
          ...baseStyles.title,
          ...styles.title,
        },
        value: {
          ...baseStyles.value,
          ...styles.value,
        },
      }
    : baseStyles;

  return (
    <div style={mStyles.root}>
      <div style={mStyles.title}>{title}</div>
      <div style={mStyles.value}>{value}</div>
    </div>
  );
}
