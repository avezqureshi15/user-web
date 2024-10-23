import { Box, Typography, Paper } from "@mui/material";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";
import { URLS } from "@constants/urlConstants";
import Switch from "@mui/material/Switch";
import AccountHeader from "@components/accountHeader";

export default function NotificationSettings() {
  const [isModelCompletionChecked, setIsModelCompletionChecked] =
    useState(false);
  // const [isTeamActivityChecked, setIsTeamActivityChecked] = useState(false);
  // const [isTeamMemberChecked, setIsTeamMemberChecked] = useState(false);
  const [isSupportTicketChecked, setIsSupportTicketChecked] = useState(false);
  console.log(isSupportTicketChecked);
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get(URLS.USER_PREFERENCES);
        const data = response.data;
        console.log("User preferences data: ", data.data);
        setIsModelCompletionChecked(data.data.model_generation);
        setIsSupportTicketChecked(data.data.support_ticket);
      } catch (error) {
        console.error("There was a problem with the axios request:", error);
      }
    };

    fetchSettings();
  }, []);

  const patchRequest = async (setting: any, value: any) => {
    try {
      const response = await axiosInstance.patch(URLS.USER_PREFERENCES, {
        [setting]: value,
      });
      console.log(response.data);
    } catch (error) {
      console.error("There was a problem with the axios request:", error);
    }
  };

  const handleToggleModelCompletionChange = () => {
    const newValue = !isModelCompletionChecked;
    setIsModelCompletionChecked(newValue);
    patchRequest("model_generation", newValue);
  };

  // const handleToggleSupportTicketChange = () => {
  //   const newValue = !isSupportTicketChecked;
  //   setIsSupportTicketChecked(newValue);
  //   patchRequest("support_ticket", newValue);
  // };

  return (
    <Paper
      style={{
        padding: 16,
        borderRadius: 16,
        height: "95%",
        width: "94%",
        marginTop: "4px",
      }}
    >
      <AccountHeader heading="Notification Settings" isEditable={false} />

      <Box
        component="div"
        sx={{
          width: "390px",
          display: "flex",
          gap: "16px",
          flexDirection: "column",
          top: "10px",
          position: "relative",
          left: "10px",
        }}
      >
        <Box
          component="div"
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              color: "#242424",
              fontFamily: "OpenSans",
              lineHeight: "20px",
            }}
          >
            Model Completion
          </Typography>
          <Switch
            checked={isModelCompletionChecked}
            onChange={handleToggleModelCompletionChange}
          />
        </Box>

        {/* <Box
          component="div"
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              color: "#242424",
              fontFamily: "OpenSans",
              lineHeight: "20px",
            }}
          >
            Support Ticket
          </Typography>
          <Switch
            checked={isSupportTicketChecked}
            onChange={handleToggleSupportTicketChange}
          />
        </Box> */}
      </Box>
    </Paper>
  );
}
