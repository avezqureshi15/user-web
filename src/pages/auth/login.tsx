import AppButton from "@components/app_button";
import { default as CommonTextField } from "@components/app_textfield";
import { Images } from "@constants/imageConstants";
import { useAppDispatch } from "@hooks/redux-hooks";
import {
  Button,
  // Checkbox,
  Divider,
  // FormControlLabel,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useGoogleLogin } from "@react-oauth/google";
import { googleLogin, login } from "@slices/authSlice";
import { validateEmail, validatePassword } from "@utils/validationUtils";
import { ChangeEvent, FormEvent, useState } from "react";
import AppleLogin from "react-apple-login";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "src/store";
import AuthBackground from "./auth-bg";
import { toast } from "react-toastify";
// import { green } from "@mui/material/colors";
function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [checked, setChecked] = useState(false);
  const { status } = useSelector((state: RootState) => state.auth);
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email && password) {
      // if (!checked) {
      //   toast.warning("Please accept Terms and Conditions to continue");
      //   return;
      // }
      try {
        await dispatch(
          login({
            login_id: email,
            password: password,
          }),
        ).unwrap();
      } catch (e) {
        console.error(e);
      }
    } else {
      toast.error("Please enter both email and password");
    }
  };


  const googleLoginFunc = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const accessToken = tokenResponse.access_token;
        await dispatch(googleLogin(accessToken));
      } catch (error) {
        console.error("Error during Google login:", error);
      }
    },
  });

  return (
    <AuthBackground>
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        lg={3}
        style={{ zIndex: 2, position: "fixed", right: "10px" }}
        sx={{
          "@media (max-width: 430px)": {
            position: "relative !important",
            paddingTop: '12rem ',
            marginTop: "0.5em"
          },
          "@media (max-width: 385px)": {
            position: "relative !important",
            right: '24px !important',
            marginTop: "0.5em"
          },
          "@media (max-width: 376px)": {
            position: "relative !important",
            right: '26px !important',
            marginTop: "0.5em"
          },
          "@media (max-width: 340px)": {
            position: "relative !important",
            right: "30px !important",
            marginTop: "0.5em"
          },
          "@media (max-width: 320px)": {
            position: "relative !important",
            right: "35px !important",
            marginTop: "0.5em"
          },

        }}
      >
        <Paper
          elevation={3}
          style={{
            padding: 30,
            borderRadius: 16,
            width: "400px",
            position: "relative",
            right: "120px",
          }}
          sx={{



            "@media (max-width: 599px)": {
              right: "50px !important ",
            },
            "@media (max-width: 530px)": {
              right: "20px !important ",
            },
            "@media (max-width: 495px)": {
              right: "4px !important ",
            },
            "@media (max-width: 435px)": {
              width: "345px !important ",
              right: "0px !important ",
            },
            "@media (max-width: 416px)": {
              width: "330px !important ",
            },
            "@media (max-width: 395px)": {
              width: "310px !important ",
            },
            "@media (max-width: 381px)": {
              width: "300px !important",
              right: "-17px !important"
            },
            "@media (max-width: 365px)": {
              width: "280px !important",
              right: "-20px !important",
            },
            "@media (max-width: 321px)": {
              width: "245px !important",
              right: "-28px !important",
            },
            "@media (max-width: 281px)": {
              width: "216px !important",
              right: "-23px !important",
            },

          }}
        >
          <Typography
            variant="h4"
            align="left"
            gutterBottom
            style={{
              fontFamily: "Comfortaa",
              fontWeight: "bold",
              fontSize: "24px",
              color: "#2E368E", // Change this to the desired color, for example, blue
            }}
          >
            XenCapture {"  "}
            {import.meta.env.VITE_REACT_APP_ENV?.toUpperCase() &&
              import.meta.env.VITE_REACT_APP_ENV !== "prod" && (
                <>{import.meta.env.VITE_REACT_APP_ENV.toUpperCase()}</>
              )}
          </Typography>
          <Grid
            container
            direction="row"
            justifyContent="start"
            alignItems="start"
            style={{ height: "100%" }}
          >
            <Typography
              variant="body1"
              align="left"
              gutterBottom
              sx={{ fontWeight: 700, fontSize: "24px" }}
            >
              Login
            </Typography>{" "}
          </Grid>
          <Typography
            align="left"
            gutterBottom
            sx={{
              fontWeight: 400, fontSize: "14px", fontFamily: "OpenSans",
              "@media (max-width: 430px)": {
                fontSize: "10px",
                lineHeight: '2'

              },
              "@media (max-width: 375px)": {
                fontSize: "9px",
              },
              "@media (max-width: 320px)": {
                fontSize: "8px",
              },
            }}
          >
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
                  validator={validateEmail}
                  validationErrorMessage="Invalid email format"
                />
              </Grid>
              <Grid item xs={12}>
                <CommonTextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  hintText="Enter Password"
                  validator={validatePassword}
                  validationErrorMessage="Password must be at least 8 characters long"
                />
              </Grid>
              <Grid container justifyContent="right">
                <Grid item xs={12} sm={8} md={6} lg={4} sx={{ textAlign: 'center' }} >
                  <Button
                    component={Link}
                    to="/forgotPassword"
                    color="primary"
                    size="small"
                    sx={{
                      textTransform: "none",
                      padding: 0,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "black",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                    style={{
                      fontFamily: "OpenSans",
                      fontWeight: 400,

                    }}
                  >
                    Forgot Password?
                  </Button>
                </Grid>
              </Grid>

              <Grid item xs={12} style={{ textAlign: "center" }}>
                <AppButton
                  loading={status === "loading"}
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ borderRadius: "8px", fontWeight: 400 }}
                  style={{
                    fontWeight: 400,
                    textTransform: "none",
                    fontFamily: "OpenSans",
                    fontSize: "14px",
                  }}
                >
                  Log In
                </AppButton>
              </Grid>
              <Grid container alignItems="center" padding={2}>
                <Grid item xs={5}>
                  <Divider />
                </Grid>
                <Grid item xs={2}>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center"
                  >
                    OR
                  </Typography>
                </Grid>
                <Grid item xs={5}>
                  <Divider />
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={() => googleLoginFunc()}
                  variant="outlined"
                  color="primary"
                  fullWidth
                  sx={{
                    backgroundColor: "#F9FAFB",
                    borderRadius: "12px",

                    borderColor: "#CCCCCC",
                    "& .MuiButton-startIcon": {
                      marginRight: 1,
                    },
                  }}
                  style={{
                    textTransform: "none",
                    color: "#848484",
                    fontWeight: 500,
                    fontSize: "14px",
                    fontFamily: "OpenSans",
                  }}
                  startIcon={
                    <img
                      src={Images.GOOGLE_ICON}
                      alt="Google"
                      style={{ width: 20, height: 20 }}
                    />
                  }
                >
                  Login with Google
                </Button>
              </Grid>
              <Grid item xs={12}>
                <AppleLogin
                  clientId={import.meta.env.VITE_REACT_APP_CLIENT_ID}
                  redirectURI={import.meta.env.VITE_REACT_APP_REDIRECT_URI}
                  responseType="code id_token"
                  responseMode="form_post"
                  state="origin:web"
                  scope="name email"
                  render={(renderProps) => (
                    <Button
                      onClick={renderProps.onClick}
                      variant="outlined"
                      color="primary"
                      fullWidth
                      sx={{
                        backgroundColor: "#F9FAFB",
                        borderColor: "#CCCCCC",
                        borderRadius: "12px",
                        "& .MuiButton-startIcon": {
                          marginRight: 1,
                        },
                      }}
                      style={{
                        textTransform: "none",
                        color: "#848484",
                        fontWeight: 500,
                        fontSize: "14px",
                        fontFamily: "OpenSans",
                      }}
                      startIcon={
                        <img
                          src={Images.APPLE_ICON}
                          alt="Apple"
                          style={{ width: 20, height: 20 }}
                        />
                      }
                    >
                      Login with Apple ID
                    </Button>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  align="center"
                  style={{
                    fontFamily: "OpenSans",
                    fontWeight: 400,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  Don’t have an account?&nbsp;
                  <div
                    onClick={() => {
                      navigate("/signup");
                    }}
                    style={{
                      fontFamily: "OpenSans",
                      fontWeight: 600,
                      color: "#2E368E",
                      textTransform: "none",
                      padding: 0,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      minWidth: "0px",
                    }}
                  >
                    Sign Up
                  </div>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </AuthBackground>
  );
}

export default Login;