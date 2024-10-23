import {
  Button,
  Typography,
  Grid,
  CircularProgress,
  IconButton,
  DialogActions,
  Backdrop,
  Paper,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { USDZLoader } from "three-usdz-loader";
import {
  upload3DModel,
  upload3DasDraft,
  convert3DModel,
} from "@slices/imageUploadSlice";
import { useAppDispatch } from "@hooks/redux-hooks";
// import UploadProgress from "@assets/upload-progress.gif";
import { updateProjectDetails } from "@slices/projectSlice";
import CloseIcon from "@mui/icons-material/Close";
import { default as CommonTextField } from "@components/app_textfield";
import { Images } from "@constants/imageConstants";
interface ModelUploadProps {
  setIsModelFile: React.Dispatch<React.SetStateAction<File | null>>;
}
const ModelUpload: React.FC<ModelUploadProps> = ({ setIsModelFile }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [modelFile, setModelFile] = useState<any | null>(null);
  const [modelfiles, setModelFiles] = useState<any | null>();
  const [dragOver, setDragOver] = useState<boolean>(false);
  // const containerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  // const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [modelName, setModelName] = useState("");
  const [uploadStatus, setUploadStatus] = useState("Uploading 3D Model");
  const [draftConfirmationOpen, setDraftConfirmationOpen] = useState(false);
  const [uploadDescription, setUploadDescription] = useState(
    "Keep the app open for faster upload",
  );
  const [progressShowing, setProgressShowing] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [teamMembers, setTeamMembers] = useState([
  //   "Rahul Sharma",
  //   "Rahul Kumar Srivastav",
  // ]);
  // const [newMember, setNewMember] = useState("");

  const startUpload = () => {
    setUploadProgress(30);
  };

  // const handleAddTeamMember = () => {
  //   if (newMember.trim() !== "") {
  //     setTeamMembers([...teamMembers, newMember]);
  //     setNewMember("");
  //   }
  // };

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setNewMember(event.target.value);
  // };

  // const handleInputKeyPress = (
  //   event: React.KeyboardEvent<HTMLInputElement>,
  // ) => {
  //   if (event.key === "Enter") {
  //     handleAddTeamMember();
  //   }
  // };

  // Toggle modal display
  const toggleModal = () => setModalOpen(!isModalOpen);

  // Handle change in model name
  const handleModelNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setModelName(event.target.value);
  };

  // Handle the submission of the form
  const handleSubmit = async () => {
    try {
      await dispatch(
        updateProjectDetails({ modelId: modelId || "", modelName }), // Ensure modelId is not null
      );
      toast.success("Model has been successfully saved.");
    } catch (error) {
      console.log(error);
    } finally {
      toggleModal();
      navigate("/");
    }
  };

  const showSuccessToast = () =>
    toast.success("Your model has been successfully saved as a draft.");

  const handleSave3DModelAsDraft = async () => {
    try {
      const formData = new FormData();
      formData.append("files", modelFile as File);

      const response = await dispatch<any>(upload3DasDraft(formData));

      if ((response?.meta as any)?.requestStatus === "fulfilled") {
        showSuccessToast();
      }
      navigate("/");
    } catch (error) {
      // Handle error
      console.error("Error uploading 3D models:", error);
    }
  };

  // const handleDeleteSelectedModel = () => {
  //   setDraftConfirmationOpen(false);
  //   setModelFile(null);
  // };

  // const handleProgressClick = () => {
  //   setUploadStatus("In Progress");
  // setUploadDescription("Keep the app open for faster upload");
  // };

  const [modelId, setModelId] = useState<string | null>(null); // Define type for modelId
  console.log(modelFile);

  useEffect(() => {
    const loadModel = async () => {
      if (modelFile && modelFile?.name?.toLowerCase().endsWith(".usdz")) {
        setLoading(true);
        const formData = new FormData();
        formData.append("model", modelFile);
        const response = await dispatch(convert3DModel(formData));
        setLoading(false);
        setModelFile(response?.payload?.data?.model_url);
        console.log(response?.payload?.data?.model_url);
        console.log(response);
        // setUsdz(true);
      }
    };
    loadModel();
  }, [modelFile]);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    console.log(files);
    const supportedFormats = [".glb", ".gltf", ".usdz"]; // Include USDZ in supported formats
    const modelFile = files.find((file) => {
      const fileExtension = file.name.slice(file.name.lastIndexOf("."));
      return supportedFormats.includes(fileExtension);
    });
    console.log(modelFile);
    if (modelFile) {
      setModelFile(modelFile);
    } else {
      toast.error("Only GLB, GLTF, and USDZ files are allowed.", {
        position: "bottom-center",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files) {
      const file = event.target.files[0];
      setIsModelFile(file);
      const supportedFormats = [".glb", ".gltf", ".usdz"]; // Include USDZ in supported formats
      const fileExtension = file.name.slice(file.name.lastIndexOf("."));
      setModelFiles(file);
      if (supportedFormats.includes(fileExtension)) {
        if (!file?.name?.toLowerCase().endsWith(".usdz")) {
          const blobUrl = URL.createObjectURL(file);
          setModelFile(blobUrl);
        } else {
          setModelFile(file);
        }
      } else {
        toast.error("Only GLB, GLTF, and USDZ files are allowed.", {
          position: "bottom-center",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!modelFile) {
      toast.info("Please add file(s).");
      return;
    }
    toggleModal(); // Open the modal immediately upon clicking the Generate button
    startUpload();
    let interval: any;
    try {
      setUploadProgress(0); // Start from 0%
      setProgressShowing(true);

      // Simulate progress to 95%
      let progress = 0;
      interval = setInterval(() => {
        progress += 5;
        if (progress <= 95) {
          setUploadProgress(progress);
        } else {
          clearInterval(interval);
        }
      }, 100); // Adjust the interval timing as needed

      const formData = new FormData();
      // console.log(modelFile);
      formData.append("model", modelfiles);

      const response = await dispatch(upload3DModel(formData));
      setModelId(response.payload.model_id);
      setUploadProgress(100);
      setUploadStatus("3D Model Uploaded");
      setUploadDescription("");
      toast.success("3D Model has been successfully uploaded.");
      // Simulate the final step to 100% after a small delay
      // setTimeout(() => {

      // }, 500); // Adjust the delay timing as needed
    } catch (error) {
      console.error("Error uploading 3D model:", error);
    } finally {
      clearInterval(interval);
    }
  };

  return (
    <>
      {modelFile === null && (
        <div
          style={{
            width: "100%",
            height: "50vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: dragOver ? "2px dashed #1976d2" : "2px dashed #ccc",
            borderRadius: "8px",
            margin: "8px",
          }}
          onDrop={handleDrop}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
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
              Drag and drop your files here
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
                accept=".glb,.gltf,.usdz"
                onChange={handleFileUpload}
              />
            </Button>
          </div>
        </div>
      )}
      {/* {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            zIndex: 10,
          }}
        >
          <CircularProgress />
        </div>
      )} */}

      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
            height: "100%",
          }}
        >
          <CircularProgress />
        </div>
      )}
      {modelFile && !loading && (
        <div
          style={{
            flex: 1,
            position: "relative",
            border: "2px dashed transparent",
            borderRadius: "8px",
            margin: "8px",
          }}
        >
          {/*@ts-expect-error: ''*/}
          <model-viewer
            id="transform"
            disable-tap
            src={modelFile}
            alt="Model Image"
            touch-action="pan-y"
            style={{ width: "100%", height: "600px", borderRadius: "8px" }}
            autoplay
            camera-controls
            ar
            ar-modes="webxr scene-viewer quick-look"
            quick-look-browsers="safari chrome"
            field-of-view="5deg"
          >
            {/*@ts-expect-error: ''*/}
          </model-viewer>
        </div>
      )}

      {/* {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
            height: "100%",
          }}
        >
          <CircularProgress />
        </div>
      )} */}

      {/* <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          position: "relative",
          border: "2px dashed transparent",
          borderRadius: "8px",
          margin: "8px",
          padding: "0 9rem",
        }}
      ></div> */}
      {modelFile && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "10px",
            position: "fixed",
            right: "16px",
            bottom: "16px",
          }}
        >
          <div style={{ display: "flex", width: "25vw" }}>
            <Button
              variant="contained"
              component="label"
              color="primary"
              style={{ flex: 1, marginRight: 6 }}
            >
              Re-Upload Model
              <input
                type="file"
                style={{ display: "none" }}
                accept=".glb,.gltf,.usdz"
                onChange={handleFileUpload}
              />
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{ flex: 1 }}
              onClick={handleUpload}
            >
              Upload
            </Button>
          </div>
        </div>
      )}
      <Backdrop open={isModalOpen} style={{ zIndex: 999 }}>
        <Paper
          elevation={3}
          sx={{
            width: "430px",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            borderRadius: "12px",
            padding: "24px",
            backgroundColor: "#FFF",
            color: "#000",
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => (progressShowing ? null : toggleModal)}
            sx={{
              position: "absolute",
              marginRight: "10px",
              marginTop: "15px",
              right: 8,
              top: 8,
              visibility: progressShowing ? "hidden" : "visible",
              display: "none",
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            variant="h3"
            sx={{ my: 2, fontWeight: "700", fontSize: "20px" }}
          >
            Status
          </Typography>
          <Grid
            container
            item
            sx={{
              backgroundColor: "#E0E1EE",
              borderRadius: "12px",
              padding: "12px",
              gap: "14px",
            }}
            alignItems="center"
          >
            {/* {progressShowing ? (
              <img
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "20px",
                }}
                src={UploadProgress}
                alt="upload-progress"
              />
            ) : ( */}
            <>
              <Grid item xs={2}>
                <CircularProgress
                  variant="determinate"
                  value={uploadProgress}
                  size={50}
                />
              </Grid>
              <Grid
                item
                xs={2}
                style={{ textAlign: "center", position: "fixed" }}
              >
                <Typography
                  sx={{
                    fontSize: "12px",
                    marginLeft:
                      Math.round(uploadProgress) >= 100 ? "12px" : "15px",
                    marginTop: "-4px",
                  }}
                >
                  {Math.round(uploadProgress)}%
                </Typography>
              </Grid>
            </>
            {/* )} */}
            <Grid item xs={8}>
              <Typography sx={{ fontWeight: "600", fontSize: "16px" }}>
                {uploadStatus}
              </Typography>
              <Typography sx={{ fontWeight: "400", fontSize: "12px" }}>
                {uploadDescription}
              </Typography>
            </Grid>
          </Grid>
          <Typography
            variant="h3"
            sx={{ my: 2, fontWeight: "700", fontSize: "20px" }}
          >
            Add details
          </Typography>
          <Typography sx={{ mt: 2, fontWeight: "600", fontSize: "14px" }}>
            Model Name
          </Typography>
          <CommonTextField
            label=""
            fullWidth
            hintText="Enter Model Name"
            value={modelName}
            onChange={handleModelNameChange}
          />
          {/* <Typography sx={{ mt: 2, fontWeight: "600", fontSize: "14px" }}>
            Add Team Members (Optional)
          </Typography>
          <TextField
            placeholder="Search here"
            value={newMember}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon style={{ color: "black" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                height: "45px",
                backgroundColor: "#F9FAFB",
                "&:hover": {
                  backgroundColor: "#F9FAFB",
                },
                "&.Mui-focused": {
                  backgroundColor: "transparent",
                },
              },
            }}
            style={{ marginBottom: "10px", width: "100%" }}
          />
          <List sx={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {teamMembers.map((member, index) => (
              <ListItem
                key={index}
                sx={{
                  border: "1px solid #D9D9D9",
                  borderRadius: "12px",
                  width: "auto",
                }}
              >
                <ListItemText primary={member} />
              </ListItem>
            ))}
          </List> */}
          <DialogActions>
            <Button
              fullWidth
              onClick={handleSubmit}
              sx={{
                color: "#FFF",
                "&:hover": {
                  backgroundColor: "#2E368E",
                },
              }}
            >
              Save & Go to Projects
            </Button>
          </DialogActions>
        </Paper>
      </Backdrop>
      <Backdrop open={draftConfirmationOpen} style={{ zIndex: 999 }}>
        <Box
          component="div"
          sx={{
            width: "300px",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 9999,
            textAlign: "center",
            padding: "24px",
            borderRadius: "12px",
          }}
        >
          <Paper
            elevation={3}
            sx={{
              borderRadius: "12px",
              padding: "10px",
              backgroundColor: "#FFF",
              color: "#000",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <Box
              component="div"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              <img
                src={Images.WARNING_ICON_YELLOW}
                alt="Warning"
                style={{ width: 25, height: 25 }}
              />
            </Box>
            <IconButton
              onClick={() => setDraftConfirmationOpen(false)}
              sx={{ position: "absolute", top: "30px", right: "30px" }}
            >
              <img src={Images.CLOSE_ICON} alt="CloseIcon" />
            </IconButton>
            <Typography
              sx={{ fontWeight: "700", fontSize: "20px", marginBottom: 0 }}
            >
              Save as Draft?
            </Typography>
            <Typography variant="body2" color="#484848" gutterBottom>
              Your current progress will be saved to Drafts.
            </Typography>
            <Box component="div" sx={{ display: "flex", gap: "16px" }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setDraftConfirmationOpen(false)}
                sx={{
                  backgroundColor: "#FFF",
                  color: "#2E368E",
                  border: "1px solid #2E368E",
                  "&:hover": {
                    backgroundColor: "#FFF",
                    color: "#2E368E",
                    border: "1px solid #2E368E",
                  },
                }}
                style={{ fontWeight: 500, textTransform: "none" }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSave3DModelAsDraft}
                style={{
                  fontWeight: 500,
                  textTransform: "none",
                }}
              >
                Save
              </Button>
            </Box>
          </Paper>
        </Box>
      </Backdrop>
    </>
  );
};

export default ModelUpload;
