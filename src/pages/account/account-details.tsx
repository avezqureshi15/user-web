import CommonTextField from "@components/app_textfield";
import { Images } from "@constants/imageConstants";
import {
  Box,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Backdrop,
  Badge,
  Paper,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { deleteUser } from "@slices/authSlice";
import { useAppDispatch } from "@hooks/redux-hooks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

function AccountDetailsView({
  handleShowEditFormClick,
  handleShowPasswordFormClick,
}: {
  handleShowEditFormClick: () => void;
  handleShowPasswordFormClick: () => void;
}) {
  const { userData } = useSelector((state: RootState) => state.user);
  const [deleteUserState, setDeleteUserState] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [markAllAsRead, setMarkAllAsRead] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      if (userData && userData?.data && userData?.data?.id) {
        const userId = userData.data.id;
        await dispatch(deleteUser(userId));
        navigate("/login");
        window.location.reload();
      } else {
        console.error("User data or user ID not available");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

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
      fetchingNotifications();
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

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

  useEffect(() => {
    fetchingNotifications();
    const interval = setInterval(() => {
      fetchingNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Box
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "2px solid #EAEBF4",
          marginBottom: "20px",
          marginTop: "-5px",
          paddingBottom: "7px",
        }}
      >
        <Box component="div" sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h6"
            align="left"
            gutterBottom
            sx={{ margin: "5px", fontWeight: 500, color: "#000" }}
          >
            Account Details
          </Typography>
          <IconButton
            onClick={handleShowEditFormClick}
            sx={{
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <Typography
              color="secondary"
              onClick={handleShowEditFormClick}
              sx={{
                backgroundColor: "#F7F8FB",
                color: "#2E368E",
                borderRadius: "8px",
                width: "100%",
                padding: "6px",
                paddingLeft: "14px",
                paddingRight: "14px",
                fontSize: "14px",
                fontWeight: 400,
              }}
              style={{ fontWeight: 400 }}
            >
              Edit
              <img
                src={Images.EDIT_ICON}
                style={{ height: 15, width: 15, marginLeft: 8 }}
              />
            </Typography>
          </IconButton>
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
      </Box>
      <form style={{ width: 390, height: "75vh", fontSize: "12px" }}>
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={12}>
            <CommonTextField
              label="Full Name"
              value={userData?.data.full_name || ""}
              hintText="Full Name"
              disabled={true}
            />
          </Grid>
          <Grid item xs={12}>
            <CommonTextField
              label="Email"
              value={userData?.data.email || ""}
              hintText="Email"
              disabled={true}
            />
          </Grid>
          <Grid item xs={12}>
            <List>
              <ListItem button onClick={handleShowPasswordFormClick}>
                <ListItemIcon>
                  <img
                    src={Images.PASSWORD_ACCOUNT}
                    alt="Password"
                    style={{ width: 20, height: 20 }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        fontsize: "14px",
                        fontWeight: 600,
                        fontFamily: "OpenSans",
                      }}
                    >
                      {" "}
                      Change password{" "}
                    </Typography>
                  }
                />
                <img src={Images.ARROW} alt="Arrow" />
              </ListItem>
              <ListItem button onClick={() => setDeleteUserState(true)}>
                <ListItemIcon>
                  <img
                    src={Images.DELETE_ICON}
                    alt="DeleteIcon"
                    style={{ width: 20, height: 20 }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      sx={{
                        fontsize: "14px",
                        fontWeight: 600,
                        fontFamily: "OpenSans",
                      }}
                    >
                      {" "}
                      Delete Account{" "}
                    </Typography>
                  }
                />
                <img src={Images.ARROW} alt="Arrow" />
              </ListItem>
              {deleteUserState && (
                <Backdrop open={deleteUserState} style={{ zIndex: 999 }}>
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
                      padding: "24px, 24px, 12px, 24px",
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
                      <Box
                        component="div"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={Images.DELETE_ICON_RED}
                          alt="Logout"
                          style={{ width: 25, height: 25, color: "red" }}
                        />
                      </Box>
                      <Typography
                        sx={{ fontWeight: "700", fontSize: "20px" }}
                        gutterBottom
                      >
                        Would you like to Delete Account?
                      </Typography>
                      <Typography variant="body2" color="#484848" gutterBottom>
                        By clicking Delete, your account will be deleted
                        permanently.
                      </Typography>
                      <Box
                        component="div"
                        sx={{ display: "flex", gap: "16px" }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={() => setDeleteUserState(false)}
                          sx={{
                            marginRight: "10px",
                            color: "#fff !important",
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleDeleteAccount}
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
                          Delete
                        </Button>
                      </Box>
                    </Paper>
                  </Box>
                </Backdrop>
              )}
            </List>
          </Grid>
        </Grid>
      </form>
    </>
  );
}

export default AccountDetailsView;
