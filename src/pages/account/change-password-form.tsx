import AppButton from "@components/app_button";
import CommonTextField from "@components/app_textfield";
import { Images } from "@constants/imageConstants";
import { useAppDispatch } from "@hooks/redux-hooks";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  Typography,
  Backdrop,
  Badge,
} from "@mui/material";
import { forgotPasswordChangePassword } from "@slices/authSlice";
import { validatePassword } from "@utils/validationUtils";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { logout } from "@slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import NotificationsModal from "@components/notifications";
import { fetchCartDetails } from "@slices/projectSlice";
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
const PasswordForm = ({
  handleShowAccountDetail,
}: {
  handleShowAccountDetail: () => void;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [reEnterPasswordError, setReEnterPasswordError] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const isPasswordValid = password.length >= 8;
  const isReEnterPasswordValid = reEnterPassword.length >= 8;
  const isSaveEnabled = isPasswordValid && isReEnterPasswordValid;
  const [openModal, setOpenModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [markAllAsRead, setMarkAllAsRead] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // Function to update the notification count
  const updateNotificationCount = (count: number) => {
    setNotificationCount(count);
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
        console.log(notificationsData);
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
    fetchingNotifications();
  }, [dispatch]);

  const { status, token } = useSelector((state: RootState) => state.auth);

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
    } else {
      setPasswordError("");
    }
  };

  const handleReEnterPasswordChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const newReEnterPassword = event.target.value;
    setReEnterPassword(newReEnterPassword);
    if (newReEnterPassword.length < 8) {
      setReEnterPasswordError("Password must be at least 8 characters long");
    } else {
      setReEnterPasswordError("");
    }
  };

  const handleLogout = async () => {
    try {
      const access_token = localStorage.getItem("accessToken");

      if (access_token) {
        await dispatch(logout());
        navigate(`/login`);
        window.location.reload();
      } else {
        console.error("Access Token not found in localStorage");
      }
    } catch (error) {
      console.log("Error in logout", error);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (reEnterPassword !== password) {
      setPasswordError("Passwords don't match");
      toast.error("Passwords don't match");
      return;
    } else {
      try {
        await dispatch(
          forgotPasswordChangePassword({
            new_password: password,
            token: token || "",
          }),
        );

        // Handle success
        setOpenSnackBar(true);
        setPassword("");
        setReEnterPassword("");
      } catch (error) {
        // Handle error
        console.error("Error changing password:", error);
      }
      setPasswordError("");
    }
  };

  // Event handlers for password input fields

  return (
    <>
      <Box
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "2px solid #EAEBF4",
          padding: "10px",
          marginBottom: "50px",
          marginTop: "-10px",
        }}
      >
        <Box
          component="div"
          sx={{ display: "flex", alignItems: "center", marginLeft: "-19px" }}
        >
          <IconButton onClick={handleShowAccountDetail}>
            <img
              src={Images.LEFT_ARROW}
              alt="Arrow"
              style={{ width: 20, height: 20 }}
            />
          </IconButton>
          <Typography
            variant="h6"
            align="left"
            gutterBottom
            sx={{ margin: "5px", fontWeight: 500, color: "#000" }}
          >
            Change Password
          </Typography>
        </Box>
        <Box
          component="div"
          sx={{ display: "flex", alignItems: "center", gap: "10px" }}
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
            <NotificationsModal
              open={openModal}
              onClose={() => setOpenModal(false)}
              markAllAsRead={markAllAsRead}
              updateNotificationCount={updateNotificationCount}
            />
          </Badge>
          <Badge badgeContent={cartCount} color="error">
            <IconButton sx={{ background: "#F7F8FB" }}>
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
      </Box>
      <form
        onSubmit={handlePasswordSubmit}
        style={{ width: 390, height: 608, fontSize: "12px" }}
      >
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={12}>
            <CommonTextField
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              hintText="Enter Password"
              validator={validatePassword}
              validationErrorMessage={passwordError}
            />
          </Grid>
          <Grid item xs={12}>
            <CommonTextField
              label="Reenter Password"
              type="password"
              value={reEnterPassword}
              onChange={handleReEnterPasswordChange}
              hintText="Reenter Password"
              validator={validatePassword}
              validationErrorMessage={reEnterPasswordError}
            />
          </Grid>
          <Grid item xs={12}>
            <AppButton
              loading={status === "loading"}
              variant="contained"
              fullWidth
              type="submit"
              disabled={!isSaveEnabled}
            >
              Save
            </AppButton>
          </Grid>
          {openSnackBar && (
            <>
              {/* Backdrop */}
              <Backdrop
                open={openSnackBar}
                sx={{
                  zIndex: 9998,
                  color: "#fff",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }} // semi-transparent black color
              />
              {/* Snackbar box */}
              <Box
                component="div"
                sx={{
                  width: "300px",
                  position: "fixed",
                  left: "50%",
                  top: "50%",
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
                  }}
                >
                  <img src={Images.GREEN_TICK} alt="Green Tick" />
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "700", fontSize: "20px" }}
                    gutterBottom
                  >
                    Password changed successfully
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleLogout}
                  >
                    Login
                  </Button>
                </Paper>
              </Box>
            </>
          )}
        </Grid>
      </form>
    </>
  );
};

export default PasswordForm;
