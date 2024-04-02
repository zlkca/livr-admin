import React from "react";
import { useTranslation } from "react-i18next";
import { CheckboxGroup, Checkbox } from "rsuite";

export function RoleCheckGroup({ roles, onToggle }) {
  const { t } = useTranslation();
  return (
    <CheckboxGroup inline name="role-checkbox-group" value={roles} onChange={onToggle}>
      <Checkbox value="admin" style={{ marginRight: 40, fontSize: 15 }}>
        {t("Admin")}
      </Checkbox>
      <Checkbox value="store manager" style={{ marginRight: 40, fontSize: 15 }}>
        {t("Store Manager")}
      </Checkbox>
      <Checkbox value="sales" style={{ marginRight: 40, fontSize: 15 }}>
        {t("Sales")}
      </Checkbox>
      <Checkbox value="field sales" style={{ marginRight: 40, fontSize: 15 }}>
        {t("Field Sales")}
      </Checkbox>
      <Checkbox value="technician" style={{ marginRight: 40, fontSize: 15 }}>
        {t("Technician")}
      </Checkbox>
    </CheckboxGroup>
  );
}
