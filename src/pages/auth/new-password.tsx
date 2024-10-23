import AppButton from "@components/app_button";
import CommonTextField from "@components/app_textfield";
import { useAppDispatch } from "@hooks/redux-hooks";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Grid, IconButton, Paper, Typography } from "@mui/material";
import { forgotPasswordChangePassword } from "@slices/authSlice";
import { ChangeEvent, FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "src/store";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { validatePassword } from "@utils/validationUtils";

function CreatePassword({ onBack }: { onBack: () => void }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { status, error, token } = useSelector(
    (state: RootState) => state.auth,
  );

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = password === confirmPassword;

    if (!isConfirmPasswordValid) {
      toast.error("Passwords don't match");
    }
    if (!isPasswordValid) {
      toast.error("Enter Valid Password");
    }

    try {
      if (isPasswordValid && isConfirmPasswordValid) {
        await dispatch(
          forgotPasswordChangePassword({
            new_password: password,
            token: token || "",
          }),
        );
        // Redirect to login page after successful password change
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
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
          <IconButton
            color="primary"
            aria-label="back"
            size="small"
            onClick={onBack}
            sx={{ display: "flex", color: "black", alignItems: "center" }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <Typography
            variant="h5"
            align="left"
            color="black"
            gutterBottom
            sx={{ fontWeight: 700, fontSize: "24px" }}
          >
            Create Password
          </Typography>
        </Grid>
        <Typography
          align="left"
          gutterBottom
          style={{ fontWeight: 400, fontSize: "14px", fontFamily: "OpenSans" }}
        >
          Enter new password and confirm new password.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid item xs={12}>
            <CommonTextField
              label="New Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              hintText="Enter New Password"
            />
          </Grid>

          <Grid item xs={12}>
            <CommonTextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              hintText="Confirm New Password"
            />
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
                textTransform: "none",
                fontWeight: 400,
                fontFamily: "OpenSans",
              }}
            >
              Confirm
            </AppButton>
          </Grid>
          {status === "failed" && (
            <Typography align="center" color="error" gutterBottom>
              {error}
            </Typography>
          )}
        </form>
      </Paper>
    </Grid>
  );
}

export default CreatePassword;
