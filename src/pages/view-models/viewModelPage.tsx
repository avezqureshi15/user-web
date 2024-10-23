import { useLocation } from "react-router-dom";
import ViewModel from "./viewModel";
import { Images } from "@constants/imageConstants";
import { IconButton, Box, Badge } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import NotificationsModal from "@components/notifications";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@hooks/redux-hooks";
import { fetchCartDetails, shareModelViaEmail } from "@slices/projectSlice";
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
const ViewModelPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [markAllAsRead, setMarkAllAsRead] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

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
  }, [dispatch]);

  const location = useLocation();
  const state = location.state || {};
  const searchParams = new URLSearchParams(location.search);

  const name = state.name || searchParams.get("name");
  const date = state.date || searchParams.get("date");
  const time = state.time || searchParams.get("time");
  const id = state.id || searchParams.get("id");
  const imageUrl = state.imageUrl;
  const estimatedTime = state.estimatedTime;
  useEffect(() => {
    const shareModel = async () => {
      try {
        await dispatch(shareModelViaEmail(id));
      } catch (error) {
        console.log("Share modal via email:", error);
      }
    };
    if (searchParams.size) {
      shareModel();
    }
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Box component="div" sx={{ flexGrow: 1 }}>
            <img
              onClick={() => {
                navigate("/");
              }}
              src={Images.LOGO}
              alt="Logo"
              style={{ width: "150px", height: "auto", cursor: "pointer" }}
            />
          </Box>
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
      <ViewModel
        name={name}
        date={date}
        time={time}
        id={id}
        imageUrl={imageUrl}
        estimatedTime={estimatedTime}
      />
    </>
  );
};

export default ViewModelPage;
