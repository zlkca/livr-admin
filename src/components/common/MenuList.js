import React from "react";
import MenuItem from "./MenuItem";

// data -- - [{id, text, icon}]
export default function MenuList({ expanded, items, selectedId, onSelect, styles }) {
  // const [items, setItems] = useState([]);

  // useEffect(() => {
  //     setItems(data);
  // }, [data])

  const handleClick = (it) => {
    // const ds = [];
    // data.forEach(d => {
    //     ds.push({ ...d, selected: it.text === d.text});
    //     if(it.id === d.id){
    //         it.selected = true;
    //     }
    // });

    // setItems(ds);

    if (onSelect) {
      onSelect(it);
    }
  };

  return (
    <div style={styles.root}>
      {items &&
        items.length > 0 &&
        items.map((it) => (
          <MenuItem
            key={it.id}
            expanded={expanded}
            data={it}
            selectedId={selectedId}
            onClick={() => handleClick(it)}
          />
        ))}
    </div>
  );
}
