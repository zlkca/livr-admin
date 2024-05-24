export const BrandName = "demo"; // lowercase

export const CfgMap = {
  demo: {
    dbClusterId: "ibi2llw781",
  },
  shutterlux: {
    dbClusterId: "12pqq5anfh",
  },
};

export const env = "dev";
export const Cfg = CfgMap[BrandName.toLowerCase()];
export const S3_Bucket = `https://${BrandName}-uploads.s3.amazonaws.com`;
