import { Grid } from "@mui/material";
import FileUploader from "./FileUploader";
import ImageGrid from "./ImageGrid";

// items: [{name, src}] images to display
// onUpload: (files) => {} callback for file uploader
export default function ImageUploader({ items, onFileChange }) {
  return (
    <Grid xs={12}>
      <FileUploader onChange={onFileChange} />
      {items && <ImageGrid items={items} />}
    </Grid>
  );
}
