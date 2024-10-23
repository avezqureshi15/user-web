import AppButton from "@components/app_button";
import { useAppDispatch } from "@hooks/redux-hooks";
import { Box, Grid, TextField, Typography } from "@mui/material";
import { verifyOTP } from "@slices/authSlice";
import { ChangeEvent, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store";

function ChangePasswordOTP({
  handleNextChangePassword,
}: {
  handleNextChangePassword: () => void;
}) {
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
      handleNextChangePassword();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Box component="div" sx={{ width: "30vw" }}>
      <Typography variant="h4" align="left" gutterBottom>
        Verification
      </Typography>
      <Typography align="left" gutterBottom style={{ fontSize: "0.8rem" }}>
        Enter 6 digits OTP sent on your registered email
      </Typography>
      <Typography
        align="left"
        gutterBottom
        paddingTop={"10px"}
        paddingBottom={"10px"}
      >
        Enter OTP
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {Array.from({ length: 6 }, (_, index) => (
            <Grid item xs={2} key={index}>
              <TextField
                inputRef={otpFields[index]}
                variant="outlined"
                fullWidth
                autoFocus={index === 0}
                inputProps={{
                  maxLength: 1,
                  inputMode: "numeric",
                  style: { textAlign: "center" },
                  onKeyDown: (e) => handleKeyDown(e, index),
                }}
                onChange={(e) => handleChange(e, index)}
              />
            </Grid>
          ))}
        </Grid>
        <AppButton
          loading={status === "loading"}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: 20 }}
        >
          Verify
        </AppButton>
      </form>
    </Box>
  );
}

export default ChangePasswordOTP;
