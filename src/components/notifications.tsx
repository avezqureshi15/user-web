import React, { useState, useEffect } from "react";
import {
  Backdrop,
  Box,
  IconButton,
  Typography,
  List,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NotificationItem from "./notificationsItem";
import { Images } from "@constants/imageConstants";
import { useAppDispatch } from "@hooks/redux-hooks";
import {
  fetchNotifications,
  deleteNotifications,
} from "@slices/notificationSlice";
import { NavLink } from "react-router-dom";

interface Notification {
  id: string;
  title: string;
  description: string;
  created_at: Date;
  is_selected: boolean;
  is_read: boolean;
  type?: string;
  model_id?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  updateNotificationCount: (count: number) => void;
  markAllAsRead: boolean;
}
const NotificationsModal: React.FC<Props> = ({
  open,
  onClose,
  updateNotificationCount,
  markAllAsRead,
}: Props) => {
  const dispatch = useAppDispatch();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  useEffect(() => {
    fetchingNotifications();
    // const interval = setInterval(() => {
    // fetchingNotifications();

    // return () => clearInterval(interval);
  }, []);

  const fetchingNotifications = async () => {
    try {
      const response = await dispatch(fetchNotifications());
      if (response.meta.requestStatus === "fulfilled") {
        const notificationsData: Notification[] =
          response.payload as Notification[];
        setNotifications(notificationsData);
        let notificationsCount = notificationsData.filter(
          (notif) => !notif.is_read,
        );
        updateNotificationCount(notificationsCount.length);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleSelectAll = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      is_selected: !selectAllChecked,
    }));
    setNotifications(updatedNotifications);
    setSelectAllChecked(!selectAllChecked);
  };

  const handleSelect = (id: string) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id
        ? {
            ...notification,
            is_selected: !notification.is_selected,
            is_read: true,
          }
        : notification,
    );
    setNotifications(updatedNotifications);
    let notificationsCount = updatedNotifications.filter(
      (notif) => !notif.is_read,
    );
    updateNotificationCount(notificationsCount.length);
  };

  const handleDeleteSelected = async () => {
    const selectedIds = notifications
      .filter((notification) => notification.is_selected)
      .map((notification) => notification.id);
    try {
      await dispatch(deleteNotifications(selectedIds));
      const updatedNotifications = notifications.filter(
        (notification) => !notification.is_selected,
      );
      setNotifications(updatedNotifications);
      setSelectAllChecked(false);
      let notificationsCount = updatedNotifications.filter(
        (notif) => !notif.is_read,
      );
      updateNotificationCount(notificationsCount.length);
    } catch (error) {
      console.error("Error deleting notifications:", error);
    }
  };

  const selectedCount = notifications.filter((n) => n.is_selected).length;

  return (
    <Backdrop open={open} onClick={onClose} style={{ zIndex: 1201 }}>
      <Box
        component="div"
        sx={{
          position: "fixed",
          bgcolor: "white",
          p: "20px",
          borderRadius: "12px",
          boxShadow: 3,
          maxWidth: "100%",
          width: "400px",
          height: "auto",
          maxHeight: "400px",
          overflowY: "auto",
          top: "55px",
          right: "90px",
        }}
        onClick={(e: any) => e.stopPropagation()}
      >
        <Box
          component="div"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ marginBottom: "12px" }}
        >
          <Typography variant="h6" color="#000">
            Notifications
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        {notifications.length === 0 ? (
          <Box
            component="div"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <img
              src={Images.NO_NOTIFICATIONS}
              alt="No notifications"
              style={{ marginLeft: "25px", width: "165px" }}
            />
            <Typography
              sx={{
                fontFamily: "OpenSans",
                fontWeight: 700,
                fontSize: "18px",
                margin: "1rem",
                color: "#303030",
              }}
            >
              No Notifications Yet
            </Typography>
            <Typography
              sx={{
                fontFamily: "OpenSans",
                fontWeight: 500,
                fontSize: "14px",
                margin: "1rem",
                marginTop: "0",
                color: "gray",
                textAlign: "center",
              }}
            >
              Make sure you have turned on nofications from{" "}
              <NavLink to="/account/?tab=notifications">settings</NavLink>
            </Typography>
          </Box>
        ) : (
          <>
            <Box
              component="div"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#242424",
                  fontFamily: "OpenSans",
                  fontSize: "14px",
                  fontWeight: 400,
                }}
              >
                {selectAllChecked
                  ? `${selectedCount} selected`
                  : `Total ${notifications.length}`}
              </Typography>
              <Box component="div" display="flex" sx={{ gap: "5px" }}>
                <Box
                  component="div"
                  display="flex"
                  alignItems="center"
                  sx={{
                    borderRadius: "8px",
                    paddingRight: "14px",
                    backgroundColor: "#F7F8FB",
                  }}
                >
                  <Checkbox
                    checked={selectAllChecked}
                    onChange={handleSelectAll}
                  />
                  <Typography
                    variant="body2"
                    onClick={handleSelectAll}
                    sx={{
                      cursor: "pointer",
                      color: "#484848",
                      fontFamily: "OpenSans",
                      fontSize: "14px",
                      fontWeight: 400,
                    }}
                  >
                    Select all
                  </Typography>
                </Box>
                {selectedCount > 0 && (
                  <IconButton
                    onClick={handleDeleteSelected}
                    color="error"
                    sx={{
                      borderRadius: "8px",
                      padding: "4px",
                      backgroundColor: "#F7F8FB",
                      paddingRight: "8px",
                      paddingLeft: "8px",
                    }}
                  >
                    <img src={Images.DELETE_ICON_BLUE} />
                  </IconButton>
                )}
              </Box>
            </Box>
            <List dense>
              {notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <NotificationItem
                    notification={notification}
                    onSelect={handleSelect}
                    selectionMode={selectAllChecked}
                    markAllAsRead={markAllAsRead}
                    notificationRead={handleSelect}
                  />
                </React.Fragment>
              ))}
            </List>
          </>
        )}
      </Box>
    </Backdrop>
  );
};

export default NotificationsModal;
