import { FC } from "react";
import {
  AppBar,
  Box,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  Badge,
  IconButton,
  Icon,
  Backdrop,
  Button,
  Paper,
} from "@mui/material";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import { SetStateAction, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useHistory
import ModelUpload from "./3dModelUpload";
import ImageUpload from "./ImageUpload";
import VideoUpload from "./VideoUpload";
import { useAppDispatch } from "@hooks/redux-hooks";
import { fetchCartDetails } from "@slices/projectSlice";
import NotificationsModal from "@components/notifications";
import { Images } from "@constants/imageConstants";
import PreviewImages from "./PreviewImages";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "@slices/notificationSlice";
interface Notification {
  id: string;
  title: string;
  description: string;
  created_at: Date;
  is_selected: boolean;
  is_read: boolean;
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
            Do you want to Leave?
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
function UploadFiles() {
  const [selectedCount, setSelectedCount] = useState(0);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const initialTabIndex = parseInt(queryParams.get("tab") || "0") || 0; // Parse integer
  const [value, setValue] = useState(initialTabIndex);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [markAllAsRead, setMarkAllAsRead] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isBackModalOpen, setBackModalOpen] = useState(false);
  const [isvideoFile, setIsVideoFile] = useState<File | null>(null);
  const [ismodelFile, setIsModelFile] = useState<File | null>(null);

  // Function to update the notification count
  const updateNotificationCount = (count: number) => {
    setNotificationCount(count);
  };

  const handleConfirmBack = () => {
    navigate(0); // Navigate to the previous page
  };

  const handleCloseModal = () => {
    setBackModalOpen(false); // Close the confirmation modal
  };

  const fetchingNotifications = async () => {
    try {
      const response = await dispatch(fetchNotifications());
      if (response.meta.requestStatus === "fulfilled") {
        const notificationsData = response.payload as Notification[];
        const unreadCount = notificationsData.filter(
          (notification) => !notification.is_read,
        ).length;
        setNotifications(notificationsData);
        updateNotificationCount(unreadCount);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      for (const notification of notifications) {
        if (!notification.is_read) {
          await dispatch(markNotificationAsRead(notification.id));
        }
      }
      updateNotificationCount(0);
      setMarkAllAsRead(true);
      fetchingNotifications(); // Refresh notifications after marking them as read
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  useEffect(() => {
    fetchingNotifications();
    const interval = setInterval(() => {
      fetchingNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updatedCartCount = async () => {
      try {
        const response = await dispatch(fetchCartDetails());
        setCartCount(response.payload.length);
      } catch (error) {
        console.log("Error fetching cart details:", error);
      }
    };
    updatedCartCount();
  }, []);

  const location = useLocation();
  const [isFromDrafts, setIsFromDrafts] = useState(false);
  const [modelIdForDrafts, setModelIdForDrafts] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const handleBackArrowClick = () => {
    if (
      selectedCount > 0 ||
      selectedImages.length > 0 ||
      isvideoFile !== null ||
      ismodelFile !== null
    ) {
      console.log(isvideoFile);
      console.log(ismodelFile);
      setBackModalOpen(true); // Open the confirmation modal
    } else {
      navigate(-1); // Navigate back directly
    }
  };

  useEffect(() => {
    if (location.state) {
      setSelectedImages(location.state.images);
      setModelIdForDrafts(location.state.id);
      setIsPreview(true);
      setIsFromDrafts(true);
    }
  }, []);

  useEffect(() => {
    if (location.state) {
      console.log("location.state", location.state);
      setVideoFile(location.state.video);
      setIsPreview(true);
    }
  }, []);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const handleSelectedCountChange = (count: SetStateAction<number>) => {
    setSelectedCount(count);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#F7F7F7",
      }}
    >
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <img
            onClick={() => {
              navigate("/");
            }}
            src={Images.LOGO}
            alt="Logo"
            style={{ width: "150px", height: "auto", cursor: "pointer" }}
          />
          <Box
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              paddingRight: "20px",
            }}
          >
            <Badge badgeContent={notificationCount} color="error">
              <IconButton
                sx={{ background: "#F7F8FB" }}
                onClick={() => {
                  setOpenModal(true);
                  markAllNotificationsAsRead();
                }}
              >
                <i
                  className="bx bx-bell"
                  style={{ color: "#000", fontSize: "1.5rem" }}
                ></i>
              </IconButton>
            </Badge>
            <NotificationsModal
              open={openModal}
              onClose={() => setOpenModal(false)}
              markAllAsRead={markAllAsRead}
              updateNotificationCount={updateNotificationCount}
            />
            <Badge badgeContent={cartCount} color="error">
              <IconButton
                sx={{ background: "#F7F8FB" }}
                onClick={() => navigate("/cart")}
              >
                <i
                  onClick={() => {
                    navigate("/cart");
                  }}
                  className="bx bx-cart"
                  style={{ color: "#000", fontSize: "1.5rem" }}
                ></i>
              </IconButton>
            </Badge>
          </Box>
        </Toolbar>
      </AppBar>
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          padding: "16px",
        }}
      >
        {!isPreview && (
          <>
            <Typography
              variant="h5"
              component="div"
              style={{
                padding: "8px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Icon onClick={handleBackArrowClick}>
                <KeyboardArrowLeftIcon />
              </Icon>
              Projects
            </Typography>
            <WarningModal
              open={isBackModalOpen}
              onClose={handleCloseModal}
              onConfirm={handleConfirmBack}
            />
            <Box
              component="div"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Tabs value={value} onChange={handleChange}>
                <Tab
                  label="IMAGES"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: "20px",
                    textAlign: "center",
                    textTransform: "none", // Disable text transformation
                  }}
                />
                <Tab
                  label="VIDEOS"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: "20px",
                    textAlign: "center",
                    textTransform: "none", // Disable text transformation
                  }}
                />
                <Tab
                  label="3D MODEL"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: "20px",
                    textAlign: "center",
                    textTransform: "none", // Disable text transformation
                  }}
                />
              </Tabs>
            </Box>
          </>
        )}
        {value === 0 && (
          <>
            {isPreview ? (
              <PreviewImages
                setIsPreview={setIsPreview}
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
                isFromDrafts={isFromDrafts}
                modelIdForDrafts={modelIdForDrafts}
              />
            ) : (
              <ImageUpload
                onSelectedImageCountChange={handleSelectedCountChange}
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
                setIsPreview={setIsPreview}
              />
            )}
          </>
        )}
        {value === 1 && (
          <VideoUpload
            draftVideoFile={videoFile}
            setIsVideoFile={setIsVideoFile}
          />
        )}
        {value === 2 && <ModelUpload setIsModelFile={setIsModelFile} />}
      </div>
    </div>
  );
}

export default UploadFiles;
