import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ErrorResponse, { handleApiError } from "@utils/errorUtils";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";
import { URLS } from "@constants/urlConstants";

// Define types for user data, account details, and address
type UserData = {
  message: string;
  data: {
    id: string;
    email: string;
    username: string | null;
    full_name: string;
    phone_number: string | null;
    status: "active" | "inactive";
    social_signup: boolean;
    email_verified: boolean;
    phone_number_verified: boolean;
    country_id: string | null;
    profile_image_url: string | null;
    password: string;
  };
};

interface AccountDetails {
  fullName: string;
}

// Define initial state for the user slice
interface UserState {
  userData: UserData | any;
  addresses: any;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userData: null,
  addresses: null,
  loading: false,
  error: null,
};

// Define async thunk for fetching user addresses
export const fetchUserAddresses = createAsyncThunk<
  any,
  void,
  { rejectValue: string[] }
>("user/fetchUserAddresses", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<any>(URLS.USER_ADDRESS);
    if (response.data.length) return response.data;
    const userAddress = await createUserAddress();
    const res = [userAddress];
    return res;
  } catch (error) {
    return rejectWithValue(handleApiError(error as ErrorResponse));
  }
});

export const createUserAddress = async () => {
  const response: any = await axiosInstance.patch(URLS.USER_ADDRESS, {
    first_name: "Full",
    last_name: "name",
    address1: "Billing Address",
  });
  return response.data;
};

export const saveUserAddress = async (userDetails: any) => {
  try {
    console.log(userDetails);
    const response = await axiosInstance.patch(
      `${URLS.USER_ADDRESS}`,
      userDetails,
    );
    console.log(response);
    if (response) {
      toast.success("Billing Details save successfully", {
        position: "bottom-center",
      });
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// Define async thunk for fetching user data
export const fetchUserData = createAsyncThunk<
  UserData,
  void,
  { rejectValue: string[] }
>("user/fetchUserData", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<UserData>(URLS.FETCH_USER);
    console.log(response);
    return response.data;
  } catch (error) {
    return rejectWithValue(handleApiError(error as ErrorResponse));
  }
});

export const saveAccountDetails = createAsyncThunk<UserData, AccountDetails>(
  "user/saveAccountDetails",
  async ({ fullName }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put<UserData>(
        URLS.SAVE_ACCOUNT_DETAILS,
        { full_name: fullName },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

export const changePassword = createAsyncThunk<
  void,
  { password: string; token: string }
>("user/changePassword", async ({ password, token }, { rejectWithValue }) => {
  try {
    await axiosInstance.post(
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
  } catch (error) {
    return rejectWithValue(handleApiError(error as ErrorResponse));
  }
});

export const uploadImage = createAsyncThunk<
  void,
  { image: File; token: string }
>("user/uploadImage", async ({ image, token }, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("profile_image", image);
    await axiosInstance.put(URLS.IMAGE_UPLOAD, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(formData);
  } catch (error) {
    // Handle errors
    return rejectWithValue(error);
  }
});

// Define the user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false;
        const errors = action.payload as string[];
        state.error = errors[0] || "Failed to get User Details";
        toast.error(errors[0], {
          position: "bottom-center",
        });
      })
      .addCase(fetchUserAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.loading = false;
        const errors = action.payload as any;
        state.error = errors[0] || "Failed to fetch User Addresses";
        toast.error(errors[0], {
          position: "bottom-center",
        });
      })
      .addCase(saveAccountDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveAccountDetails.fulfilled, (state) => {
        state.loading = false;
        toast.success("Account Updated Successfully", {
          position: "bottom-center",
        });
      })
      .addCase(saveAccountDetails.rejected, (state, action) => {
        state.loading = false;
        const errors = action.payload as string[];
        state.error = errors[0] || "Failed to get User Details";
        toast.error(errors[0], {
          position: "bottom-center",
        });
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
