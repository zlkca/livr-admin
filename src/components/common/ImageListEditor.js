import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";

const mStyles = {
  root: {
    width: "100%",
    height: 110,
  },
  imageCell: {
    display: "inline-block",
    width: "80px",
    height: "110px",
    float: "left",
  },
  imageAdd: {
    position: "relative",
    display: "inline-block",
    width: "80px",
    height: "110px",
    float: "left",
  },
  thumbnail: {
    width: "60px",
    height: "60px",
    border: "1px solid #aaa",
  },
  buttonRow: {
    width: 80,
    height: 40,
  },
  iconButton: {
    float: "left",
    // width: 90
  },
  addIcon: {
    width: "60px",
    height: "60px",
    // position: 'absolute',
    // top: 0,
    // left: 0,
    display: "flex",
    alignItems: "center",
  },
};

export const ImageCell = ({ data, onChange, onDelete, onSelect }) => {
  const getImageSrc = (d) => {
    return d && d.src ? d.src : "";
  };

  return (
    <div style={mStyles.imageCell} onClick={() => onSelect(data)}>
      <div style={mStyles.thumbnail}>
        <img width={60} height={60} src={getImageSrc(data)} />
      </div>
      <div style={mStyles.buttonRow}>
        <IconButton
          style={mStyles.iconButton}
          aria-label="delete"
          color="primary"
          onClick={() => onDelete(data)}
        >
          <DeleteIcon />
        </IconButton>
        {/* <IconButton style={mStyles.iconButton} aria-label="edit" color="primary" onClick={() => onChange(data)}>
                    <EditIcon />
                </IconButton> */}
      </div>
    </div>
  );
};

const ImageAdd = ({ onAdd }) => {
  return (
    <div style={mStyles.imageCell}>
      <div style={mStyles.thumbnail}>
        <div style={mStyles.addIcon} onClick={() => onAdd()}>
          <IconButton aria-label="add" style={{ margin: "0 auto" }}>
            <AddIcon />
          </IconButton>
        </div>
      </div>
      <div style={mStyles.buttonRow}></div>
    </div>
  );
};

export const ImageListEditor = ({ data, onAdd, onChange, onDelete, onSelect }) => {
  return (
    <div style={mStyles.root}>
      {data &&
        data.length > 0 &&
        data.map((d) => (
          <ImageCell
            key={d._id}
            data={d}
            onChange={onChange}
            onDelete={onDelete}
            onSelect={onSelect}
          />
        ))}
      <ImageAdd key={"new"} onAdd={onAdd} />
    </div>
  );
};
