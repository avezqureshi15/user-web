import { useEffect, useState } from "react";
import MobileDetect from "mobile-detect";
import CommonTextField from "@components/app_textfield";
import { useAppDispatch } from "@hooks/redux-hooks";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { registerIndividual } from "@slices/authSlice";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "@utils/validationUtils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChangeEvent, FormEvent } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "src/store";
import { green } from "@mui/material/colors";
import { Images } from "@constants/imageConstants";
import AppleLogin from "react-apple-login";
import { useGoogleLogin } from "@react-oauth/google";
import { googleLogin } from "@slices/authSlice";

interface CreateAccountIndividualProps {
  onNext: () => void;
  onBack: () => void;
}

function CreateAccountIndividual({
  onNext,
  onBack,
}: CreateAccountIndividualProps) {
  const dispatch = useAppDispatch();
  const { status } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [checked, setChecked] = useState(false);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleFullNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handleReferralCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReferralCode(e.target.value);
  };

  const handleChange = (event: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => {
    setChecked(event.target.checked);
  };

  const handleTermsConditionsClick = () => {
    window.open("https://xencapture.com/termsofservice/", "_blank");
  };
  const handlePrivacyPolicyClick = () => {
    window.open("https://xencapture.com/privacy/", "_blank");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !fullName || !password || !confirmPassword) {
      toast.error("Please fill out all fields");
      return;
    }
    // Validate the form
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = password === confirmPassword;
    const isFullNameValid = validateName(fullName);

    if (!isConfirmPasswordValid) {
      toast.error("Passwords don't match");
      return;
    }

    if (!isFullNameValid) {
      toast.error("Invalid name format");
      return;
    }

    if (!checked) {
      toast.warning("Please accept Terms and Conditions to continue");
      return;
    }

    const formIsValid =
      isEmailValid &&
      isPasswordValid &&
      isConfirmPasswordValid &&
      isFullNameValid;

    if (formIsValid && checked) {
      try {
        await dispatch(
          registerIndividual({
            full_name: fullName,
            password: confirmPassword,
            login_id: email,
            referredby_code: referralCode,
          }),
        ).unwrap();
        onNext();
      } catch (e) {
        console.error(e);
      }
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

  useEffect(() => {
    const md = new MobileDetect(window.navigator.userAgent);

    // Check if referral code is present
    const urlParams = new URLSearchParams(window.location.search);
    const referredByCode = urlParams.get("referredby_code");

    if (referredByCode) {
      setReferralCode(referredByCode);
    }

    if (referredByCode && (md.is("iOS") || md.is("Android"))) {
      if (md.is("iOS")) {
        window.location.href =
          "https://apps.apple.com/us/app/xencapture/id6499211067";
      } else if (md.is("Android")) {
        window.location.href =
          "https://play.google.com/store/apps/details?id=com.xencapture.xenreality&pli=1";
      }
    }
  }, []);

  const handleButtonClick = () => {
    navigate("/login");
  };

  return (
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
            fontSize: "22px",
            color: "#2E368E",
          }}
        >
          XenCapture
        </Typography>
        <Grid
          container
          direction="row"
          justifyContent="start"
          alignItems="end"
          style={{ height: "100%" }}
        >
          <IconButton
            color="primary"
            aria-label="back"
            onClick={onBack}
            sx={{ display: "flex", alignItems: "center" }}
            style={{ color: "black", paddingBottom: "12px" }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          <Typography
            variant="h5"
            align="left"
            gutterBottom
            sx={{ fontWeight: 700, fontSize: "24px" }}
          >
            Create Account
          </Typography>
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
          <Grid container spacing={0.5} justifyContent="center">
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
                label="Full Name"
                value={fullName}
                onChange={handleFullNameChange}
                hintText="Enter Full Name"
                validator={validateName}
                validationErrorMessage="Invalid Name"
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
            <Grid item xs={12}>
              <CommonTextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                hintText="Enter Password"
                validator={validatePassword}
                validationErrorMessage="Password must be at least 8 characters long"
              />
            </Grid>
            <Grid item xs={12}>
              <CommonTextField
                label="Referral Code"
                type="text"
                value={referralCode}
                onChange={handleReferralCodeChange}
                hintText="Enter Referral Code"
                validationErrorMessage="Referral code must be valid"
              />
            </Grid>
            <Grid justifyContent="right" width="100vw" paddingLeft="20px">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    sx={{
                      paddingTop: "15px",
                      color: green[800],
                      "&.Mui-checked": {
                        color: green[600],
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ display: "flex", flexDirection: "row", fontSize: '12px' }}
                  >
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        paddingTop: "10px",
                        fontFamily: "OpenSans",
                        fontWeight: 400,
                        "@media (max-width: 435px)": {
                          fontSize: "9px !important ",
                        },

                      }}
                    >
                      I agree to the &nbsp;
                    </Typography>
                    <Box
                      component="div"
                      color="primary"
                      onClick={handleTermsConditionsClick}
                      sx={{
                        textTransform: "none",
                        padding: 0,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        paddingTop: "9px",
                        fontFamily: "OpenSans",
                        color: "#2E368E",
                        marginTop: "2px",
                        marginRight: "5px",
                        "@media (max-width: 435px)": {
                          fontSize: "9px !important ",
                        },
                      }}
                      style={{
                        fontWeight: 600,
                      }}
                    >
                      T&C
                    </Box>
                    <Box
                      component="div"
                      color="primary"
                      onClick={handlePrivacyPolicyClick}
                      sx={{
                        textTransform: "none",
                        padding: 0,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        paddingTop: "9px",
                        fontFamily: "OpenSans",
                        color: "#2E368E",
                        marginTop: "2px",
                        "@media (max-width: 435px)": {
                          fontSize: "9px !important ",
                        },
                      }}
                      style={{
                        fontWeight: 600,
                      }}
                    >
                      <span style={{ marginRight: "5px" }}>and</span>Privacy
                      Policy
                    </Box>
                  </Typography>
                }
              />
            </Grid>
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                textAlign: "center",
              }}
            >
              <Button
                disabled={status === "loading"}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{
                  fontWeight: 400,
                  textTransform: "none",
                  fontFamily: "OpenSans",
                  fontSize: "14px",
                }}
              >
                Create Account
              </Button>
            </Grid>

            <Grid
              item
              xs={2}
              sx={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                onClick={() => googleLoginFunc()}
                style={{
                  padding: "5px",
                  cursor: "pointer",
                }}
              // variant="outlined"
              // color="primary"
              // fullWidth
              // sx={{
              //   backgroundColor: "#F9FAFB",
              //   borderRadius: "12px",

              //   borderColor: "#CCCCCC",
              //   "& .MuiButton-startIcon": {
              //     marginRight: 1,
              //   },
              // }}
              // style={{
              //   textTransform: "none",
              //   color: "#848484",
              //   fontWeight: 500,
              //   fontSize: "14px",
              //   fontFamily: "OpenSans",
              // }}
              // startIcon={
              >
                <img
                  src={Images.GOOGLE_ICON}
                  alt="Google"
                  style={{
                    width: 20,
                    height: 20,
                    border: "2px solid #2E368E",
                    borderRadius: "30px",
                    padding: "0.5rem",
                  }}
                />

                {/* > */}
              </div>
            </Grid>
            <Grid
              item
              xs={2}
              sx={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AppleLogin
                clientId={import.meta.env.VITE_REACT_APP_CLIENT_ID}
                redirectURI={import.meta.env.VITE_REACT_APP_REDIRECT_URI}
                responseType="code id_token"
                responseMode="form_post"
                state="origin:web"
                scope="name email"
                render={(renderProps) => (
                  <div
                    style={{
                      padding: "5px",
                      cursor: "pointer",

                    }}

                    onClick={renderProps.onClick}
                  // variant="outlined"
                  // color="primary"
                  // fullWidth
                  // sx={{
                  //   backgroundColor: "#F9FAFB",
                  //   borderColor: "#CCCCCC",
                  //   borderRadius: "12px",
                  //   "& .MuiButton-startIcon": {
                  //     marginRight: 1,
                  //   },
                  // }}
                  // style={{
                  //   textTransform: "none",
                  //   color: "#848484",
                  //   fontWeight: 500,
                  //   fontSize: "14px",
                  //   fontFamily: "OpenSans",
                  // }}
                  // startIcon={
                  >
                    <img
                      src={Images.APPLE_ICON}
                      alt="Apple"
                      style={{
                        width: 20,
                        height: 20,
                        border: "2px solid #2E368E",
                        borderRadius: "30px",
                        padding: "0.5rem",
                      }}
                    />

                    {/* > */}
                  </div>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="body2"
                align="center"
                style={{
                  fontWeight: 400,
                  fontFamily: "OpenSans",
                  color: "#000000",
                  marginTop: "3px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                Already have an account?&nbsp;
                <div
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
                  onClick={handleButtonClick}
                >
                  Sign In
                </div>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Grid >
  );
}

export default CreateAccountIndividual;
