import { env, Cfg } from "config";
import { BrandName } from "config";

export const JWT_COOKIE = `${BrandName.toLowerCase()}-backoffice-jwt`;
export const LANGUAGE_COOKIE = `${BrandName.toLowerCase()}-backoffice-lang`;
export const ACCOUNT_COOKIE = `${BrandName.toLowerCase()}-backoffice-account`;

export const RootApiUrl =
  env == "prd"
    ? `https://${Cfg.dbClusterId}.execute-api.us-east-1.amazonaws.com/dev`
    : `http://192.168.1.5:5001`;

export const googleMapApiUrl = "https://maps.googleapis.com/maps/api";
export const geoPlaceApiUrl = "https://us1.locationiq.com/v1";

export const emptyUser = { username: "", email: "", phone: "", password: "", status: "I" };
export const emptyProduct = { name: "", description: "", price: "", status: "I" };

export const StageMap = {
  "project init": 0,
  "measure appt.": 1,
  order: 2,
  deposit: 3,
  "install appt.": 4,
  paid: 5,
};

export const sourceOptions = [
  { id: "Home Shows", label: "Home Shows", value: "Home Shows" },
  { id: "HomeStars", label: "HomeStars", value: "HomeStars" },
  { id: "Referral", label: "Referral", value: "Referral" },
  { id: "Lawn Signs", label: "Lawn Signs", value: "Lawn Signs" },
  { id: "Flyers", label: "Flyers", value: "Flyers" },
  { id: "Google", label: "Google", value: "Google" },
  { id: "Facebook", label: "Facebook", value: "Facebook" },
  { id: "Instagram", label: "Instagram", value: "Instagram" },
  { id: "Pinterest", label: "Pinterest", value: "Pinterest" },
  { id: "Youtube", label: "Youtube", value: "Youtube" },
  { id: "TikTok", label: "TikTok", value: "TikTok" },
  { id: "Kijiji", label: "Kijiji", value: "Kijiji" },
  { id: "51.ca", label: "51.ca", value: "51.ca" },
  { id: "Yorkbbs", label: "Yorkbbs", value: "Yorkbbs" },
  {
    id: "XiaoHongShu",
    label: "Little Red Book",
    value: "XiaoHongShu",
  },
  {
    id: `${BrandName} Web`,
    label: `${BrandName} Website`,
    value: `${BrandName} Web`,
  },
  {
    id: "Other Social Media",
    label: "Other Social Media",
    value: "Other Social Media",
  },
  { id: "Radio", label: "Radio", value: "Radio" },
  { id: "Walk in", label: "Walk in", value: "Walk in" },
  { id: "Contractor", label: "Contractor", value: "Contractor" },
  { id: "Other", label: "Other", value: "Other" },
];

export const NavMenuId = {
  Dashboard: "dashboard@navMenu",
  Clients: "clients@navMenu",
  Projects: "projects@navMenu",
  Partners: "partners@navMenu",
  Employees: "employees@navMenu",
};

export const ClientListTabId = {
  MyClients: "my clients",
  AssignedClients: "assigned clients",
};

export const ClientDetailsTabId = {
  Profile: "profile@client",
  Project: "project@client",
  Recommender: "recommender",
  Appointment: "appointment",
};

export const PartnerDetailsTabId = {
  Profile: "profile@partner",
  Clients: "clients@partner",
};

export const EmployeeDetailsTabId = {
  Profile: "profile@employee",
  Schedule: "schedule@employee",
};

export const ProjectDetailsTabId = {
  Info: "Info",
  Assignment: "Assignment",
  Layout: "Layout",
  Invoice: "Invoice",
  Measurement: "Measurement",
  Payment: "Payment",
  Delivery: "Delivery",
};

export const MeasurementDetailsTabId = {
  Info: "info@measurement",
  Layout: "layout@measurement",
  Windows: "windows@measurement",
};

export const WindowFormTabId = {
  Data: "data@windowForm",
  Files: "files@windowForm",
};

export const DialogId = {
  Upload: "upload@dialog",
  DeleteEmployee: "deleteEmployee@dialog",
  DeleteProject: "deleteProject@dialog",
  DeleteAppointment: "deleteAppointment@dialog",
  CreatePayment: "createPayment@dialog",
  DeletePayment: "deletePayment@dialog",

  CreateMeasurement: "createMeasurement@dialog",
  DeleteMeasurement: "deleteMeasurement@dialog",
  DeleteBuilding: "deleteBuilding@dialog",
  SelectMeasurement: "selectMeasurement@dialog",

  CreateDelivery: "createDelivery@dialog",
  DeleteDelivery: "deleteDelivery@dialog",

  DeleteFloor: "deleteFloor@dialog",
  DeleteRoom: "deleteRoom@dialog",
  DeleteWindow: "deleteWindow@dialog",
  CompleteMeasurement: "completeMeasurement@dialog",
};

export const BackdropId = {
  SwitchMeasurement: "switchMeasurement@backdrop",
  LayoutNodeForm: "layoutNodeForm@backdrop",
};

export const Path = {
  Dashboard: "dashboard",
  ManageClients: "manage clients",
  ManagePartners: "manage partners",
  ManageEmployees: "manage employees",
  ManageProjects: "manage projects",

  ClientDetails: "client details",
  CreateClient: "create client",
  EditClient: "edit client",

  PartnerDetails: "partner details",
  CreatePartner: "create partner",
  EditPartner: "edit partner",
  PartnerClients: "partner clients tab",
  PartnerClientDetails: "partner client details",

  EmployeeDetails: "employee details",
  CreateEmployee: "create employee",
  EditEmployee: "edit employee",
  EmployeeClients: "employee clients tab",
  EmployeeClientDetails: "employee client details",

  ProjectDetails: "project details",
  CreateProject: "create project",
  EditProject: "edit project",

  CreatePayment: "create payment",
  EditPayment: "edit payment",

  AssignRecommender: "assign recommender",
  ProjectAssignEmployee: "project assign employee",

  CreateAppointment: "create appointment",
  AppointmentDetails: "appointment details",
  EditAppointment: "edit appointment",

  MeasurementDetails: "measurement details",

  WindowListForm: "window list form",
};

export const AppointmentType = {
  Sales: "sales",
  Installation: "installation",
  Showroom: "showroom",
};

export const AppointmentProjectMode = {
  NewProject: "new project",
  ExistingProject: "existing project",
};

export const emptyAppointment = {
  title: "",
  notes: "",
  type: AppointmentType.Sales, // [AppointmentType], default type is sales
  start: "",
  end: "",
  needNewProject: "N", // "Y" or "N"
  address: null,
  employee: null,
  client: null,
  creator: null,
};

export const emptyProject = {
  pCode: "",
  notes: "",
  address: null,
  client: null,
  sales: null,
  technician: null,
  creator: null,
};

export const emptyWindow = {
  _id: "",
  code: "",
  SKU: "",
  roomId: "",
  name: "",
  notes: "",
  width: { top: "", mid: "", bottom: "" },
  height: { left: "", mid: "", right: "" },
  type: "Normal",
  frameStyle: { top: "", right: "", bottom: "", left: "" },
  dividerRail: { unit: "inch", height: "", top: "" },
  obstacle: { unit: "inch", left: "", top: "" },
  numOfLocks: "",
  openingDirections: "",
  nPanels: "",
  mountPosition: "",
  bafflePosition: { top: "", bottom: "" },
  bladeSize: "",
  leverPosition: "",
  baseMaterial: "",
  lockers: [],
  created: "",
  updated: "",
};

export const emptyDelivery = {
  notes: "",
  projectId: "",
  clientId: "",
  employeeId: "",
  creatorId: "",
};

export const emptyPayment = {
  amount: "",
  type: "",
  method: "",
  notes: "",
  projectId: "",
  clientId: "",
  employeeId: "",
  creatorId: "",
};
