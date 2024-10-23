import { Images } from "@constants/imageConstants";
import { Box, IconButton, Typography, Badge } from "@mui/material";
import { useEffect, useState } from "react";
import NotificationsModal from "@components/notifications";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@hooks/redux-hooks";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "@slices/notificationSlice";
import { fetchCartDetails } from "@slices/projectSlice";
interface Notification {
  id: string;
  title: string;
  description: string;
  created_at: Date;
  is_selected: boolean;
  is_read: boolean;
}
const AccountHeader = ({
  heading,
  isEditable,
  onEditClick,
  editState,
}: any) => {
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useAppDispatch();
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

  const navigate = useNavigate();

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
          paddingBottom: onEditClick ? "3px" : "3px",
        }}
      >
        <Box component="div" sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h6"
            align="left"
            gutterBottom
            sx={{
              margin: "5px",
              fontWeight: 500,
              color: "#000",
              marginBottom: "12px",
            }}
          >
            {heading}
          </Typography>

          {isEditable && (
            <IconButton
              onClick={() => onEditClick()}
              sx={{
                "&:hover": {
                  backgroundColor: "transparent", // Remove the background color change on hover
                },
              }}
            >
              <Typography
                color="secondary"
                onClick={() => {}}
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
                {!editState ? "Edit" : "Save"}
                <img
                  src={Images.EDIT_ICON}
                  style={{ height: 15, width: 15, marginLeft: 8 }}
                />
              </Typography>
            </IconButton>
          )}
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
    </>
  );
};

export default AccountHeader;
