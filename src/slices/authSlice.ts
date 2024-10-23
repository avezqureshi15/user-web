import { URLS } from "@constants/urlConstants";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import ErrorResponse, { handleApiError } from "@utils/errorUtils";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";

//Login
type LoginRequest = {
  login_id: string;
  password: string;
};
interface LoginResponse {
  message: string;
  data: {
    email: string;
    full_name: string;
    deactivated: boolean;
    refresh_token: string;
    access_token: string;
  };
}
type GoogleLoginResponse = {
  is_new_user: boolean;
  access_token: string;
  refresh_token: string;
  full_name: string;
  email: string
};
// type AppleLoginResponse = {
//   is_new_user: boolean;
//   access_token: string;
//   refresh_token: string;
//   full_name: string;
//   email: string
// };

//Register
interface RegisterRequest {
  full_name: string;
  login_id: string;
  password: string;
  referredby_code: string;
}
interface RegisterResponse {
  message: string;
  data: null;
}

interface OrganizationRegistrationData {
  user_details: {
    full_name: string;
    email: string;
    password: string;
  };
  name: string;
  logo: string;
  gstin: number;
}
type VerifyOTPRequest = {
  otp: string;
  email_id: string;
};
type ForgotPasswordOTPRequest = {
  login_id: string;
};

type ForgotPasswordOTPResponse = {
  message: string;
  data: null;
  email: string;
};
type ForgotPasswordOTPVerifyRequest = {
  login_id: string;
  otp: string;
};
type ForgotPasswordOTPVerifyResponse = {
  message: string;
  token: string;
};
type ForgotPasswordChangePasswordRequest = {
  token: string;
  new_password: string;
};
interface ForgotPasswordChangePasswordResponse {
  message: string;
  data: null;
}

type UserProfileData = {
  name: string;
  email: string;
};

type ChangePasswordParams = {
  password: string;
  token: string;
};

type AuthApiState = {
  access_token?: string | null;
  refresh_token?: string | null;
  full_name?: string | null;
  userProfileData?: UserProfileData | null;
  status: "idle" | "loading" | "failed";
  token: string | null;
  error: string | null;
  email_id: string | null;
  fullName?: string;
  email?: string;
  companyName?: string;
  gstNo?: string;
  id?: string;
  phone_number?: string;
  first_name?: string;
};

interface UserAddress {
  id: string;
  email: string;
  phone_number: string;
  first_name: string;
}

const initialState: AuthApiState = {
  access_token: localStorage.getItem("accessToken")
    ? (localStorage.getItem("accessToken") as string)
    : null,
  refresh_token: localStorage.getItem("refreshToken")
    ? (localStorage.getItem("refreshToken") as string)
    : null,
  userProfileData: undefined,
  status: "idle",
  email_id: localStorage.getItem("email")
    ? (localStorage.getItem("email") as string)
    : null,
  error: null,
  fullName: undefined,
  email: undefined,
  companyName: undefined,
  gstNo: undefined,
  token: null,
  id: "",
  phone_number: "",
  first_name: "",
};

export const login = createAsyncThunk(
  "login",
  async (data: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<LoginResponse>(
        URLS.LOGIN,
        data,
      );
      const resData = response.data;
      console.log(response);
      localStorage.setItem("userInfo", JSON.stringify(resData?.data));
      const { access_token, refresh_token, full_name } = response.data.data;
      //console.log(access_token);
      // Save tokens and user info to local storage
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      localStorage.setItem("fullName", full_name);
      localStorage.setItem("email", data.login_id);

      return resData;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

export const registerIndividual = createAsyncThunk(
  "registerIndividual",
  async (data: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(URLS.REGISTER_INDIVIDUAL, data);
      localStorage.setItem("email", data.login_id);
      localStorage.setItem("fullName", data.full_name);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);
export const registerOrganisation = createAsyncThunk(
  "registerOrganisation",
  async (data: OrganizationRegistrationData) => {
    const response = await axiosInstance.post(URLS.REGISTER_ORGANISATION, data);
    const resData = response.data;

    localStorage.setItem("userInfo", JSON.stringify(resData));

    return resData;
  },
);
export const verifyOTP = createAsyncThunk(
  "verifyOTP",
  async (data: VerifyOTPRequest, { rejectWithValue }) => {
    try {
      console.log(data);
      const response = await axiosInstance.post<LoginResponse>(
        URLS.REGISTER_INDIVIDUAL_VERIFY,
        data,
      );
      console.log(data);
      const { access_token, refresh_token, full_name } = response.data.data;
      console.log(access_token);
      // Save tokens and user info to local storage
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      localStorage.setItem("fullName", full_name);
      localStorage.setItem("email", data.email_id);

      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);
export const forgotPasswordOTP = createAsyncThunk(
  "forgotPasswordOTP",
  async (data: ForgotPasswordOTPRequest, { rejectWithValue }) => {
    try {
      console.log(data);
      const response = await axiosInstance.post<ForgotPasswordOTPResponse>(
        URLS.FORGOT_PASSWORD_OTP,
        data,
      );
      response.data.email = data.login_id;
      console.log(response.data.email);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

export const forgotPasswordOTPVerify = createAsyncThunk(
  "forgotPasswordOTPVerify",
  async (data: ForgotPasswordOTPVerifyRequest, { rejectWithValue }) => {
    try {
      console.log(data);
      const response =
        await axiosInstance.post<ForgotPasswordOTPVerifyResponse>(
          URLS.FORGOT_PASSWORD_OTP_VERIFY,
          data,
        );
      console.log(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

export const forgotPasswordChangePassword = createAsyncThunk(
  "forgotPasswordChangePassword",
  async (data: ForgotPasswordChangePasswordRequest, { rejectWithValue }) => {
    try {
      console.log(data);
      const response =
        await axiosInstance.post<ForgotPasswordChangePasswordResponse>(
          URLS.FORGOT_PASSWORD_CHANGE,
          data,
        );
      console.log(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const at = localStorage.getItem("accessToken");
      const response = await axiosInstance.post(URLS.LOGOUT, {
        fcm_token: at,
      });
      console.log(response);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

export const getUser = createAsyncThunk(
  "users/profile",
  async (userId: string) => {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  },
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ password, token }: ChangePasswordParams, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        URLS.PASSWORD_CHANGE,
        {
          new_password: password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        URLS.DELETE_USER + `${userId}/`,
      );
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);



export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (accessToken: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<GoogleLoginResponse>(
        URLS.GOOGLE_LOGIN,
        {
          access_token: accessToken,
        },
      );
      const userData = response.data;
      console.log();
      const { access_token, refresh_token, full_name, email } = response.data;
      console.log(access_token);
      // Save tokens and user info to local storage
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      localStorage.setItem("full_name", full_name);
      localStorage.setItem("email", email);

      return userData;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const appleLogin = createAsyncThunk(
  "auth/appleLogin",
  async (idToken: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(URLS.APPLE_LOGIN, {
        id_token: idToken,
      });

      const userData = response.data;
      const { access_token, refresh_token, full_name, email } = response.data;
      // Save tokens and user info to local storage
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      localStorage.setItem("full_name", full_name);
      localStorage.setItem("email", email);
      return userData;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const fetchUserAddress = createAsyncThunk<
  UserAddress,
  void,
  { rejectValue: string[] }
>("auth/fetchAddress", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(URLS.USER_ADDRESS);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleApiError(error as ErrorResponse));
  }
});

export const resendOTP = async (loginId: any) => {
  try {
    const data = {
      login_id: loginId,
      operation: "verification",
    };
    const response = await axiosInstance.post(URLS.RESEND_OTP, data);
    return response.data;
  } catch (error) {
    // Handle error here
    console.error("Error:", error);
    throw error; // Rethrow error for further handling
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.status = "idle";
          state.access_token = action.payload.data.access_token;
        },
      )
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        const errors = action.payload as string[];
        console.log(errors);
        state.error = errors[0] || "Login failed";
        toast.error(errors[0], {
          position: "bottom-center",
        });
      })

      .addCase(registerIndividual.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        registerIndividual.fulfilled,
        (state, action: PayloadAction<RegisterResponse>) => {
          state.status = "idle";
          state.email_id = localStorage.getItem("email");
          console.log(state.email_id);
          toast.success(action.payload.message, {
            position: "bottom-center",
          });
        },
      )
      .addCase(registerIndividual.rejected, (state, action) => {
        state.status = "failed";
        const errors = action.payload as string[];
        state.error = errors[0] || "Registration failed";
        toast.error(errors[0], {
          position: "bottom-center",
        });
      })

      .addCase(registerOrganisation.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerOrganisation.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(registerOrganisation.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.error.message || "Organisation registration failed";
      })
      .addCase(verifyOTP.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        verifyOTP.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.status = "idle";
          console.log(action.payload);
          state.access_token = action.payload.data.access_token;
          toast.success(action.payload.message, {
            position: "bottom-center",
          });
        },
      )
      .addCase(verifyOTP.rejected, (state, action) => {
        state.status = "failed";
        const errors = action.payload as string[];
        state.error = errors[0] || "OTP verification failed";
        toast.error(errors[0], {
          position: "bottom-center",
        });
      })
      .addCase(forgotPasswordOTP.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        forgotPasswordOTP.fulfilled,
        (state, action: PayloadAction<ForgotPasswordOTPResponse>) => {
          state.status = "idle";

          state.email_id = action.payload.email;
          toast.success(action.payload.message, {
            position: "bottom-center",
          });
        },
      )
      .addCase(forgotPasswordOTP.rejected, (state, action) => {
        state.status = "idle";
        const errors = action.payload as string[];
        state.error = errors[0] || "Failed to Send OTP";
        toast.error(errors[0], {
          position: "bottom-center",
        });
      })
      .addCase(forgotPasswordOTPVerify.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        forgotPasswordOTPVerify.fulfilled,
        (state, action: PayloadAction<ForgotPasswordOTPVerifyResponse>) => {
          state.status = "idle";
          state.token = action.payload.token;
          toast.success(action.payload.message, {
            position: "bottom-center",
          });
        },
      )
      .addCase(forgotPasswordOTPVerify.rejected, (state, action) => {
        state.status = "idle";
        const errors = action.payload as string[];
        state.error = errors[0] || "Failed to Send OTP";
        toast.error(errors[0], {
          position: "bottom-center",
        });
      })
      .addCase(forgotPasswordChangePassword.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        forgotPasswordChangePassword.fulfilled,
        (
          state,
          action: PayloadAction<ForgotPasswordChangePasswordResponse>,
        ) => {
          state.status = "idle";
          toast.success(action.payload.message, {
            position: "bottom-center",
          });
        },
      )
      .addCase(forgotPasswordChangePassword.rejected, (state, action) => {
        state.status = "idle";
        const errors = action.payload as string[];
        state.error = errors[0] || "Failed to Send OTP";
        toast.error(errors[0], {
          position: "bottom-center",
        });
      })

      .addCase(logout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "idle";
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        const errors = action.payload as string[];
        state.error = errors[0] || "Logout failed";
        toast.error(errors[0], {
          position: "bottom-center",
        });
      })

      .addCase(getUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.userProfileData = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Get user profile data failed";
      })

      .addCase(googleLogin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        googleLogin.fulfilled,
        (state, action: PayloadAction<GoogleLoginResponse>) => {
          state.status = "idle";
          state.access_token = action.payload.access_token;
          state.refresh_token = action.payload.refresh_token;
        },
      )
      .addCase(googleLogin.rejected, (state, action) => {
        state.status = "failed";
        const payload = action.payload as { data?: { message?: string } };
        state.error = payload?.data?.message || "Google sign-in failed";
      })

      .addCase(appleLogin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        appleLogin.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.status = "idle";
          state.access_token = action.payload.data.access_token;
          state.refresh_token = action.payload.data.refresh_token;
        },
      )
      .addCase(appleLogin.rejected, (state, action) => {
        state.status = "failed";
        const payload = action.payload as { data?: { message?: string } };
        state.error = payload?.data?.message || "Apple sign-in failed";
      })

      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.error.message || "Error changing password";
      })
      .addCase(fetchUserAddress.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        fetchUserAddress.fulfilled.type, // Use the action type instead of the action creator
        (state, action: PayloadAction<UserAddress[]>) => {
          const userAddress = action.payload[0]; // Assuming there's only one user address in the array
          state.id = userAddress.id ?? "";
          state.email = userAddress.email ?? "";
          state.phone_number = userAddress.phone_number ?? "";
          state.first_name = userAddress.first_name ?? "";
          state.status = "idle";
        },
      )
      .addCase(fetchUserAddress.rejected, (state, action) => {
        state.status = "failed";
        const errors = action.payload as string[];
        state.error = errors[0] || "Failed to fetch user address";
      });
  },
});

export default authSlice.reducer;
