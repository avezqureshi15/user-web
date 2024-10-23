import { useEffect, useState } from "react";
import {
  Checkbox,
  Typography,
  ListItem,
  ListItemIcon,
  Box,
} from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import { markNotificationAsRead } from "@slices/notificationSlice";
import { useAppDispatch } from "@hooks/redux-hooks";
import { Images } from "@constants/imageConstants";
import { useNavigate } from "react-router-dom";
interface Notification {
  id: string;
  title: string;
  description: string;
  created_at: Date;
  is_selected: boolean;
  is_read: boolean;
  preview?: string;
  type?: string;
  model_id?: string;
}

interface NotificationItemProps {
  notification: Notification;
  onSelect: (id: string) => void;
  selectionMode: boolean;
  markAllAsRead: boolean;
  notificationRead: (id: string) => void;
}

const NotificationItem = ({
  notification,
  onSelect,
  markAllAsRead,
  selectionMode,
  notificationRead,
}: NotificationItemProps) => {
  const dispatch = useAppDispatch();
  const [isRead, setIsRead] = useState(notification.is_read);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const handleToggle = () => {
    onSelect(notification.id);
  };

  useEffect(() => {
    if (markAllAsRead) {
      setIsRead(true); // Mark all notifications as read locally
    }
  }, [markAllAsRead]);

  const formatTimestamp = (createdAt: Date) => {
    const distance = formatDistanceToNow(createdAt, {
      addSuffix: true,
    });
    return distance;
  };

  const handleNotificationClick = () => {
    if (!isRead) {
      setIsRead(true);
      dispatch(markNotificationAsRead(notification.id));
      notificationRead(notification.id);
    }
    if (notification?.type === "Model Generation") {
      navigate("/view-model", {
        state: {
          name: notification?.title.split(" - ")[1],
          date: new Date(notification?.created_at).toISOString().split("T")[0],
          time: new Date(
            new Date(notification?.created_at).setHours(
              new Date(notification?.created_at).getHours() + 5,
              new Date(notification?.created_at).getMinutes() + 30,
            ),
          )
            .toISOString()
            .split("T")[1]
            .split(".")[0],
          id: notification?.model_id,
        },
      });
    }
  };

  function truncateString(input: string, value: number): string {
    if (input.length > value && !isHovered) {
      return input.slice(0, value) + "...";
    }
    return input;
  }

  return (
    <ListItem
      onClick={handleNotificationClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      secondaryAction={
        selectionMode ? (
          <Checkbox
            edge="end"
            onChange={handleToggle}
            checked={notification.is_selected}
            onClick={(event) => event.stopPropagation()}
          />
        ) : (
          !markAllAsRead &&
          !isRead && ( // Show the dot if not markAllAsRead and not isRead
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#1A76D2",
              }}
            />
          )
        )
      }
      disablePadding
      sx={{
        backgroundColor: "#F7F8FB",
        borderRadius: "12px",
        marginBottom: "8px",
        padding: "10px",
        cursor: "pointer",
        width: "97%",
        transition: "0.3s ease-in-out",
      }}
    >
      <ListItemIcon sx={{ minWidth: "0px" }}>
        <img
          src={
            notification.preview &&
            /\.(jpg|jpeg|png)$/i.test(notification.preview)
              ? notification.preview
              : Images.XENCAP_MOBILE2
          }
          alt=""
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
        />
      </ListItemIcon>
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          marginLeft: "10px",
        }}
      >
        <Typography
          sx={{
            fontFamily: "OpenSans",
            fontSize: "14px",
            fontWeight: 600,
            color: "black",
            overflow: isHovered ? "visible" : "hidden",
            whiteSpace: isHovered ? "normal" : "normal",
            wordWrap: "break-word",
            wordBreak: "break-all",
            maxWidth: "100%",
          }}
        >
          {truncateString(notification.title, 40)}
        </Typography>
        <Typography
          sx={{
            fontFamily: "OpenSans",
            fontSize: "12px",
            fontWeight: 400,
            color: "black",
            overflow: isHovered ? "visible" : "hidden",
            whiteSpace: isHovered ? "normal" : "normal",
            wordWrap: "break-word",
            wordBreak: "break-all",
            maxWidth: selectionMode ? "240px" : "100%",
          }}
        >
          {truncateString(notification.description, 43)}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: "OpenSans",
            fontSize: "10px",
            fontWeight: 300,
            color: "#303030",
            marginTop: "4px",
          }}
        >
          {formatTimestamp(notification.created_at)}
        </Typography>
      </Box>
    </ListItem>
  );
};

export default NotificationItem;
