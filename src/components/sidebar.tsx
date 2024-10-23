import { Images } from "@constants/imageConstants";
import { useAppDispatch } from "@hooks/redux-hooks";
import { AccountCircle, Logout } from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  Paper,
  Typography,
  Grid,
} from "@mui/material";
import { logout } from "@slices/authSlice";
import { fetchUserData, uploadImage } from "@slices/userSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { RootState } from "src/store";
import heic2any from "heic2any";
import { toast } from "react-toastify";
interface SidebarProps {
  onItemClick: (itemName: string) => void;
}
const Sidebar = ({ onItemClick }: SidebarProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [activeItem, setActiveItem] = useState("account");
  const [logoutState, setLogoutState] = useState(false);
  const { userData, loading } = useSelector((state: RootState) => state.user);
  const [conversionLoading, setConversionLoading] = useState(false);
  const handleItemClick = (itemName: string) => {
    setActiveItem(itemName);
    onItemClick(itemName);
  };

  const handleLogout = async () => {
    try {
      const access_token = localStorage.getItem("accessToken");

      if (access_token) {
        await dispatch(logout());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("fullName");
        localStorage.removeItem("rzp_device_id");
        localStorage.removeItem("rzp_checkout_anon_id");
        localStorage.removeItem("email");
        setLogoutState(false);
        navigate("/login");
        window.location.reload();
      } else {
        console.error("Access Token not found in localStorage");
      }
    } catch (error) {
      console.log("Error in logout", error);
    }
  };

  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleUploadModalOpen = () => {
    setShowUploadModal(true);
  };

  // Update onDrop function to set profileImageUrl
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        const access_token = localStorage.getItem("accessToken");

        if (access_token) {
          if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file.");
            return;
          }
          setConversionLoading(true);
          await dispatch(uploadImage({ image: file, token: access_token }));
          if (file.type === "image/heic" || file.type === "image/heif") {
            await convertAndSetProfileImage(file);
            window.location.reload();
          } else {
            setProfileImageUrl(URL.createObjectURL(file));
          }
          setShowUploadModal(false);
          setConversionLoading(false);
        } else {
          console.error("Access Token not found in localStorage");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setConversionLoading(false); // End conversion loading
      }
    }
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/gif": [],
      "image/bmp": [],
      "image/webp": [],
      "image/heic": [],
      "image/heif": [],
    },
  });

  const webcamRef = useRef<Webcam>(null);
  const [captureClicked, setCaptureClicked] = useState(false);

  const captureImage = useCallback(async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        try {
          const access_token = localStorage.getItem("accessToken");

          if (access_token) {
            const blob = await fetch(imageSrc).then((res) => res.blob());

            // Create a File object from the Blob
            const file = new File([blob], "webcam_capture.png", {
              type: "image/png",
            });
            setConversionLoading(true); // Start conversion loading
            await dispatch(uploadImage({ image: file, token: access_token }));
            setProfileImageUrl(URL.createObjectURL(file));
            setShowUploadModal(false);
          } else {
            console.error("Access Token not found in localStorage");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        } finally {
          setConversionLoading(false);
        }
      }
    }
  }, []);

  const handleCaptureClick = () => {
    if (captureClicked) {
      captureImage();
    } else {
      setCaptureClicked(true);
    }
  };
  const [userDetailsError, setuserDetailsError] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");

  useEffect(() => {
    if (!userData && !loading) {
      dispatch(fetchUserData())
        .unwrap()
        .then((userData) => {
          setFullName(userData.data.full_name);
          setEmail(userData.data.email);
          const profileImageUrl = userData.data.profile_image_url ?? "";
          console.log(profileImageUrl);

          if (
            profileImageUrl.endsWith(".heic") ||
            profileImageUrl.endsWith(".heif")
          ) {
            // Convert HEIC/HEIF image to PNG
            convertAndSetProfileImage(profileImageUrl);
          } else {
            setProfileImageUrl(profileImageUrl);
          }
        })
        .catch((err) => {
          setuserDetailsError(
            err.message || "An error occurred while fetching user data.",
          );
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get("tab");
    if (tab) {
      setActiveItem(tab);
      handleItemClick(tab);
    }
  }, [location.search]);

  async function convertAndSetProfileImage(url: any) {
    try {
      setConversionLoading(true);
      // Fetch the image blob
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }
      const blob = await response.blob();

      // Convert blob to PNG format
      const convertedBlob = await heic2any({
        blob,
        toType: "image/png", // Convert to PNG format
      });

      //@ts-expect-error Create a temporary URL for the converted Blob
      const convertedUrl = URL.createObjectURL(convertedBlob);

      // Set the converted image URL
      setProfileImageUrl(convertedUrl);
      setConversionLoading(false);
    } catch (error) {
      console.error("Error converting HEIC/HEIF image:", error);
      // Handle error
    } finally {
      setConversionLoading(false);
    }
  }

  useEffect(() => {
    if (userData) {
      setFullName(userData.data.full_name);
      setEmail(userData.data.email);
      setProfileImageUrl(userData.data.profile_image_url ?? "");
    }
  }, [userData]);

  useEffect(() => {
    async function fetchAndConvertProfileImage() {
      const profileImageUrl = userData.data.profile_image_url ?? "";
      if (
        profileImageUrl.endsWith(".heic") ||
        profileImageUrl.endsWith(".heif")
      ) {
        // Convert HEIC/HEIF image to PNG
        await convertAndSetProfileImage(profileImageUrl);
      } else {
        setProfileImageUrl(profileImageUrl);
      }
    }
    fetchAndConvertProfileImage();
  }, []);
  return (
    <Box component="div" sx={{ height: "100%" }}>
      <Paper
        style={{
          padding: "5px",
          position: "relative",
          borderRadius: 16,
          height: "95vh",
        }}
      >
        {/* Header */}
        <Box
          component="div"
          sx={{
            display: "flex",
            padding: "20px",
            alignItems: "center",
            borderBottom: "2px solid #EAEBF4",
          }}
        >
          <img
            onClick={() => {
              navigate("/");
            }}
            src={Images.LOGO}
            alt="Logo"
            style={{ width: "150px", height: "auto", cursor: "pointer" }}
          />
        </Box>

        {/* User Profile */}
        {userDetailsError && (
          <Typography color="error">{userDetailsError}</Typography>
        )}
        {loading && !userData ? (
          <Box
            component="div"
            sx={{
              padding: "20px",
              display: "flex",
              flexDirection: "horizontal",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={20} />
          </Box>
        ) : (
          <Box
            component="div"
            sx={{ padding: "20px", display: "flex", alignItems: "center" }}
          >
            <Box
              component="div"
              sx={{ position: "relative", marginRight: "10px" }}
            >
              {profileImageUrl ? (
                conversionLoading ? (
                  <CircularProgress />
                ) : (
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                    }}
                  />
                )
              ) : (
                <AccountCircle sx={{ fontSize: "40px" }} />
              )}
              <Button
                onClick={handleUploadModalOpen}
                sx={{
                  position: "absolute",
                  bottom: "-5px",
                  right: "0px",
                  background: "#2E368E",
                  color: "#FFF",
                  borderRadius: "50%",
                  width: "26px",
                  height: "24px",
                  minWidth: "0",
                  "&:hover": {
                    backgroundColor: "#2E368E",
                    border: "1px solid #2E368E",
                  },
                }}
                style={{ fontWeight: 500, textTransform: "none" }}
              >
                +
              </Button>
              {showUploadModal && (
                <Backdrop
                  open={showUploadModal}
                  onClick={() => setShowUploadModal(false)}
                  style={{ zIndex: 999 }}
                >
                  <Box
                    component="div"
                    sx={{
                      width: "356px",
                      position: "fixed",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 9999,
                      textAlign: "center",
                      padding: "24px, 24px, 12px, 24px",
                      borderRadius: "12px",
                    }}
                    onClick={(event: any) => event.stopPropagation()}
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
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: "700",
                          fontSize: "20px",
                          marginBottom: "0",
                        }}
                        gutterBottom
                      >
                        Select Mode
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: "600",
                          fontSize: "14px",
                          color: "#484848",
                        }}
                        gutterBottom
                      >
                        Chose one option to capture or upload profile image.
                      </Typography>
                      <div {...getRootProps()}>
                        <input
                          {...getInputProps()}
                          style={{ display: "none" }}
                          type="file"
                          accept=".glb,.gltf,.usdz"
                        />
                        <Button variant="contained" color="primary" fullWidth>
                          Upload
                        </Button>
                      </div>
                      <Typography>
                        {captureClicked && (
                          <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/png"
                            style={{
                              width: "100%",
                              borderRadius: "8px",
                              marginBottom: "20px",
                            }}
                          />
                        )}
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{
                            backgroundColor: "#FFF",
                            color: "#2E368E",
                            border: "1px solid #2E368E",
                            fontWeight: 600,
                            "&:hover": {
                              backgroundColor: "#FFF",
                              color: "#2E368E",
                              border: "1px solid #2E368E",
                            },
                          }}
                          onClick={handleCaptureClick}
                        >
                          {captureClicked ? "Capture Image" : "Capture"}
                        </Button>
                      </Typography>
                    </Paper>
                  </Box>
                </Backdrop>
              )}
            </Box>
            <Box component="div">
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {fullName}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  overflowWrap: "anywhere",
                  fontWeight: 400,
                  fontFamily: "OpenSans",
                }}
              >
                {email}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Navigation */}
        <List
          sx={{
            padding: "0 20px",
            marginTop: "20px",
            fontFamily: "OpenSans",
            fontWeight: 400,
          }}
        >
          <ListItem
            button
            onClick={() => handleItemClick("account")}
            sx={{
              borderRadius: "8px",
              backgroundColor: activeItem === "account" ? "#2E368E" : "#F7F8FB",
              color: activeItem === "account" ? "#FFF" : "",
              display: "flex", // Ensure the ListItem contents are displayed as flex
              alignItems: "center", // Align items vertically
              justifyContent: "space-between", // Space between items
              "&:hover": {
                backgroundColor:
                  activeItem === "account" ? "#2E368E" : "#F7F8FB",
              },
            }}
          >
            <Grid container alignItems="center">
              <ListItemIcon>
                <img
                  src={Images.SIDEBAR_ACCOUNT_DETAILS}
                  alt="Arrow"
                  style={{
                    filter: activeItem === "account" ? "invert(100%)" : "",
                  }}
                />
              </ListItemIcon>
              <Typography
                variant="body1"
                sx={{ fontFamily: "OpenSans", fontWeight: 600 }}
              >
                Account Details
              </Typography>
            </Grid>
            <img
              src={Images.ARROW}
              alt="Arrow"
              style={{ filter: activeItem === "account" ? "invert(100%)" : "" }}
            />
          </ListItem>
          <ListItem
            button
            onClick={() => handleItemClick("notifications")}
            sx={{
              borderRadius: "8px",
              marginTop: "10px",
              backgroundColor:
                activeItem === "notifications" ? "#2E368E" : "#F7F8FB",
              color: activeItem === "notifications" ? "#FFF" : "",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              "&:hover": {
                backgroundColor:
                  activeItem === "notifications" ? "#2E368E" : "#F7F8FB",
              },
            }}
          >
            <Grid container alignItems="center">
              <ListItemIcon>
                <img
                  src={Images.SIDEBAR_NOTIFICATION}
                  alt="Arrow"
                  style={{
                    filter:
                      activeItem === "notifications" ? "invert(100%)" : "",
                  }}
                />
              </ListItemIcon>
              <Typography
                variant="body1"
                sx={{ fontFamily: "OpenSans", fontWeight: 600 }}
              >
                Notifications
              </Typography>
            </Grid>
            <img
              src={Images.ARROW}
              alt="Arrow"
              style={{
                filter: activeItem === "notifications" ? "invert(100%)" : "",
              }}
            />
          </ListItem>

          <ListItem
            button
            onClick={() => handleItemClick("help")}
            sx={{
              borderRadius: "8px",
              marginTop: "10px",
              backgroundColor: activeItem === "help" ? "#2E368E" : "#F7F8FB",
              color: activeItem === "help" ? "#FFF" : "",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              "&:hover": {
                backgroundColor: activeItem === "help" ? "#2E368E" : "#F7F8FB",
              },
            }}
          >
            <Grid container alignItems="center">
              <ListItemIcon>
                <img
                  src={Images.SIDEBAR_HELP}
                  alt="Arrow"
                  style={{
                    filter: activeItem === "help" ? "invert(100%)" : "",
                  }}
                />
              </ListItemIcon>
              <Typography
                variant="body1"
                sx={{ fontFamily: "OpenSans", fontWeight: 600 }}
              >
                Help Center
              </Typography>
            </Grid>
            <img
              src={Images.ARROW}
              alt="Arrow"
              style={{ filter: activeItem === "help" ? "invert(100%)" : "" }}
            />
          </ListItem>

          <ListItem
            button
            onClick={() => handleItemClick("billing")}
            sx={{
              borderRadius: "8px",
              marginTop: "10px",
              backgroundColor: activeItem === "billing" ? "#2E368E" : "#F7F8FB",
              color: activeItem === "billing" ? "#FFF" : "",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              "&:hover": {
                backgroundColor:
                  activeItem === "billing" ? "#2E368E" : "#F7F8FB",
              },
            }}
          >
            <Grid container alignItems="center">
              <ListItemIcon>
                <img
                  src={Images.SIDEBAR_BILLING}
                  alt="Arrow"
                  style={{
                    filter: activeItem === "billing" ? "invert(100%)" : "",
                  }}
                />
              </ListItemIcon>
              <Typography
                variant="body1"
                sx={{ fontFamily: "OpenSans", fontWeight: 600 }}
              >
                Billing Details
              </Typography>
            </Grid>
            <img
              src={Images.ARROW}
              alt="Arrow"
              style={{ filter: activeItem === "billing" ? "invert(100%)" : "" }}
            />
          </ListItem>

          <ListItem
            button
            onClick={() => handleItemClick("referral")}
            sx={{
              borderRadius: "8px",
              marginTop: "10px",
              backgroundColor:
                activeItem === "referral" ? "#2E368E" : "#F7F8FB",
              color: activeItem === "referral" ? "#FFF" : "",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              "&:hover": {
                backgroundColor:
                  activeItem === "referral" ? "#2E368E" : "#F7F8FB",
              },
            }}
          >
            <Grid container alignItems="center">
              <ListItemIcon>
                <img
                  src={Images.SIDEBAR_REFERRAL}
                  alt="Arrow"
                  style={{
                    filter: activeItem === "referral" ? "invert(100%)" : "",
                  }}
                />
              </ListItemIcon>
              <Typography
                variant="body1"
                sx={{ fontFamily: "OpenSans", fontWeight: 600 }}
              >
                Referral Program
              </Typography>
            </Grid>
            <img
              src={Images.ARROW}
              alt="Arrow"
              style={{
                filter: activeItem === "referral" ? "invert(100%)" : "",
              }}
            />
          </ListItem>
        </List>

        {/* Logout Button */}
        <Box
          component="div"
          sx={{
            textAlign: "center",
            padding: "0 20px",
            marginTop: "20px",
            position: "absolute",
            width: "85%",
            bottom: "20px",
          }}
        >
          <Button
            onClick={() => setLogoutState(true)}
            variant="contained"
            color="secondary"
            startIcon={<Logout />}
            sx={{
              backgroundColor: "#F7F8FB",
              color: "#000",
              borderRadius: "8px",
              width: "100%",
            }}
            style={{ fontWeight: 600, textTransform: "none" }}
          >
            Log out
          </Button>
        </Box>
        {logoutState && (
          <Backdrop open={logoutState} style={{ zIndex: 999 }}>
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
                padding: "24px, 24px, 12px, 24px",
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
                  }}
                >
                  <img
                    src={Images.LOGOUT}
                    alt="Logout"
                    style={{ width: 25, height: 25 }}
                  />
                </Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "700", fontSize: "20px" }}
                  gutterBottom
                >
                  Are you sure you want to Logout?
                </Typography>
                <Box component="div" sx={{ display: "flex", gap: "16px" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => setLogoutState(false)}
                    style={{ fontWeight: 500, textTransform: "none" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleLogout}
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
                    style={{ fontWeight: 500, textTransform: "none" }}
                  >
                    Logout
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Backdrop>
        )}
      </Paper>
    </Box>
  );
};

export default Sidebar;
