import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import { IconButton } from "@mui/material";

const mStyles = {
  root: {
    width: "100%",
    height: 110,
  },
  fileRow: {
    width: "100%",
    height: "60px",
    float: "left",
  },
  fileAddRow: {
    width: "100%",
    height: "100px",
    float: "left",
  },
  fileAdd: {
    position: "relative",
    display: "inline-block",
    width: "80px",
    height: "110px",
    float: "left",
  },
  thumbnail: {
    width: "60px",
    height: "60px",
    float: "left",
  },
  thumbnailWithBorder: {
    width: "60px",
    height: "60px",
    border: "1px solid #aaa",
  },
  fname: { float: "left", paddingTop: 15, paddingLeft: 10, fontSize: 14 },
  buttonRow: {
    width: 80,
    height: 36,
    float: "left",
    paddingTop: 5,
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

export const FileCell = ({ data, onChange, onDelete, onSelect, onDownload }) => {
  const getImageSrc = (d) => {
    return d && d.src ? d.src : "";
  };

  return (
    <div style={mStyles.fileRow} onClick={() => onSelect(data)}>
      <div style={mStyles.thumbnail}>
        {["jpg", "jpeg", "png"].includes(data.ext) ? (
          <img width={36} height={36} src={getImageSrc(data)} />
        ) : (
          <img
            width={data.ext === "pdf" ? 32 : 36}
            height={36}
            src={process.env.PUBLIC_URL + `/icons/${data.ext}.png`}
          />
        )}
      </div>
      <div style={mStyles.fname}>{data.fname}</div>
      <div style={mStyles.buttonRow}>
        <IconButton
          style={mStyles.iconButton}
          aria-label="delete"
          color="primary"
          onClick={() => onDelete(data)}
        >
          <DeleteIcon />
        </IconButton>
        <IconButton
          style={mStyles.iconButton}
          aria-label="edit"
          color="primary"
          onClick={() => onDownload(data)}
        >
          <DownloadIcon />
        </IconButton>
      </div>
    </div>
  );
};

const FileAdd = ({ onAdd }) => {
  return (
    <div style={mStyles.fileAddRow}>
      <div style={mStyles.thumbnailWithBorder}>
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

// data --- [{_id, title, fname, ext, src}] // /nul//invoice/
export const FileListEditor = ({ data, onAdd, onChange, onDelete, onSelect, onDownload }) => {
  return (
    <div style={mStyles.root}>
      <FileAdd key={"new"} onAdd={onAdd} />
      {data &&
        data.length > 0 &&
        data.map((d) => (
          <FileCell
            key={d._id}
            data={d}
            onChange={onChange}
            onDelete={onDelete}
            onSelect={onSelect}
            onDownload={onDownload}
          />
        ))}
    </div>
  );
};
