import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

export default function ImageGrid({ items }) {
  return (
    <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
      {items.map((item) => (
        <ImageListItem key={item.url}>
          <img
            src={item.url}
            // srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            alt={item.notes}
            loading="lazy"
            width={64}
            style={{ objectFit: "contain" }}
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
