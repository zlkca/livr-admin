import React, { useState, useEffect } from "react";

export default function List({ data, onSelect, styles }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(data);
  }, [data]);

  const handleClick = (it) => {
    const ds = [];
    data.forEach((d) => {
      ds.push({ ...d, selected: it.text === d.text });
      if (it.text === d.text) {
        it.selected = true;
      }
    });

    setItems(ds);

    if (onSelect) {
      onSelect(it);
    }
  };

  return (
    <div style={styles.root}>
      {items &&
        items.length > 0 &&
        items.map((it) => (
          <div key={it.text} onClick={() => handleClick(it)}>
            {it.text}
          </div>
        ))}
    </div>
  );
}
