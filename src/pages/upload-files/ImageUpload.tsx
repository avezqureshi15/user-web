import { Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";

function ImageUpload({
  onSelectedImageCountChange,
  selectedImages,
  setSelectedImages,
  setIsPreview,
}: {
  onSelectedImageCountChange: (arg0: number) => void;
  selectedImages: File[];
  setSelectedImages: React.Dispatch<React.SetStateAction<File[]>>;
  setIsPreview: any;
}) {
  const location = useLocation();
  const images = location.state?.selectedImages || [];
  const [imageFiles, setImageFiles] = useState<File[]>(images);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const navigate = useNavigate();

  const updateSelectedImageCount = () => {
    onSelectedImageCountChange(selectedImages.length);
  };

  useEffect(() => {
    updateSelectedImageCount();
  }, [selectedImages, onSelectedImageCountChange]);

  // Define type for modelId
  const handleGenerateClick = async () => {
    setIsPreview(true);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files) as File[];
    const imageFilesArray = files.filter((file) =>
      file.type.startsWith("image/"),
    );
    setImageFiles((prevFiles) => [...prevFiles, ...imageFilesArray]);
    setSelectedImages((prevFiles) => [...prevFiles, ...imageFilesArray]);
    setIsPreview(true);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(true);
  };
  const handleCancel = () => {
    // Navigate back to the desired route
    navigate(-1);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  return (
    <>
      {imageFiles.length === 0 && (
        <div
          style={{
            width: "100%",
            height: "70vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: isDraggingOver ? "2px dashed #1976d2" : "2px dashed #ccc",
            borderRadius: "8px",
            margin: "8px",
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h5"
              style={{ marginBottom: "16px", textAlign: "center" }}
            >
              Drag and drop your images here
            </Typography>
            <Typography variant="body1" style={{ textAlign: "center" }}>
              or
            </Typography>
            <Button
              variant="contained"
              component="label"
              color="primary"
              style={{ marginTop: "16px" }}
            >
              Upload File
              <input
                type="file"
                style={{ display: "none" }}
                multiple
                accept="image/*,.heic,.heif"
                onChange={(event) => {
                  const files = event.target.files;
                  if (files) {
                    const fileList = Array.from(files) as File[];
                    setImageFiles((prevFiles) => [...prevFiles, ...fileList]);
                    setSelectedImages((prevFiles) => [
                      ...prevFiles,
                      ...fileList,
                    ]);
                    setIsPreview(true);
                  }
                }}
              />
            </Button>
          </div>
        </div>
      )}
      {imageFiles.length > 0 && (
        <>
          {/* <div
            style={{
              flex: 1,
              overflowY: "auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "10px",
              padding: "10px",
              alignItems: "start",
            }}
            onDrop={handleDrop}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => console.log("Drag left")}
          >
            {imageFiles.map((file, index) => (
              <div
                key={index}
                style={{ position: "relative", width: "100%", height: "150px" }}
                onClick={() => handleImageClick(file)}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    zIndex: "1",
                    backgroundColor: "white",
                    borderRadius: "4px",
                    padding: "0px",
                  }}
                >
                  <Checkbox
                    checked={selectedImages.some((img) => img === file)}
                    onChange={() => handleImageClick(file)}
                    onClick={(event) => event.stopPropagation()}
                    style={{
                      color: "#2E368E",
                      margin: "0px",
                      padding: "2px",
                      zIndex: "2",
                    }}
                  />
                </div>
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Uploaded ${file.name}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
            ))}
          </div> */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "10px",
            }}
          >
            <div style={{ display: "flex", width: "25vw" }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleCancel}
                style={{
                  flex: 1,
                  marginRight: "5px",
                  backgroundColor: "white",
                  padding: "8px",
                  textTransform: "none",
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateClick}
                style={{
                  flex: 1,
                  marginRight: "5px",
                  padding: "8px",
                  textTransform: "none",
                }}
              >
                Upload
              </Button>
              {/* Modal for Generate */}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ImageUpload;
