import * as React from "react";

const mStyles = {
  root: {
    width: 400,
    height: 80,
  },
};

// item --- { title, src }
export default function ImageThumbnails({ items, tyles }) {
  return (
    <div style={mStyles.root}>
      {items.map((item) => (
        <div key={item.src}>
          <img
            src={item.src}
            // srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
            alt={item.title}
            loading="lazy"
            width={64}
          />
        </div>
      ))}
    </div>
  );
}
