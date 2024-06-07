export const BrandName = "demo"; // lowercase

const CfgMap = {
  demo: {
    dbClusterId: "ibi2llw781",
    Workflow: {
      enabled: false,
    },
    MultiStore: {
      enabled: false,
    },
    Deposit: {
      enabled: false,
    },
    Product: {
      enabled: true,
    },
    Inventory: {
      enabled: true,
    },
    Appointment: {
      enabled: false,
    },
    Feedback: {
      enabled: true,
    },
    OnlineStore: {
      enabled: true,
    },
  },
  shutterlux: {
    dbClusterId: "12pqq5anfh",
    Workflow: {
      enabled: true,
    },
    MultiStore: {
      enabled: true,
    },
    Deposit: {
      enabled: true,
    },
    Product: {
      enabled: false,
    },
    Inventory: {
      enabled: false,
    },
    Appointment: {
      enabled: true,
    },
    Feedback: {
      enabled: false,
    },
    OnlineStore: {
      enabled: false,
    },
  },
};

export const env = "dev";
export const Cfg = CfgMap[BrandName.toLowerCase()];
export const UplodsBucket = `https://${BrandName}-uploads.s3.amazonaws.com`;
