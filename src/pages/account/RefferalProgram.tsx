// RefferalProgram.tsx
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Images } from "@constants/imageConstants";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Backdrop, Divider, Paper } from "@mui/material";
import { toast } from "react-toastify";
import copy from "copy-to-clipboard";
import { useNavigate } from "react-router-dom";
import { RootState } from "src/store";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@hooks/redux-hooks";
import { fetchUserData } from "@slices/userSlice";

const RefferalProgram = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const { userData } = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  // const referralLink = userData?.data?.referral_link;
  // const shareText = `🎉 Exciting News! 🎉
  // Get ₹500 off your next purchase at XenCapture with my exclusive referral code: ${userData?.data?.referral_code}. Click the link below to claim your discount!

  // ${referralLink}

  // Details:
  // - INR 50 will be added to your cart when each referred person makes their first purchase
  // - The referred person gets INR 100 off on their first purchase
  // `;
  // const emailSubject = `🎉 Exclusive Referral Code:  ${userData?.data?.referral_code} 🎉`;
  const handleClose = () => {
    navigate("/account/?tab=account");
    setIsOpen(false);
  };
  useEffect(() => {
    if (!userData) {
      dispatch(fetchUserData());
    }
  }, [userData, dispatch]);
  useEffect(() => {
    toast.info("Click on the Code to Copy it !");
  }, []);
  // const handleShare = (platform: string) => {
  //   let url = "";
  //   switch (platform) {
  //     case "slack":
  //       url = `https://slack.com/intl/en-in/share?text=${shareText}`;
  //       break;
  //     case "email":
  //       url = `https://mail.google.com/mail/?view=cm&fs=1&to=&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(shareText)}`;
  //       break;
  //     case "sms":
  //       url = `sms:?&body=${shareText}`;
  //       break;
  //     case "instagram":
  //       navigator.clipboard.writeText(shareText).then(() => {
  //         toast.success("Copied the referral code, share it on Instagram!");
  //       });
  //       return;
  //     case "whatsapp":
  //       url = `https://api.whatsapp.com/send?text=${shareText}`;
  //       break;
  //     default:
  //       return;
  //   }
  //   window.open(url, "_blank");
  // };

  const handleCopyLink = () => {
    const success = copy(userData?.data?.referral_link);
    if (success) {
      toast.success("Link Copied Successfully.");
    } else {
      toast.error("Failed to copy the link.");
    }
  };

  const handleCopyCode = (code: string) => {
    return () => {
      navigator.clipboard
        .writeText(code)
        .then(() => {
          toast.success("Code Copied Successfully");
          console.log("Code copied to clipboard:", code);
        })
        .catch((error) => {
          console.error("Error copying code:", error);
        });
    };
  };

  return (
    <Backdrop open={isOpen} style={{ zIndex: 999 }}>
      <Box
        component="div"
        sx={{
          width: "530px",
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
            padding: "24px",
            backgroundColor: "WHITE",
            color: "#000",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            component="div"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <Typography sx={{ fontWeight: "700", fontSize: "20px" }}>
              Referral Program
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider variant="fullWidth" />
          {/* <Box
            component="div"
            sx={{
              height: "228px",
              display: "flex",
              flexDirection: "column",
              borderRadius: "12px",
              backgroundColor: "#2E368E",
              justifyContent: "space-between",
              padding: "15px",
              alignItems: "center",
              marginTop: "14px",
            }}
          >
            <Box
              component="div"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "center",
                justifyItems: "center",
                alignContent: "center",

                marginTop: "10px",
                borderRadius: "12px",
                padding: "15px",
              }}
            >
              <img
                src={Images.REFERRAL_PROGRAM}
                style={{ width: "120.62px", height: "111px" }}
              />
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  fontFamily: "OpenSans",
                  fontWeight: 600,
                  color: "white",
                  textAlign: "left",
                }}
              >
                {"REFER AND EARN, FLAT ₹500 OFF"}
              </Typography>
              <Box
                component="div"
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  backgroundColor: "#FFFFFF",
                  justifyContent: "center",
                  alignItems: "center",
                  justifyItems: "center",
                  alignContent: "center",
                  borderRadius: "8px",
                  padding: "6px 12px",
                }}
              >
                <Typography
                  variant="body2"
                  color="#2E368E"
                  sx={{
                    fontFamily: "OpenSans",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  {"CODE: XEN2024"}
                </Typography>
              </Box>
            </Box>
          </Box> */}
          <Box
            component="div"
            sx={{
              height: "228px",
              display: "flex",
              flexDirection: "column",
              borderRadius: "12px",
              backgroundColor: "#2E368E",
              justifyContent: "space-between",
              padding: "15px",
              alignItems: "center",
              marginTop: "14px",
              textAlign: "start",
            }}
          >
            <Box
              component="div"
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "-71px",
              }}
            >
              <Box component="div">
                <Typography
                  sx={{
                    fontFamily: "OpenSans",
                    fontWeight: "500",
                    fontSize: "24px",
                    color: "#fff",
                    marginTop: "-1rem",
                  }}
                >
                  REFER and EARN
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "OpenSans",
                    fontWeight: "500",
                    fontSize: "24px",
                    color: "#F58220",
                    marginTop: "1rem",
                  }}
                >
                  Get INR 50
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "OpenSans",
                    fontWeight: "400",
                    fontSize: "14px",
                    color: "#fff",
                  }}
                >
                  For Every Person You Refer!
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "OpenSans",
                    fontWeight: "600",
                    fontSize: "22px",
                    color: "#F58220",
                    marginTop: "1rem",
                    cursor: "pointer",
                  }}
                  title="Click to Copy Code"
                  onClick={handleCopyCode(userData?.data?.referral_code)}
                >
                  {" "}
                  <span style={{ color: "#fff" }}> CODE:</span>{" "}
                  {userData?.data?.referral_code}
                </Typography>
              </Box>
              <Box
                component="div"
                sx={{
                  marginRight: "-45px",
                }}
              >
                <img
                  src={Images.REFERRAL_PROGRAM}
                  style={{ width: "305.62px", height: "324px" }}
                />
              </Box>
            </Box>
            <Box
              component="div"
              sx={{
                fontFamily: "OpenSans",
                fontWeight: "500",
                fontSize: "10px",
                color: "#D9D9D9B2",
                marginTop: "-5rem",
                textAlign: "start",
                marginLeft: "-24px",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "OpenSans",
                  fontWeight: "500",
                  fontSize: "10px",
                  color: "#D9D9D9B2",
                }}
              >
                Details:
              </Typography>
              <li>
                INR 50 will be added to your cart when each referred person
                makes their first purchase
              </li>
              <li>
                The referred person gets INR 100 off on their first purchase
              </li>
            </Box>
          </Box>
          <Box
            component="div"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              justifyItems: "center",
              alignContent: "center",

              marginTop: "14px",
              backgroundColor: "white",
              borderRadius: "12px",
            }}
          >
            <Box
              component="div"
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              {/* <Box
                component="div"
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <img
                  src={Images.SLACK}
                  style={{
                    width: "60.5px",
                    height: "60.5px",
                    cursor: "pointer",
                    paddingBottom: "6px",
                  }}
                  alt="Slack"
                  onClick={() => handleShare("slack")}
                />
                <Typography
                  variant="body2"
                  color="#484848"
                  sx={{
                    fontFamily: "OpenSans",
                    fontWeight: 400,
                    fontSize: "12px",
                    color: "303030",
                  }}
                >
                  {"Slack"}
                </Typography>
              </Box> */}
              {/* <Box
                component="div"
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <img
                  src={Images.EMAIL}
                  style={{
                    width: "60.5px",
                    height: "60.5px",
                    cursor: "pointer",
                    paddingBottom: "6px",
                  }}
                  alt="Slack"
                  onClick={() => handleShare("email")}
                />
                <Typography
                  variant="body2"
                  color="#484848"
                  sx={{
                    fontFamily: "OpenSans",
                    fontWeight: 400,
                    fontSize: "12px",
                    color: "303030",
                  }}
                >
                  Email
                </Typography>
              </Box> */}
              {/* <Box
                component="div"
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <img
                  src={Images.MESSAGE}
                  style={{
                    width: "60.5px",
                    height: "60.5px",
                    cursor: "pointer",
                    paddingBottom: "6px",
                  }}
                  alt="Slack"
                  onClick={() => handleShare("sms")}
                />
                <Typography
                  variant="body2"
                  color="#484848"
                  sx={{
                    fontFamily: "OpenSans",
                    fontWeight: 400,
                    fontSize: "12px",
                    paddingBottom: "6px",
                    color: "303030",
                  }}
                >
                  {"Messages"}
                </Typography>
              </Box> */}
              {/* <Box
                component="div"
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <img
                  src={Images.INSTAGRAM}
                  style={{
                    width: "60.5px",
                    height: "60.5px",
                    cursor: "pointer",
                    paddingBottom: "6px",
                  }}
                  alt="Instagram"
                  onClick={() => handleShare("instagram")}
                />
                <Typography
                  variant="body2"
                  color="#484848"
                  sx={{
                    fontFamily: "OpenSans",
                    fontWeight: 400,
                    fontSize: "12px",
                    color: "303030",
                  }}
                >
                  {"Instagram"}
                </Typography>
              </Box> */}
              {/* <Box
                component="div"
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <img
                  src={Images.WHATSAPP}
                  style={{
                    width: "60.5px",
                    height: "60.5px",
                    cursor: "pointer",
                    paddingBottom: "6px",
                  }}
                  alt="Whatsapp"
                  onClick={() => handleShare("whatsapp")}
                />
                <Typography
                  variant="body2"
                  color="#484848"
                  sx={{
                    fontFamily: "OpenSans",
                    fontWeight: 400,
                    fontSize: "12px",
                    color: "303030",
                  }}
                >
                  {"Whatsapp"}
                </Typography>
              </Box> */}
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleCopyLink}
              style={{ marginTop: "20px" }}
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: "#EAEBF4",
                color: "#2E368E",
                border: "1px solid #bdc0db",
                boxShadow: "none",
                borderRadius: "8px",
                padding: "14px",
                "&:hover": {
                  backgroundColor: "#FFF",
                  color: "#2E368E",
                  border: "1px solid #bdc0db",
                  boxShadow: "none",
                },
                fontFamily: "OpenSans",
                fontWeight: 600,
                fontSize: "16px",
                textTransform: "none",
              }}
            >
              Copy Link
              <img
                src={Images.COPY}
                style={{
                  width: "32px",
                  height: "26px",
                }}
                alt="Copy"
              />
            </Button>
          </Box>
        </Paper>
      </Box>
    </Backdrop>
  );
};

export default RefferalProgram;
