import { Images } from "@constants/imageConstants";
import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepIndicator from "./stepIndicator";

const Onboarding = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleStepClick = (stepIndex: number) => {
    setActiveStep(stepIndex);
  };

  const steps: string[] = ["Step 1", "Step 2", "Step 3"];
  const videos: string[] = [
    Images.ONBOARD_VIDEO_1,
    Images.ONBOARD_VIDEO_2,
    Images.ONBOARD_VIDEO_3,
  ];
  const mainHeading: string[] = [
    "Digitize Your Reality",
    "Capture.Create.Collaborate.",
    "Enable Visual Experiences",
  ];
  const descriptions: string[] = [
    "Create 3D models of real-world objects in minutes using AI.",
    "Use your phone's camera to scan objects and transform them into dynamic 3D models.",
    "Engage your customers with interactive 3D models using XenCapture.",
  ];

  const handleVideoEnd = () => {
    if (activeStep < steps.length - 1) {
      handleNextStep();
      playNextVideo();
    }
  };

  const playNextVideo = () => {
    const video = document.getElementById(
      "onboarding-video",
    ) as HTMLVideoElement;
    if (video && activeStep < videos.length) {
      video.src = videos[activeStep];
      video.play();
    }
  };
  const handleSignUpClick = () => {
    // Navigate to login page when Sign Up button is clicked
    navigate("/signup");
  };
  const handleLogInClick = () => {
    // Navigate to login page when Sign Up button is clicked
    navigate("/login");
  };

  return (
    <Box
      component="div"
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bgcolor="#F5F5F5"
    >
      <Paper
        elevation={1}
        style={{
          width: "430px", // Set the width to 30% of the screen
          height: "90%",
          borderRadius: 16,
          overflow: "hidden",
          paddingBottom: "20px",
        }}
      >
        <Grid container justifyContent="center" alignItems="center">
          <Box component="div" textAlign="center" sx={{ width: "100%" }}>
            {/* Video Element */}
            <Box
              component="div"
              width="100%"
              height="50vh"
              maxWidth="100%"
              style={{
                position: "relative",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                overflow: "hidden",
              }}
            >
              <video
                id="onboarding-video"
                src={videos[activeStep]}
                autoPlay
                onEnded={handleVideoEnd}
                muted
                style={{
                  width: "100%", // Set width to 100%
                  height: "100%",
                  position: "relative",
                  zIndex: 2,
                  objectFit: "cover", // Add objectFit property here
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(to bottom, rgba(255, 255, 255, 0),rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))",
                  zIndex: 3,
                }}
              ></div>
            </Box>
            {/* Content Wrapper */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "24px",
              }}
            >
              <Box component="div" sx={{ width: "300px" }}>
                {/* Heading */}
                <Typography
                  gutterBottom
                  sx={{
                    fontFamily: "Comfortaa",
                    fontWeight: 400,
                    lineHeight: "32px",
                    letterSpacing: "-0.02em",
                    textAlign: "left",
                    color: "#2E3192",
                    fontSize: "32px",
                    position: "absolute",
                    top: "52%",
                    left: "46%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 3,
                    paddingBottom: "20px",
                  }}
                >
                  XenCapture
                </Typography>

                {/* Subheading */}
                <Typography
                  variant="h2"
                  gutterBottom
                  sx={{
                    lineHeight: "28px",
                    fontWeight: 700,
                    textAlign: "justify",
                    color: "#242424",
                    fontSize: "24px",
                  }}
                >
                  {mainHeading[activeStep]}
                </Typography>
                {/* Text Description */}
                <Typography
                  sx={{
                    textAlign: "left",
                    color: "grey",
                    fontSize: "16px",
                    fontFamily: "OpenSans",
                    fontWeight: 400,
                    width: "320px",
                    height: "40px",
                  }}
                >
                  {descriptions[activeStep]}
                </Typography>
              </Box>
            </div>
          </Box>
        </Grid>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
            marginBottom: "30px",
          }}
        >
          <StepIndicator
            totalSteps={steps.length}
            activeStep={activeStep}
            onClickStep={handleStepClick}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "70%",
              justifyContent: "space-between",
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSignUpClick}
              style={{
                flex: 1,
                marginRight: "13px",
                padding: "8px",
                backgroundColor: "white",
                textTransform: "none",
                fontWeight: 600,
                fontFamily: "OpenSans",
                border: "1px solid #2E368E",
              }}
            >
              Sign Up
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleLogInClick}
              style={{
                flex: 1,
                padding: "8px",
                textTransform: "none",
                fontFamily: "OpenSans",
                fontWeight: 600,
              }}
            >
              Log In
            </Button>
          </div>
        </div>
      </Paper>
    </Box>
  );
};

export default Onboarding;
