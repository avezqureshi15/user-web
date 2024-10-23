import AppButton from "@components/app_button";
import CommonTextField from "@components/app_textfield";
import { Images } from "@constants/imageConstants";
import { useAppDispatch } from "@hooks/redux-hooks";
import { Badge, Box, Grid, IconButton, Typography } from "@mui/material";
import { fetchUserData, saveAccountDetails } from "@slices/userSlice";
import { validateEmail } from "@utils/validationUtils";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { toast } from "react-toastify";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "@slices/notificationSlice";
import { fetchCartDetails } from "@slices/projectSlice";
import NotificationsModal from "@components/notifications";
import { useNavigate } from "react-router-dom";
interface Notification {
  id: string;
  title: string;
  description: string;
  created_at: Date;
  is_selected: boolean;
  is_read: boolean;
}
function AccountDetailsEdit({
  handleShowAccountDetail,
}: {
  handleShowAccountDetail: () => void;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  //const [companyName, setCompanyName] = useState(" ");
  //const [gstNo, setGstNo] = useState("");
  const [fullName, setFullName] = useState("");
  const { userData, loading } = useSelector((state: RootState) => state.user);
  const [nameError, setNameError] = useState<string | null>(null);
  const [isUnchanged, setIsUnchanged] = useState(false);
  const [initialFullName, setInitialFullName] = useState("");
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

  console.log(loading);
  useEffect(() => {
    if (!userData) {
      dispatch(fetchUserData());
    } else {
      // Set initial values from userData
      const { full_name, email } = userData.data;
      setFullName(full_name);
      setInitialFullName(full_name);
      setEmail(email);
    }
  }, [userData, dispatch]);

  const handleFullNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^[a-zA-Z\s-]*$/.test(value)) {
      setFullName(value);
      setNameError(null);
      setIsUnchanged(value !== initialFullName);
    } else {
      setNameError("Name must contain only letters, spaces, and hyphens");
    }
  };

  const handleAccountDetailsSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (fullName.trim() === "") {
      toast.error("Name cannot be empty");
    } else if (!nameError && isUnchanged) {
      try {
        await dispatch(
          saveAccountDetails({
            fullName,
          }),
        );
        await dispatch(fetchUserData());
        handleShowAccountDetail();
      } catch (error) {
        console.error("Error saving account details:", error);
      }
    } else {
      toast.error("No fields have been changed.");
    }
  };

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
            Edit Account Details
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
        onSubmit={handleAccountDetailsSubmit}
        style={{ width: 390, height: 608, fontSize: "12px" }}
      >
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={12}>
            <CommonTextField
              label="Full Name"
              value={fullName}
              onChange={handleFullNameChange}
              hintText="Enter Full Name"
            />
          </Grid>
          <Grid item xs={12}>
            <CommonTextField
              label="Email"
              value={email}
              hintText="Enter Email"
              validator={validateEmail}
              validationErrorMessage="Invalid email format"
              disabled
            />
          </Grid>
          <Grid item xs={12} textAlign="center">
            <AppButton
              loading={loading}
              variant="contained"
              fullWidth
              type="submit"
            >
              Save
            </AppButton>
          </Grid>
        </Grid>
      </form>
    </>
  );
}

export default AccountDetailsEdit;
