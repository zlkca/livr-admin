import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDSection from "components/MDSection";
import VField from "components/VField";
import DashboardLayout from "layouts/DashboardLayout";
import DashboardNavbar from "layouts/DashboardNavbar";
import Footer from "layouts/Footer";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { selectBranch } from "redux/branch/branch.selector";
import { setBranch } from "redux/branch/branch.slice";

import { branchAPI } from "services/branchAPI";
import OrdersTab from "./OrdersTab";
import LabTabs from "components/common/Tabs";
import { TabPanel } from "@mui/lab";
import ClientsTab from "./ClientsTab";
import ProjectsTab from "./ProjectsTab";
import CardHead from "components/CardHead";
import { setEmployees } from "redux/account/account.slice";
import { setSnackbar } from "redux/ui/ui.slice";
import { setBranches } from "redux/branch/branch.slice";
import { selectBranches } from "redux/branch/branch.selector";

export default function BranchDetails() {
  const branch = useSelector(selectBranch);
  const rows = useSelector(selectBranches);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [data, setData] = useState();
  const tabs = [
    { id: "orders", label: t("Orders") },
    { id: "clients", label: t("Clients") },
    { id: "projects", label: t("Projects") },
    // { id: ClientDetailsTabId.Appointment, label: t("Employee") },
    // { id: "6", label: t("Quote") },
  ];
  const [tab, setTab] = useState({ id: "orders" });
  const handleTabChange = (e, id) => {
    setTab({ id });
  };

  useEffect(() => {
    if (branch) {
      setData({ ...branch });
    } else {
      if (params && params.id) {
        // what if id === new ??
        if (!branch) {
          // refetch if page refreshed
          branchAPI.fetchBranch(params.id).then((r) => {
            if (r.status === 200) {
              setData({ ...r.data });
            }
          });
        }
      }
    }
  }, [branch]);

  const handleEdit = () => {
    if (branch) {
      const _id = branch._id;
      branchAPI.fetchBranch(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setBranch(r.data));
          navigate(`/branches/${_id}/form`);
        }
      });
    }
  };

  const handleDelete = () => {
    if (branch) {
      const _id = branch._id;
      branchAPI.deleteBranch(_id).then((r) => {
        if (r.status === 200) {
          dispatch(setBranches(rows.filter((it) => it._id !== r.data._id)));
          dispatch(
            setSnackbar({
              color: "success",
              icon: "check",
              title: "",
              content: t(t("Deleted Successfully!")),
              open: true,
            })
          );
          navigate("/branches");
        }
      });
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox pt={1} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            {data && (
              <Card>
                <CardHead title={t("Branches")}>
                  <Grid container spacing={2} direction="row" justifyContent="flex-end">
                    <Grid item>
                      <MDButton size="small" variant={"outlined"} onClick={handleEdit}>
                        {t("Edit")}
                      </MDButton>
                    </Grid>
                    <Grid item>
                      <MDButton size="small" variant={"outlined"} onClick={handleDelete}>
                        {t("Delete")}
                      </MDButton>
                    </Grid>
                  </Grid>
                </CardHead>
                {/* title={t("Basic Info")} */}
                <MDSection>
                  <Grid display="flex">
                    <VField label={t("Name")} value={data.name} />
                    <VField label={t("Address")} value={data.displayAddress} />
                    <VField label={t("Notes")} value={data.notes} />
                  </Grid>
                </MDSection>
                {/* title={t("Details")} */}
                <MDSection>
                  <LabTabs tabs={tabs} id={tab.id} onChange={handleTabChange}>
                    <TabPanel value={"orders"} style={{ width: "100%" }}>
                      <OrdersTab branch={data} />
                    </TabPanel>
                    <TabPanel value={"clients"}>
                      <ClientsTab branch={data} />
                    </TabPanel>
                    <TabPanel value={"projects"}>
                      <ProjectsTab branch={data} />
                    </TabPanel>
                  </LabTabs>
                </MDSection>
                <Grid display="flex" justifyContent="flex-end" xs={12} py={2} px={2}>
                  <MDButton variant="outlined" color="secondary" onClick={() => navigate(-1)}>
                    {t("Back")}
                  </MDButton>
                </Grid>
              </Card>
            )}
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
