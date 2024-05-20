import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Grid } from "@mui/material";

import Button from "components/common/Button";
import Input from "components/common/Input";
import Logo from "assets/logo.jpg";

import { feedbackAPI } from "services/feedbackAPI";
import { setHideSidenav, setMiniSidenav, setSnackbar } from "../../redux/ui/ui.slice";
import { isValidEmail } from "utils";
import { setFeedback } from "redux/feedback/feedback.slice";
import { selectSnackbar } from "redux/ui/ui.selector";
import { selectUI } from "redux/ui/ui.selector";

const newFeedback = { email: "", phone: "", notes: "" };
const styles = {
  logo: {
    icon: {
      width: "50%",
      height: "auto",
      marginLeft: 20,
    },
  },
};
export default function FeedbackForm() {
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();
  const [error, setError] = useState();
  const [feedback, setData] = useState(newFeedback);
  const [done, setDone] = useState(false);

  useEffect(() => {
    dispatch(setHideSidenav(true));
  });

  const handleFieldChange = (name, value) => {
    setData({ ...feedback, [name]: value });
    setError({ ...error, [name]: "" });
  };

  const validate = async (d) => {
    let hasError = false;
    if (!d.email) {
      setError({ ...error, email: "Please input an email address" });
      hasError = true;
      return hasError;
    } else if (d.email && !isValidEmail(d.email)) {
      setError({ ...error, email: "Please input a valid email address" });
      hasError = true;
      return hasError;
    }

    if (!d.phone) {
      setError({ ...error, phone: "Please input a phone number" });
      hasError = true;
      return hasError;
    }
    return true;
  };

  const handleSubmit = async () => {
    const d = { ...feedback, source: searchParams.get("source") };
    const bPass = await validate(d);
    if (bPass) {
      const r = await feedbackAPI.createFeedback(d);
      if (r.status === 200) {
        dispatch(setFeedback(r.data));
        setDone(true);
      }
    }
  };

  return (
    <Grid
      container
      xs={12}
      pt={3}
      display="flex"
      justifyContent="center"
      //   alignItems="center"
      style={{ backgroundColor: "white", height: "100%" }}
    >
      {!done ? (
        <Grid item md={6}>
          <Grid container display="flex" pt={2} pb={5} px={2} spacing={2}>
            <img style={styles.logo.icon} src={Logo} alt="logo" />
          </Grid>

          <Grid container display="flex" pt={2} px={2} spacing={2}>
            <Grid item xs={12} md={6}>
              <Input
                label="Email*"
                value={feedback.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                helperText={error ? error.email : ""}
                FormHelperTextProps={error && error.email ? { error: true } : null}
              />
            </Grid>
          </Grid>
          <Grid container display="flex" pt={2} px={2} spacing={2}>
            <Grid item xs={12} md={6}>
              <Input
                label="Phone"
                value={feedback.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                helperText={error ? error.phone : ""}
                FormHelperTextProps={error && error.phone ? { error: true } : null}
              />
            </Grid>
          </Grid>
          <Grid container display="flex" pt={2} px={2} spacing={2}>
            <Grid item xs={12} md={12}>
              <Input
                label="Notes"
                placeholder="Let us know what we can help."
                value={feedback.notes}
                onChange={(e) => handleFieldChange("notes", e.target.value)}
                maxRows={10}
                minRows={10}
                multiline
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
          <Grid container display="flex" pt={2} px={2} spacing={2}>
            <Grid item xs={12} md={2}>
              <Button variant="contained" style={{ color: "white" }} onClick={handleSubmit}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <Grid item md={6}>
          <Grid container display="flex" pt={2} pb={5} px={2} spacing={2}>
            <img style={styles.logo.icon} src={Logo} alt="logo" />
          </Grid>
          <Grid container display="flex" pt={2} px={2} spacing={2}>
            <Grid item xs={12} md={12}>
              Thank you for reaching out to ShutterLux. We have successfully received your message
              and will get back to you shortly!
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
}
