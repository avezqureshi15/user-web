import CommonTextField from "@components/app_textfield";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";

function CreateAccountTeam() {
  const [email, setEmail] = useState("");
  const [fullName, setfullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checked, setChecked] = useState(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleFullName = (e: ChangeEvent<HTMLInputElement>) => {
    setfullName(e.target.value);
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setChecked(event.target.checked);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    if (!checked) {
      // Check if terms and conditions are accepted
      toast.warning("Please accept Terms and Conditions to continue");
      return; // Exit the function early if terms and conditions are not accepted
    }
  };

  return (
    <>
      <Grid item xs={12} sm={8} md={6} lg={3} style={{ zIndex: 2 }}>
        <Paper elevation={3} style={{ padding: 30, borderRadius: 16 }}>
          <Typography variant="h4" align="left" gutterBottom>
            XenCapture
          </Typography>

          <Typography
            variant="h5"
            align="left"
            gutterBottom
            style={{ fontWeight: "bold" }}
          >
            Create Account Team
          </Typography>

          <Typography align="left" gutterBottom style={{ fontSize: "0.8rem" }}>
            Enter your Email ID and Password below to access your account.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <CommonTextField
                  label="Email"
                  value={email}
                  onChange={handleEmailChange}
                  hintText="Enter Email"
                />
              </Grid>

              <Grid item xs={12}>
                <CommonTextField
                  label="Full Name"
                  value={fullName}
                  onChange={handleFullName}
                  hintText="Enter Name"
                />
              </Grid>

              <Grid item xs={12}>
                <CommonTextField
                  label="New Passowrd"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  hintText="Enter Password"
                />
              </Grid>

              <Grid item xs={12}>
                <CommonTextField
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  hintText="Enter Password"
                />
              </Grid>

              <Grid justifyContent="right" width="100vw" paddingLeft="20px">
                <FormControlLabel
                  control={
                    <Checkbox checked={checked} onChange={handleChange} />
                  }
                  label={
                    <Typography variant="body2" color="textSecondary">
                      I accept the{" "}
                      <Button
                        // component={Link}
                        href="#"
                        color="primary"
                        size="small"
                        sx={{
                          textTransform: "none",
                          padding: 0,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: "bold",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        Terms and Conditions
                      </Button>
                    </Typography>
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Create Account
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body2" align="center">
                  Already have an account?
                  <Button
                    href="#"
                    color="primary"
                    size="small"
                    sx={{
                      textTransform: "none",
                      padding: 0,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: "bold",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Sign in
                  </Button>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </>
  );
}

export default CreateAccountTeam;
