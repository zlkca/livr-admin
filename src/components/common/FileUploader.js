import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { upload } from "../../services/upload";
import Button from "../common/Button";
import ImageGrid from "../common/ImageGrid";

const mStyles = {
  root: {
    height: "16rem",
    width: "28rem",
    maxWidth: "100%",
    border: "1px dashed #666",
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    display: "none",
  },
  area: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px dashed #cbd5e1",
    backgroundColor: "#f8fafc",
  },
  button: {
    cursor: "pointer",
    padding: "0.25rem",
    fontSize: "1rem",
    border: "none",
    backgroundColor: "transparent",
  },
  dragElement: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "1rem",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  },
};
export default function FileUploader({ onChange }) {
  const inputRef = useRef();
  const { t } = useTranslation();

  const [files, setFiles] = useState([]);
  const [displayFiles, setDisplayFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = e.dataTransfer.files;
      onChange(files);
    }
  };

  // files --- [{originalname, size, type}]
  const handleFileChange = (e) => {
    e.preventDefault();

    if (e.target.files && e.target.files.length > 0) {
      onChange(e.target.files);
    }
  };

  return (
    <form
      style={mStyles.root}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        style={mStyles.input}
        ref={inputRef}
        multiple
        type="file"
        name="file"
        onChange={handleFileChange}
      />
      {/* {isSelected ? (
				<div>
					<p>Filename: {selectedFile.name}</p>
					<p>Filetype: {selectedFile.type}</p>
					<p>Size in bytes: {selectedFile.size}</p>
					<p>
						lastModifiedDate:{' '}
						{selectedFile.lastModifiedDate.toLocaleDateString()}
					</p>
				</div>
			) : (
				<p>Select a file to show details</p>
			)} */}
      <div>
        <p>{t("Drag and drop files here")}</p>
        <p>{t("or")}</p>
        <Button
          color="primary"
          variant="contained"
          style={mStyles.button}
          onClick={() => {
            inputRef.current.click();
          }}
        >
          {t("Select Files")}
        </Button>
      </div>
      {/* { dragActive && <div id="drag-file-element" style={mStyles.dragElement} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div> } */}
      {/* <ImageGrid items={displayFiles} /> */}
    </form>
  );
}
