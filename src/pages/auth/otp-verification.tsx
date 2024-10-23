import AppButton from "@components/app_button";
import { useAppDispatch } from "@hooks/redux-hooks";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { verifyOTP } from "@slices/authSlice";
import { ChangeEvent, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { useNavigate } from "react-router-dom";
import { Images } from "@constants/imageConstants";
import { resendOTP } from "@slices/authSlice";
import { toast } from "react-toastify";
interface OTPVerificationProps {
  onEditClick?: () => void;
}
function OTPVerification({ onEditClick }: OTPVerificationProps) {
  const dispatch = useAppDispatch();
  const { email_id, status } = useSelector((state: RootState) => state.auth);
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
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    if (
      e.key === "Backspace" &&
      !e.currentTarget.value &&
      index > 0 &&
      otpFields[index - 1]?.current
    ) {
      const previousInput = otpFields[index - 1]?.current;
      if (previousInput) {
        previousInput.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otp = otpFields.map((field) => field.current?.value || "").join("");
    console.log("Entered OTP:", otp);
    try {
      await dispatch(
        verifyOTP({
          otp: otp,
          email_id: email_id || "",
        }),
      ).unwrap();
    } catch (e) {
      console.error(e);
    }
  };
  const handleResendOTP = () => {
    resendOTP(email_id);
    toast.success("OTP sent Successfully");
  };

  const navigate = useNavigate();
  const handleArrowClick = () => {
    navigate(-1);
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
        <Grid container item alignItems="center">
          <Grid item>
            <IconButton
              sx={{ alignItems: "center", display: "flex", padding: "2px" }}
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
              align="left"
              gutterBottom
              sx={{ fontWeight: 700, fontSize: "24px" }}
            >
              Verification
            </Typography>
          </Grid>
        </Grid>
        <Typography
          align="left"
          gutterBottom
          style={{
            marginBottom: "0px",
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
          marginTop={1}
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
          <IconButton onClick={onEditClick} aria-label="Edit email">
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
                    style: {
                      textAlign: "center",
                      paddingLeft: 0,
                      paddingRight: 0,
                      height: "15px",
                    },
                    onKeyDown: (e) => handleKeyDown(e, index),
                  }}
                  onChange={(e) => handleChange(e, index)}
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
          <AppButton
            loading={status === "loading"}
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
            Verify and Login
          </AppButton>
        </form>
      </Paper>
    </Grid>
  );
}

export default OTPVerification;
