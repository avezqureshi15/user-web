import AppButton from "@components/app_button";
import CommonTextField from "@components/app_textfield";
import { useAppDispatch } from "@hooks/redux-hooks";
import { Grid, Paper, Typography, IconButton } from "@mui/material";
import { forgotPasswordOTP } from "@slices/authSlice";
import { ChangeEvent, FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import AuthBackground from "./auth-bg";
import ForgotPasswordOTPVerification from "./forgotPasswordOTP";
import CreatePassword from "./new-password";
import { useNavigate } from "react-router-dom";
import { Images } from "@constants/imageConstants";

function ResetPassword() {
  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  let content;
  switch (activeStep) {
    case 0:
      content = <ForgotPassword onNext={handleNext} />;
      break;
    case 1:
      content = (
        <ForgotPasswordOTPVerification
          onNext={handleNext}
          onBack={handleBack}
        />
      );
      break;
    case 2:
      content = <CreatePassword onBack={handleBack} />;
      break;
    default:
      content = null;
  }

  return <AuthBackground>{content}</AuthBackground>;
}

export default ResetPassword;

function ForgotPassword({ onNext }: { onNext: () => void }) {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const { status } = useSelector((state: RootState) => state.auth);
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Email:", email);
    if (email) {
      try {
        await dispatch(
          forgotPasswordOTP({
            login_id: email,
          }),
        ).unwrap();
        onNext();
      } catch (e) {
        console.log(e);
      }
    }
  };

  const navigate = useNavigate();
  const handleArrowClick = () => {
    navigate(-1);
  };

  return (
    <>
      <Grid item xs={12} sm={8} md={6} lg={3} style={{ zIndex: 2 }}>
        <Paper
          elevation={3}
          style={{
            padding: 30,
            borderRadius: 16,
            width: "320px",
            position: "relative",
            right: "100px",
          }}
        >
          <Grid container item alignItems="center">
            <Grid item>
              <IconButton
                sx={{ alignItems: "center", display: "flex" }}
                onClick={handleArrowClick}
              >
                <img
                  src={Images.LEFT_ARROW}
                  alt="back"
                  style={{ paddingBottom: "10px" }}
                />
              </IconButton>
            </Grid>
            <Grid item>
              <Typography
                variant="h5"
                align="left"
                gutterBottom
                sx={{ fontWeight: 700, fontSize: "24px" }}
              >
                Reset Password
              </Typography>
            </Grid>
          </Grid>
          <Typography
            align="left"
            gutterBottom
            sx={{ fontWeight: 400, fontSize: "14px", fontFamily: "OpenSans" }}
          >
            Enter your registered Email ID to send a verification link to create
            new password.
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid
              container
              spacing={2}
              justifyContent="center"
              paddingTop={"10px"}
            >
              <Grid item xs={12}>
                <CommonTextField
                  label="Email"
                  value={email}
                  onChange={handleEmailChange}
                  hintText="Enter Email"
                />
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              paddingTop={"10px"}
              style={{ textAlign: "center" }}
            >
              <AppButton
                loading={status === "loading"}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{
                  borderRadius: "8px",
                  fontWeight: 400,
                  fontSize: "16px",
                  textTransform: "none",
                  fontFamily: "OpenSans",
                }}
              >
                Continue
              </AppButton>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </>
  );
}
