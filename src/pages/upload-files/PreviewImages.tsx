import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import {
  Checkbox,
  Icon,
  IconButton,
  DialogActions,
  CircularProgress,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { default as CommonTextField } from "@components/app_textfield";
import { memo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@hooks/redux-hooks";
import {
  uploadImages,
  generateModel,
  uploadImagesPUT,
} from "@slices/imageUploadSlice";
import { uploadImagesAsDraft, updateDraft } from "@slices/imageUploadSlice";
import { updateProjectDetails } from "@slices/projectSlice";
import UploadProgress from "@assets/upload-progress.gif";
import { Images } from "@constants/imageConstants";
import { toast as Toast } from "sonner";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import heic2any from "heic2any";

import { URLS } from "@constants/urlConstants";
import axiosInstance from "../../api/axiosInstance";
// import { createWebWorker } from "../../web-workers/webWorker";
// import compressorWorker from "../../web-workers/compressorWorker";
import imageCompression from "browser-image-compression";
import { Button, Backdrop, Box, Paper, Typography } from "@mui/material";
import { FC } from "react";

interface PreviewImagesProps {
  selectedImages: File[];
  setSelectedImages: React.Dispatch<React.SetStateAction<File[]>>;
  setIsPreview: React.Dispatch<React.SetStateAction<boolean>>;
  isFromDrafts: boolean;
  modelIdForDrafts: string;
}

interface WarningModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const WarningModal: FC<WarningModalProps> = ({ open, onClose, onConfirm }) => {
  return (
    <Backdrop open={open} style={{ zIndex: 999 }}>
      <Box
        component="div"
        sx={{
          width: "310px",
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
            padding: "14px",
            backgroundColor: "#FFF",
            color: "#000",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <Typography sx={{ fontWeight: "700", fontSize: "20px" }} gutterBottom>
            Do you want to Leave ?
          </Typography>
          <Typography
            variant="body2"
            color="#484848"
            sx={{ marginBottom: "1rem" }}
            gutterBottom
          >
            Changes you made may not be saved
          </Typography>
          <Box component="div" sx={{ display: "flex", gap: "16px" }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={onConfirm}
              sx={{
                backgroundColor: "#FFF",
                color: "red",
                border: "1px solid red",
                "&:hover": {
                  backgroundColor: "#FFF",
                  color: "red",
                  border: "1px solid red",
                },
              }}
            >
              Proceed
            </Button>
          </Box>
        </Paper>
      </Box>
    </Backdrop>
  );
};

function PreviewImages({
  selectedImages,
  setSelectedImages,
  setIsPreview,
  isFromDrafts,
  modelIdForDrafts,
}: PreviewImagesProps) {
  const [imageFiles, setImageFiles] = useState<any[]>(selectedImages);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [modelName, setModelName] = useState("");
  const [draftConfirmationOpen, setDraftConfirmationOpen] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [loadingLocalImages, setLoadingLocalImages] = useState<boolean>(false);

  const [uploadStatus, setUploadStatus] = useState("Uploading Images");
  const [uploadDescription, setUploadDescription] = useState(
    "Keep the app open for faster upload",
  );
  const [progressShowing, setProgressShowing] = useState(false);
  const [convertImages, setConvertImages] = useState(selectedImages);
  const [pngUrl, setPngUrl] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [imagesAdded, setImagesAdded] = useState(false);
  const [disable, setDisable] = useState(true);
  const [isBackModalOpen, setBackModalOpen] = useState(false);

  const handleBackArrowClick = () => {
    setBackModalOpen(true); // Open the confirmation modal
  };

  const handleConfirmBack = () => {
    navigate(0); // Navigate to the previous page
    setIsPreview(false);
  };

  const handleCloseModal = () => {
    setBackModalOpen(false); // Close the confirmation modal
  };

  // const [teamMembers, setTeamMembers] = useState([
  //   "Rahul Sharma",
  //   "Rahul Kumar Srivastav",
  // ]);
  // const [newMember, setNewMember] = useState("");
  const [compressedImages, setCompressedImages] = useState<any[]>([]);

  // const compressorWorkerInstance = useMemo(
  //   () => createWebWorker(compressorWorker),
  //   []
  // );

  // useEffect(() => {
  //   return () => {
  //     compressorWorkerInstance.terminate();
  //   };
  // }, [compressorWorkerInstance]);

  useEffect(() => {
    handleConvertImageToPng();
  }, [convertImages]);

  // console.log(pngUrl);

  const handleCheckHeic = () => {
    let isHEIC = false;
    const firstImage: any = imageFiles[0];
    if (typeof firstImage === "string") {
      isHEIC =
        firstImage?.toLowerCase().endsWith(".heic") ||
        firstImage?.toLowerCase().endsWith(".heif");
    } else {
      isHEIC =
        imageFiles[0]?.name?.toLowerCase().endsWith(".heic") ||
        imageFiles[0]?.name?.toLowerCase().endsWith(".heif");
    }

    return isHEIC;
  };

  //check duplicates

  const isDuplicate = (newFile: File, existingFiles: File[]) => {
    return existingFiles.some(
      (file) => file.name === newFile.name && file.size === newFile.size,
    );
  };

  const handleConvertImageToPng = async () => {
    setLoading(true);
    try {
      for (const image of convertImages) {
        var imageBlob;
        if (typeof image === "string") {
          const response = await fetch(image);
          imageBlob = await response.blob();
        } else {
          imageBlob = image;
        }
        const convertedBlob = await heic2any({
          blob: imageBlob,
          toType: "image/jpeg",
          quality: 1,
        });
        console.log("blob:", convertedBlob);
        //@ts-expect-error Create a temporary URL for the converted Blob
        const convertedUrl = URL.createObjectURL(convertedBlob);
        console.log(convertedUrl);
        setPngUrl((prevUrls: any) => [...prevUrls, convertedUrl]);
      }

      // const urls = await Promise.all(promises);
      // console.log("these are urls:", urls);
      // if (urls) {
      setLoading(false);
      // }
    } catch (error) {
      console.error("Error converting HEIC/HEIF image:", error);
      // You might want to handle the error here
      return null; // Return null or some default value in case of error
    }
  };

  // console.log("this is result:",result);

  const showSuccessToast = () =>
    toast.success("Your model has been successfully saved as a draft.");

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
    if (uploadProgress < 100) {
      toast.error(
        "Image Upload is still in progress. Please wait for the process to complete.",
      );
      return;
    } else {
      try {
        if (isFromDrafts) {
          await dispatch(
            updateProjectDetails({
              modelId: modelIdForDrafts || "",
              modelName,
            }),
          );
          toast.success("Model has been successfully saved.");
        } else {
          await dispatch(
            updateProjectDetails({ modelId: modelId || "", modelName }),
          );
          toast.success("Model has been successfully saved.");
        }
      } catch (error) {
        console.log(error);
      } finally {
        toggleModal();
        navigate("/");
      }
    }
  };

  // const handleDeleteSelectedImage = () => {
  //   setImageFiles((prevItems) =>
  //     prevItems.filter((item) => !selectedImages.includes(item)),
  //   );
  //   setSelectedImages([]); // Clear selected items after deletion
  //   setDraftConfirmationOpen(false);
  //   setShowCheckboxes(false);
  // };

  // Start the upload progress (this is a simulation)
  const startUpload = () => {
    setUploadProgress(0);
  };

  const handleCloseForUploadProgress = () => {
    navigate("/");
  };

  const [modelId, setModelId] = useState<string | null>(null);
  // Import necessary dependencies

  const BATCH_SIZE = 10; // Define the batch size

  const handleDraftGenerate = async () => {
    try {
      toggleModal(); // Open the modal immediately upon clicking the Generate button
      startUpload();
      const modelId = modelIdForDrafts;
      const response = await dispatch(generateModel(modelId));
      console.log("generate: ", response);
      // setEstimatedTime(response.payload.estimated_time);
      toast.success("Model generation started.");
      setUploadProgress(100);
      setDisable(false);
      setProgressShowing(true);
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
      // Handle error
      console.error("Error generating model:", error);
      toast.error("Error generating model. Please try again.");
    }
  };

  const handleGenerateClick = async () => {
    // compressorWorkerInstance.terminate();

    if (isFromDrafts) {
      handleDraftGenerate();
      return;
    }

    try {
      toggleModal(); // Open the modal immediately upon clicking the Generate button

      // Start the upload progress
      startUpload();

      // Split the selectedImages into batches
      const batches = [];
      for (let i = 0; i < selectedImages.length; i += BATCH_SIZE) {
        batches.push(selectedImages.slice(i, i + BATCH_SIZE));
      }
      let modelId;

      // Count total number of images
      const totalImages = selectedImages.length;
      let uploadedImagesCount = 0;

      // Iterate over each batch and dispatch the uploadImages action
      for (const [index, batch] of batches.entries()) {
        // For the first batch, dispatch uploadImages action
        if (index === 0) {
          const response = await dispatch(uploadImages(batch));
          console.log("First response: ", response);
          modelId = response.payload.model_id;
          setModelId(response.payload.model_id);
        } else {
          // For subsequent batches, dispatch uploadImagesPUT action with modelId
          const response = await dispatch(
            uploadImagesPUT({ selectedImages: batch, modelId }),
          );
          console.log("Batch responses: ", response);
          // Handle the response as required
        }

        // Update uploaded images count
        uploadedImagesCount += batch.length;

        // Calculate progress percentage
        let progressPercentage = Math.round(
          (uploadedImagesCount / totalImages) * 100,
        );
        // Adjust progress to 95% when nearing completion
        if (progressPercentage === 100) {
          progressPercentage = 95;
        }

        // Update upload progress
        setUploadProgress(progressPercentage);
      }

      const response1 = await dispatch(generateModel(modelId));
      console.log("generate: ", response1);
      setUploadProgress(100);
      //setEstimatedTime(response1.payload.estimated_time);
      toast.success("Model generation started.");
      setUploadProgress(100);
      setProgressShowing(true);
      setDisable(false);
      if (response1.payload.estimated_time === "in-queue") {
        setUploadStatus("In Queue");
        setUploadDescription("Project in queue for generation");
      } else {
        setUploadStatus("In Progress");
        setUploadDescription(
          `ETA: ${response1.payload.estimated_time.substring(3)} mins`,
        );
      }
    } catch (error) {
      // Handle error
      console.error("Error uploading images:", error);
    }
  };

  // const isSafariBrowser = () => {
  //   const userAgent = navigator.userAgent.toLowerCase();
  //   return userAgent.includes("safari") && !userAgent.includes("chrome");
  // };

  // console.log(isSafariBrowser());

  // On opening the modal, start the upload progress
  const handleSaveImageAsDraft = async () => {
    try {
      setSavingDraft(true); // Set savingDraft to true when starting to save draft
      console.log("Selected Images:", selectedImages);

      let response;

      if (imagesAdded === false && isFromDrafts) {
        toast.error("No Images were added");
        setSavingDraft(false);
        navigate("/");
        return;
      }

      if (isFromDrafts) {
        console.log("Updating existing draft, ", modelIdForDrafts);
        const payload = { modelId: modelIdForDrafts, selectedImages };
        response = await dispatch(updateDraft(payload));
      } else {
        response = await dispatch(uploadImagesAsDraft(selectedImages));
      }

      // Log the response for debugging
      console.log("Draft save response:", response);

      if (
        response &&
        (uploadImagesAsDraft.fulfilled.match(response) ||
          updateDraft.fulfilled.match(response))
      ) {
        showSuccessToast();
        navigate("/");
      } else {
        toast.error("No Images were added");
        navigate("/");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error(
        "An error occurred while saving the draft. Please try again.",
      );
    } finally {
      setSavingDraft(false); // Reset savingDraft to false when draft save process finishes
    }
  };

  const [imagesForDelete, setImagesForDelete] = useState<File[]>([]);
  const [imageIndexForDelete, setImageIndexForDelete] = useState<number[]>([]);

  const handleImageClick = (image: File, index: number) => {
    if (showCheckboxes) {
      const selectedIndex = imagesForDelete.indexOf(image);
      if (selectedIndex === -1) {
        setImagesForDelete([...imagesForDelete, image]);
        setImageIndexForDelete([...imageIndexForDelete, index]);
      } else {
        setImagesForDelete(imagesForDelete.filter((item) => item !== image));
        setImageIndexForDelete(
          imageIndexForDelete.filter((item) => item !== index),
        );
      }
    }
  };

  const handleDeleteSelectedImage = async () => {
    try {
      if (isFromDrafts) {
        const urlsForDelete = imagesForDelete.filter(
          (image) => typeof image === "string",
        );

        const payload = {
          model_id: modelIdForDrafts,
          image_urls: urlsForDelete,
        };

        console.log("Payload for delete:", payload);

        // Send delete request to the server
        const response = await axiosInstance.post(URLS.DELETE_IMAGES, payload);
        console.log("Response for delete: ", response);

        if (response.status === 200) {
          // Update state if the delete operation was successful
          setImageFiles((prevItems) =>
            prevItems.filter((item) => !imagesForDelete.includes(item)),
          );
          setSelectedImages((prevItems) =>
            prevItems.filter((_, i) => !imageIndexForDelete.includes(i)),
          );
          setCompressedImages((prevItems) =>
            prevItems.filter((item) => !imagesForDelete.includes(item)),
          );
          setPngUrl((prevItems: File[]) =>
            prevItems.filter((item) => !imagesForDelete.includes(item)),
          );
          setImagesForDelete([]); // Clear selected items for delete after deletion
          setImageIndexForDelete([]);
        } else {
          console.error("Failed to delete images", response);
        }
      } else {
        // Update state for non-draft scenario

        if (imagesForDelete?.length === imageFiles?.length) {
          navigate(0);
          setIsPreview(false);
          return;
        }

        setImageFiles((prevItems) =>
          prevItems.filter(
            (item) => !imagesForDelete.some((file) => item?.name === file.name),
          ),
        );

        setSelectedImages((prevItems) =>
          prevItems.filter((_, i) => !imageIndexForDelete.includes(i)),
        );

        setCompressedImages((prevItems) =>
          prevItems.filter(
            (item) => !imagesForDelete.some((file) => item?.name === file.name),
          ),
        );
        setPngUrl((prevItems: File[]) =>
          prevItems.filter((item) => !imagesForDelete.includes(item)),
        );
        setImagesForDelete([]); // Clear selected items for delete after deletion
        setImageIndexForDelete([]);
      }

      // Close the draft confirmation modal if open
      setDraftConfirmationOpen(false);

      // Force re-render if necessary
      setSelectEnabled(false);
      setShowCheckboxes(false);
      setSelectedImages((prevImages) => [
        ...prevImages.filter((item) => !imagesForDelete.includes(item)),
      ]);
    } catch (error) {
      console.error("Error deleting images:", error);
    }
  };

  const handleCancelSelection = () => {
    setSelectEnabled(false);
    setShowCheckboxes(false);
    setSelectedImages([...imageFiles]);
    setImagesForDelete([]); // Clear selected items for delete
    setImageIndexForDelete([]);
  };

  const [selectEnabled, setSelectEnabled] = useState(false);
  const handleSelect = () => {
    setSelectEnabled(true);
    setShowCheckboxes(true);
    setImagesForDelete([]);
    setImageIndexForDelete([]);
  };

  // const compressorInvoker = useCallback(
  //   async (file: File) => {
  //     return new Promise((resolve, reject) => {
  //       const onMessage = (event: MessageEvent) => {
  //         if (event.data.compressedFile) {
  //           const compressedBlob = event.data.compressedFile;
  //           const compressedFile = new File([compressedBlob], file.name, {
  //             type: file.type,
  //           });
  //           compressorWorkerInstance.removeEventListener("message", onMessage);

  //           resolve(compressedFile);
  //         } else {
  //           reject(event.data.error);
  //         }
  //       };

  //       compressorWorkerInstance.addEventListener("message", onMessage);

  //       compressorWorkerInstance.postMessage({
  //         file: file,
  //         options: {
  //           maxWidthOrHeight: 150,
  //           maxSizeMB: 0.3,
  //           useWebWorker: true,
  //         },
  //       });
  //     });
  //   },
  //   [compressorWorkerInstance]
  // );

  const handleCompressed = useCallback(async (images: File[]) => {
    if (handleCheckHeic()) {
      return;
    }
    let compressedCount = 0;
    if (typeof images[0] === "string") {
      setCompressedImages(images);
      setLoadingLocalImages(false);
      return;
    }

    try {
      images.forEach(async (file: File) => {
        setLoadingLocalImages(true);
        try {
          const compressedFile = await imageCompression(file, {
            maxWidthOrHeight: 1000,
            maxSizeMB: 1,
            useWebWorker: false,
          });
          setCompressedImages((prevImgs) => {
            const isImageExists = prevImgs.some(
              (img) => img.name === compressedFile.name,
            );

            if (!isImageExists) {
              return [...prevImgs, compressedFile];
            }
            return prevImgs;
          });
        } catch (error) {
          return error;
          //error
        } finally {
          compressedCount += 1;
          if (compressedCount === images.length) {
            setLoadingLocalImages(false);
          }
        }
      });

      // const img = await Promise.all(imgPromises);
      // setCompressedImages(img);

      // return img;
    } catch (error) {
      console.error("Compression error:", error);
      setLoadingLocalImages(false);
      throw error;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (imageFiles?.length) {
      handleCompressed(imageFiles);
    }
  }, [imageFiles, handleCompressed]);

  const handleAddMore = async (event: any) => {
    const files = event.target.files;
    setImagesAdded(true);
    if (files) {
      const fileList = Array.from(files) as File[];
      const uniqueFiles = fileList.filter(
        (file) => !isDuplicate(file, selectedImages),
      );

      const discardedFiles = fileList.length - uniqueFiles.length;
      if (discardedFiles > 0) {
        Toast.warning(`${discardedFiles} duplicate image(s) were discarded.`, {
          style: {
            background: "#F58220",
            borderRadius: "12px",
            padding: "16px",
            color: "white",
            height: "56px",
          },
          duration: 3000,
        });
        if (uniqueFiles.length > 0) {
          Toast.success(`${uniqueFiles.length} image(s) were added`, {
            style: {
              background: "#00A652",
              borderRadius: "12px",
              fontWeight: 500,
              padding: "16px",
              color: "white",
              height: "56px",
            },
            duration: 3000,
          });
        }
      }

      setSelectedImages((prevFiles) => [...prevFiles, ...uniqueFiles]);
      setImageFiles((prevFiles) => [...prevFiles, ...uniqueFiles]);

      setConvertImages([...uniqueFiles]);

      // Make PUT request with draftModelId
      // try {
      //   const formData = new FormData();
      //   uniqueFiles.forEach((file) => {
      //     formData.append("files", file);
      //   });
      //   formData.append("model_id", modelIdForDrafts);
      //   const response = await axiosInstance.put(
      //     `${URLS.BATCH_UPLOAD}`,
      //     formData,
      //     {
      //       headers: {
      //         "Content-Type": "multipart/form-data",
      //       },
      //     },
      //   );
      //   console.log("PUT request response:", response.data);
      // } catch (error) {
      //   console.error("Error uploading additional images:", error);
      //   // Toast.error("Error uploading additional images.", {
      //   //   style: {
      //   //     background: "#D32F2F",
      //   //     borderRadius: "12px",
      //   //     padding: "16px",
      //   //     color: "white",
      //   //     height: "56px",
      //   //   },
      //   //   duration: 3000,
      //   // });
      // }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "87vh",
        backgroundColor: "#F7F7F7",
      }}
    >
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
                disabled={savingDraft}
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSaveImageAsDraft}
                style={{
                  fontWeight: 500,
                  textTransform: "none",
                }}
              >
                {savingDraft ? "Saving..." : "Save"}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Backdrop>
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
            onClick={handleCloseForUploadProgress}
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
              <div
                style={{
                  borderRadius: "30px",
                  padding: "5px",
                  backgroundColor: "white",
                  width: "47px",
                  height: "47px",
                }}
              >
                <img
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "20px",
                  }}
                  src={UploadProgress}
                  alt="upload-progress"
                />
              </div>
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
              color="primary"
              variant="contained"
              sx={{
                color: "#FFF",
                // "&:hover": {
                //   backgroundColor: "#2E368E",
                // },
              }}
            >
              Save & Go to Projects
            </Button>
          </DialogActions>
        </Paper>
      </Backdrop>

      <div style={{ padding: "16px", height: "80vh" }}>
        <Box
          component="div"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{ display: "flex", alignItems: "center", padding: "8px" }}
          >
            <Icon onClick={handleBackArrowClick}>
              <KeyboardArrowLeftIcon />
            </Icon>
            <WarningModal
              open={isBackModalOpen}
              onClose={handleCloseModal}
              onConfirm={handleConfirmBack}
            />
            Preview
          </Typography>
          {!showCheckboxes && (
            // Render the "Select" button if showCheckboxes is false
            <div style={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="body2"
                sx={{
                  marginRight: "16px",
                  fontWeight: 400,
                  fontFamily: "OpenSans",
                }}
              >
                {`${!handleCheckHeic() ? imageFiles.length : pngUrl.length} ${!handleCheckHeic() ? (imageFiles.length && imageFiles.length > 1 ? "Images" : "Image") : pngUrl.length && pngUrl.length > 1 ? "Images " : "Image"} `}
              </Typography>
              <Button
                color="primary"
                onClick={handleSelect}
                style={{
                  width: "76px",
                  height: "32px",
                  marginRight: "16px",
                  borderRadius: "8px",
                  backgroundColor: "white",
                  padding: "8px",
                  color: "black",
                  textTransform: "none",
                  fontWeight: 400,
                  fontFamily: "OpenSans",
                }}
              >
                Select
              </Button>
            </div>
          )}

          {selectEnabled && (
            <Typography
              style={{
                display: "flex",
                alignItems: "center",
                fontWeight: "light",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  marginRight: "16px",
                  fontWeight: 400,
                  fontFamily: "OpenSans",
                }}
              >
                {`${imagesForDelete.length} ${imagesForDelete.length > 1 ? "Images " : "Image"} selected`}
              </Typography>
              {selectEnabled && (
                <Button
                  color="primary"
                  onClick={handleCancelSelection}
                  style={{
                    flex: 1,
                    width: "76px",
                    height: "32px",
                    marginRight: "10px",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    padding: "8px",
                    color: "black",
                    textTransform: "none",
                    fontWeight: 400,
                    fontFamily: "OpenSans",
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant="contained"
                style={{
                  backgroundColor: "white",
                  color: "black",
                  padding: "5px",
                  minWidth: "auto",
                  boxShadow: "none",
                }}
                onClick={handleDeleteSelectedImage}
              >
                <img
                  src={Images.DELETE_ICON}
                  alt="Delete"
                  style={{ cursor: "pointer" }}
                />
              </Button>
            </Typography>
          )}
        </Box>

        {/* Render selected images here */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
            gap: "10px",
            padding: "10px",
            alignItems: "start",
            maxHeight: "calc(87vh - 150px)",
            // Hide the scrollbar
            // scrollbarWidth: "none", // Firefox
            // msOverflowStyle: "none", // IE and Edge
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "150px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "2px dashed #1976d2",
              borderRadius: "8px",
              backgroundColor: "rgba(46, 54, 142, 0.1)",
            }}
          >
            <Typography
              component="label"
              color="primary"
              style={{
                fontWeight: 400,
                fontFamily: "OpenSans",
              }}
            >
              Add More +
              <input
                type="file"
                accept="image/*,.heic,.heif"
                style={{ display: "none" }}
                multiple
                onChange={handleAddMore}
              />
            </Typography>
          </div>

          {loading && handleCheckHeic() && (
            <CircularProgress
              sx={{
                justifySelf: "center",
                margin: "auto",
              }}
            />
          )}
          {loadingLocalImages && (
            <CircularProgress
              title="loading"
              sx={{
                justifySelf: "center",
                margin: "auto",
              }}
            />
          )}
          {(handleCheckHeic() ? pngUrl : compressedImages)?.map(
            (image: File | string | any, index: number) => {
              return (
                <ImageItem
                  key={index}
                  image={image}
                  handleImageClick={() => handleImageClick(image, index)}
                  imagesForDelete={imagesForDelete}
                  handleCheckHeic={handleCheckHeic}
                  showCheckboxes={showCheckboxes}
                />
              );
            },
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          // justifyContent: "flex-end",
          position: "fixed",
          right: 0,
          bottom: 10,
          padding: "10px",
        }}
      >
        <div>
          {selectedImages.length < 24 && (
            <Typography
              variant="body2"
              style={{
                color: "red",
                fontFamily: "OpenSans",
                fontWeight: 400,
                fontSize: "12px",
                display: "flex",
                justifyContent: "center",
                marginBottom: "10px",
              }}
            >
              {" "}
              Minimum of 24 images required to upload
            </Typography>
          )}
          <div style={{ display: "flex", width: "25vw" }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setDraftConfirmationOpen(true)}
              style={{
                flex: 1,
                marginRight: "5px",
                backgroundColor: "white",
                padding: "8px",
                top: 10,
              }}
            >
              Save as Draft
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{ flex: 1, top: 10 }}
              //onClick={handleUpload}
              onClick={handleGenerateClick}
              disabled={
                !handleCheckHeic()
                  ? selectedImages.length < 24
                  : pngUrl.length < 24
              }
            >
              Generate
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewImages;

const ImageItem = memo((props: any) => {
  const {
    key,
    handleImageClick,
    imagesForDelete,
    handleCheckHeic,
    showCheckboxes,
    image,
  } = props;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "150px",
      }}
      onClick={() => handleImageClick(image, key)}
    >
      {showCheckboxes && (
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
            checked={imagesForDelete.some((img: File) => img === image)}
            onChange={() => handleImageClick(image)}
            onClick={(event) => event.stopPropagation()}
            style={{
              color: "#2E368E",
              margin: "0px",
              padding: "2px",
              zIndex: "2",
            }}
          />
        </div>
      )}
      {handleCheckHeic() ? (
        <img
          src={image}
          alt={image.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      ) : typeof image === "string" ? (
        <img
          src={image}
          alt={"image"}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      ) : (
        <img
          src={URL.createObjectURL(image)}
          alt={image.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      )}
    </div>
  );
});
