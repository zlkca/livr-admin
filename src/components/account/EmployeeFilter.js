import { FormControlLabel, FormGroup, Grid, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { appointmentAPI } from "services/appointmentAPI";
// import { Checkbox, CheckboxGroup, Grid } from "rsuite";

export function EmployeeFilter({ accounts, user, onChange }) {
  const { t } = useTranslation();
  const [types, setTypes] = useState("all");
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState([]);

  const handleToggleTypes = (values) => {
    setTypes(values);
    setSelected([]);
  };

  const handleToggleEmployee = (e) => {
    const _id = e.target.name;
    let employeeIds = [];
    if (selected.includes(_id)) {
      employeeIds = selected.filter((s) => s !== _id);
    } else {
      employeeIds = [...selected, _id];
    }
    setSelected(employeeIds);
    onChange(employeeIds);
  };

  useEffect(() => {
    if (accounts && types && types.length > 0) {
      if (types.includes("all")) {
        setCandidates(accounts);
      } else {
        setCandidates(
          accounts.filter((a) => {
            types.includes(a.role);
          })
        );
      }
    }
  }, [types]);

  return (
    <>
      {/* {user && isManager(user) && (
        <Grid>
            <FormGroup>
            {candidates.map((c) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selected && selected.includes(c._id)}
                    onChange={handleToggleEmployee}
                    name={c._id}
                  />
                }
                label={t("All")}
              />
            ))}
          </FormGroup>
          <CheckboxGroup name="checkbox-group" value={types} onChange={handleToggleTypes}>
            <Checkbox value="all" style={{ marginRight: 40, fontSize: 15 }}>
              {t("All")}
            </Checkbox>

            <Checkbox value="sales" style={{ marginRight: 40, fontSize: 15 }}>
              {t("Sales")}
            </Checkbox>
            <Checkbox value="techincian" style={{ marginRight: 40, fontSize: 15 }}>
              {t("Technician")}
            </Checkbox>
            <Checkbox value="store manager" style={{ marginRight: 40, fontSize: 15 }}>
              {t("Store Manager")}
            </Checkbox>
            {isAdmin(user) && (
              <Checkbox value="admin" style={{ marginRight: 40, fontSize: 15 }}>
                {t("Admin")}
              </Checkbox>
            )}
          </CheckboxGroup>
        </Grid>
      )} */}
      <Grid>
        {candidates && candidates.length > 0 && (
          //   <CheckboxGroup name="checkbox-group" value={selected} onChange={handleToggleEmployee}>
          //     {candidates.map((c) => (
          //       <Checkbox value={c._id}>{t(c.username)}</Checkbox>
          //     ))}
          //   </CheckboxGroup>
          // <Checkbox value={c._id}>{t(c.username)}</Checkbox>
          <FormGroup>
            {candidates.map((c) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selected && selected.includes(c._id)}
                    onChange={handleToggleEmployee}
                    name={c._id}
                  />
                }
                label={t(c.username)}
              />
            ))}
          </FormGroup>
        )}
      </Grid>
    </>
  );
}
