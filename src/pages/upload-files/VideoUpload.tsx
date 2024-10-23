import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../api/axiosInstance";
import { URLS } from "@constants/urlConstants";
import {
  Button,
  IconButton,
  Typography,
  Backdrop,
  Paper,
  DialogActions,
  CircularProgress,
  Grid,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UploadProgress from "@assets/upload-progress.gif";
import { default as CommonTextField } from "@components/app_textfield";
import { updateProjectDetails } from "@slices/projectSlice";
import { useAppDispatch } from "@hooks/redux-hooks";
import { generateModel, uploadVideosAsDraft } from "@slices/imageUploadSlice";
import { Images } from "@constants/imageConstants";

interface VideoUploadProps {
  draftVideoFile: string | null;
  setIsVideoFile: React.Dispatch<React.SetStateAction<File | null>>;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
  draftVideoFile,
  setIsVideoFile,
}) => {
  const [videoFile, setVideoFile] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [draftConfirmationOpen, setDraftConfirmationOpen] = useState(false);
  const [isVideoFileFromDraft, setIsVideoFileFromDraft] = useState(false);
  const [disable, setDisable] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const draftVideoModelId = location.state?.id;

  useEffect(() => {
    if (draftVideoFile !== null && draftVideoFile !== videoFile) {
      setVideoFile(draftVideoFile);
      setIsVideoFileFromDraft(true);
    } else if (draftVideoFile === null && videoFile !== null) {
      setVideoFile(null);
    }
  }, [draftVideoFile]);

  // State for the modal and progress
  const [isModalOpen, setModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [modelName, setModelName] = useState("");

  const [uploadStatus, setUploadStatus] = useState("Uploading Video");
  const [uploadDescription, setUploadDescription] = useState(
    "Keep the app open for faster upload",
  );
  const [progressShowing, setProgressShowing] = useState(false);
  // const [teamMembers, setTeamMembers] = useState([
  //   "Rahul Sharma",
  //   "Rahul Kumar Srivastav",
  // ]);
  // const [newMember, setNewMember] = useState("");
  const [modelId, setModelId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const [loader, setLoader] = useState(false);
  // Start the upload progress (this is a simulation)
  const startUpload = () => {
    setUploadProgress(0);
    let progress = 0;

    const interval = setInterval(() => {
      if (progress >= 95) {
        clearInterval(interval);
      } else {
        progress += 5;
        setUploadProgress(progress);
      }
    }, 100); // Adjust the time interval as needed
  };

  // useEffect(() => {
  //   if (location.state) {
  //     console.log("location.state", location.state);
  //     setVideoFile(location.state.video);
  //   }
  // },[]);

  // const handleInputKeyPress = (
  //   event: React.KeyboardEvent<HTMLInputElement>,
  // ) => {
  //   if (event.key === "Enter") {
  //     handleAddTeamMember();
  //   }
  // };

  // const handleAddTeamMember = () => {
  //   if (newMember.trim() !== "") {
  //     setTeamMembers([...teamMembers, newMember]);
  //     setNewMember("");
  //   }
  // };

  // Toggle modal display
  const toggleModal = () => setModalOpen(!isModalOpen);

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setNewMember(event.target.value);
  // };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    setDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    const videoFile = files.find((file) => file.type.startsWith("video/"));
    if (videoFile) {
      //@ts-expect-error
      setVideoFile(videoFile);
    } else {
      toast.error("Only one video file is allowed.", {
        position: "bottom-center",
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setIsVideoFile(file);
    if (file && file.type.startsWith("video/")) {
      //@ts-expect-error
      setVideoFile(file);
    } else {
      toast.error("Only one video file is allowed.", {
        position: "bottom-center",
      });
    }
  };

  // const handleDeleteSelectedVideo = () => {
  //   setVideoFile(null);
  //   setDraftConfirmationOpen(false);
  // };

  // Handle change in model name
  const handleModelNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setModelName(event.target.value);
  };

  // Handle the submission of the form
  const handleSubmit = async () => {
    if (uploadProgress < 100) {
      toast.error(
        "Video Upload is still in progress. Please wait for the process to complete.",
      );
      return;
    } else {
      try {
        if (isVideoFileFromDraft) {
          console.log("draftVideoModelId: ", draftVideoModelId);
          await dispatch(
            updateProjectDetails({
              modelId: draftVideoModelId || "",
              modelName,
            }),
          );
        }
        await dispatch(
          updateProjectDetails({ modelId: modelId || "", modelName }),
        );
        toast.success("Model has been successfully saved.");
      } catch (error) {
        console.log(error);
      } finally {
        toggleModal();
        navigate("/");
      }
    }
  };

  const showSuccessToast = () =>
    toast.success("Your model has been successfully saved as a draft.");

  const handleSaveVideoAsDraft = async () => {
    setLoader(true);
    try {
      const response = await dispatch(
        //@ts-expect-error
        uploadVideosAsDraft(videoFile as File),
      );

      setLoader(false);

      console.log("Draft save response:", response);

      if (uploadVideosAsDraft.fulfilled.match(response)) {
        showSuccessToast();
        navigate("/");
      } else {
        toast.error("Failed to save draft. Please try again.");
      }
      navigate("/");
    } catch (error) {
      // Handle error
      console.error("Error uploading videos:", error);
    }
  };

  const handleDraftGenerate = async () => {
    try {
      toggleModal(); // Open the modal immediately upon clicking the Generate button
      startUpload();

      const modelId = location.state.id;
      const response = await dispatch(generateModel(modelId));
      console.log("generate: ", response);
      // setEstimatedTime(response.payload.estimated_time);
      toast.success("Model generation started.");
      setUploadProgress(100);
      setProgressShowing(true);
      setDisable(false);
      if (response.payload.estimated_time === "in-queue") {
        setUploadStatus("In Queue");
        setUploadDescription("Project in queue for generation");
      } else {
        setUploadStatus("In Progress");
        setUploadDescription(
          `ETA: ${response.payload.estimated_time.substring(3)} mins`,
        );
      }
    } catch (error) {
      console.error("Error generating model:", error);
      toast.error("Error generating model. Please try again.");
    }
  };

  const handleUpload = async () => {
    toggleModal(); // Open the modal immediately upon clicking the Generate button
    startUpload();

    try {
      if (!videoFile) {
        toast.error("No video file selected.", {
          position: "bottom-center",
        });
        return;
      }

      if (isVideoFileFromDraft) {
        handleDraftGenerate();
        return;
      }

      const formData = new FormData();
      console.log("draftVideoFile", draftVideoFile);
      console.log("videoFile", videoFile);
      if (draftVideoFile !== null) {
        formData.append("files", draftVideoFile);
      } else {
        formData.append("files", videoFile);
      }
      // Append the video file with the key "file"
      const response: any = await axiosInstance.post(
        URLS.FILE_UPLOAD,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setModelId(response.data.model_id);
      toast.success("Video Uploaded successfully");
      setUploadProgress(95);
      const modelId = response.data.model_id;

      const generateResponse = await dispatch(generateModel(modelId));
      toast.success("Model generation started.");
      setUploadProgress(100);
      setProgressShowing(true);
      setDisable(false);
      if (generateResponse.payload.estimated_time === "in-queue") {
        setUploadStatus("In Queue");
        setUploadDescription("Project in queue for generation");
      } else {
        setUploadStatus("In Progress");
        setUploadDescription(
          `ETA: ${generateResponse.payload.estimated_time.substring(3)} mins`,
        );
      }
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  const memoizedVideo = useMemo(() => {
    return (
      videoFile && (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            margin: "8px",
          }}
        >
          {isVideoFileFromDraft ? (
            <video
              src={videoFile}
              style={{
                width: "15%",
                height: "30%",
                borderRadius: "8px",
              }}
              controls
            />
          ) : (
            <video
              src={URL.createObjectURL(videoFile as unknown as File)} // Cast the videoFile to File
              style={{
                width: "15%",
                height: "30%",
                borderRadius: "8px",
              }}
              controls
            />
          )}
        </div>
      )
    );
  }, [videoFile, isVideoFileFromDraft]);
  const isDraft = location.state?.draft;
  return (
    <>
      {videoFile === null && (
        <div
          style={{
            width: "100%",
            height: "70vh",
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
              Drag and drop your videos here
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
                accept="video/*"
                onChange={handleFileUpload}
                style={{ display: "none" }} // Hide the file input
              />
            </Button>
          </div>
        </div>
      )}
      {videoFile && (
        <>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              margin: "8px",
            }}
          >
            {memoizedVideo}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                width: "25vw",
                position: "fixed",
                bottom: "16px",
                right: "16px",
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  isDraft ? navigate("/") : setDraftConfirmationOpen(true)
                }
                style={{
                  flex: 1,
                  marginRight: "5px",
                  backgroundColor: "white",
                  padding: "8px",
                }}
              >
                {isDraft ? "Cancel" : "Save as Draft"}
              </Button>
              <Button
                variant="contained"
                color="primary"
                style={{ flex: 1 }}
                onClick={handleUpload}
              >
                Generate
              </Button>
            </div>
          </div>
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
                onClick={() => (progressShowing ? null : toggleModal())}
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
                {progressShowing ? (
                  <img
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "20px",
                    }}
                    src={UploadProgress}
                    alt="upload-progress"
                  />
                ) : (
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
                          marginLeft: "14px",
                          marginTop: "-4px",
                        }}
                      >
                        {Math.round(uploadProgress)}%
                      </Typography>
                    </Grid>
                  </>
                )}
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
                  disabled={disable}
                  fullWidth
                  onClick={handleSubmit}
                  sx={{
                    color: "#FFF",
                    // "&:hover": {
                    //   backgroundColor: "#2E368E",
                    // },
                  }}
                  color="primary"
                  variant="contained"
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
                  Your current progress will be saved to Drafts
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
                    onClick={handleSaveVideoAsDraft}
                    style={{
                      fontWeight: 500,
                      textTransform: "none",
                    }}
                  >
                    {loader ? "Saving..." : "Save"}
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Backdrop>
        </>
      )}
    </>
  );
};

export default VideoUpload;
