import { useAppDispatch } from "@hooks/redux-hooks";
import {
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { forgotPasswordOTPVerify, forgotPasswordOTP } from "@slices/authSlice";
import { ChangeEvent, KeyboardEvent, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import EditIcon from "@mui/icons-material/Edit";
import { Images } from "@constants/imageConstants";
function ForgotPasswordOTPVerification({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const dispatch = useAppDispatch();
  const { email_id } = useSelector((state: RootState) => state.auth);
  const otpFields = Array.from({ length: 6 }, () =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useRef<HTMLInputElement | null>(null),
  );

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (value && index < 5) {
      const nextIndex = index + 1;
      const nextInput = otpFields[nextIndex]?.current;
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    const value = e.currentTarget.value;
    if (e.key === "Backspace" && !value && index > 0) {
      const previousIndex = index - 1;
      const previousInput = otpFields[previousIndex]?.current;
      if (previousInput) {
        previousInput.focus();
      }
    }
  };

  const handleResendOTP = () => {
    dispatch(forgotPasswordOTP({ login_id: email_id || "" }));
    console.log("Resend OTP clicked");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otp = otpFields.map((field) => field.current?.value || "").join("");
    console.log("Entered OTP:", otp);
    try {
      await dispatch(
        forgotPasswordOTPVerify({
          otp: otp,
          login_id: email_id || "",
        }),
      ).unwrap();
      onNext();
    } catch (e) {
      console.error(e);
    }
  };

  return (
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
        <Grid
          container
          direction="row"
          justifyContent="start"
          alignItems="center"
          style={{ height: "100%" }}
        >
          {/* <IconButton
            color="primary"
            aria-label="back"
            size="small"
            onClick={onBack}
            sx={{
              display: "flex",
              color: "black",
              alignItems: "center",
              paddingBottom: "10px",
            }}
          >
            <ArrowBackIosIcon />
          </IconButton> */}
          <IconButton
            sx={{ alignItems: "center", display: "flex", padding: "2px" }}
            onClick={onBack}
          >
            <img
              src={Images.LEFT_ARROW}
              alt="back"
              style={{ paddingBottom: "10px" }}
            />
          </IconButton>

          <Typography
            variant="h4"
            align="left"
            color="black"
            gutterBottom
            sx={{ fontWeight: 700, fontSize: "24px" }}
          >
            Verification
          </Typography>
        </Grid>
        <Typography
          align="left"
          gutterBottom
          style={{
            fontSize: "14px",
            fontWeight: 400,
            fontFamily: "OpenSans",
            color: "#303030",
            lineHeight: "16px",
          }}
        >
          Enter 6 digits OTP sent on your registered email
        </Typography>
        <Box
          component="div"
          display="flex"
          alignItems="center"
          marginBottom={1}
        >
          <Typography
            align="left"
            variant="body1"
            sx={{
              fontWeight: 600,
              fontSize: "14px",
              fontFamily: "OpenSans",
              color: "#000",
            }}
          >
            {email_id}
          </Typography>
          <IconButton onClick={onBack} aria-label="Edit email">
            <EditIcon fontSize="small" style={{ color: "#2E368E" }} />
          </IconButton>
        </Box>
        <Typography
          align="left"
          gutterBottom
          paddingTop={"20px"}
          paddingBottom={"10px"}
          sx={{
            fontWeight: 600,
            fontSize: "14px",
            fontFamily: "OpenSans",
            color: "#000",
          }}
        >
          Enter OTP
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            {Array.from({ length: 6 }, (_, index) => (
              <Grid item xs={2} sm={2} md={2} lg={2} xl={2} key={index}>
                <TextField
                  inputRef={otpFields[index]}
                  placeholder="-"
                  variant="outlined"
                  fullWidth
                  autoFocus={index === 0}
                  inputProps={{
                    maxLength: 1,
                    inputMode: "numeric",
                    style: { textAlign: "center", height: "15px" },
                    onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                  onChange={(e) => handleChange(e, index)}
                  // style={{
                  //   width: "53px",
                  //   background: "#F9FAFB",
                  // }}
                />
              </Grid>
            ))}
          </Grid>
          <Box component="div" textAlign="left" marginTop={2}>
            <Typography
              variant="body2"
              align="left"
              sx={{
                fontWeight: 400,
                fontSize: "16px",
                fontFamily: "OpenSans",
                color: "#000",
                lineHeight: "20px",
              }}
            >
              Didn’t receive the OTP?
              <Button
                color="primary"
                size="small"
                onClick={handleResendOTP}
                sx={{
                  textTransform: "none",
                  padding: 0,
                  background: "none",
                  color: "#000",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  paddingLeft: "8px",
                }}
                style={{
                  fontWeight: 600,
                  fontSize: "16px",
                  lineHeight: "20px",
                  fontFamily: "OpenSans",
                  color: "#000",
                }}
              >
                Resend OTP
              </Button>
            </Typography>
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{
              fontWeight: 400,
              textTransform: "none",
              fontFamily: "OpenSans",
              fontSize: "14px",
              marginTop: 20,
            }}
          >
            Verify
          </Button>
        </form>
      </Paper>
    </Grid>
  );
}

export default ForgotPasswordOTPVerification;
