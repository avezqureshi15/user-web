import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import { URLS } from "@constants/urlConstants";
import ErrorResponse, { handleApiError } from "@utils/errorUtils";

// Define the type for your notification data
interface Notification {
  id: string;
  title: string;
  description: string;
  is_read: boolean;
  // Add other fields as needed
}

// Define the type for the state of notifications
interface NotificationsState {
  notifications: Notification[];
  status: "idle" | "loading" | "failed";
  error: string | null;
}

// Initial state for notifications
const initialState: NotificationsState = {
  notifications: [],
  status: "idle",
  error: null,
};

// Create async thunk for fetching notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<Notification[]>(
        URLS.NOTIFICATIONS,
      );
      return response.data;
    } catch (error) {
      localStorage.removeItem("accessToken");
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

// Create async thunk for deleting notifications
export const deleteNotifications = createAsyncThunk(
  "notifications/deleteNotifications",
  async (notificationIds: string[], { rejectWithValue }) => {
    try {
      const deleteRequests = notificationIds.map((id) =>
        axiosInstance.delete(`${URLS.NOTIFICATIONS}${id}/`),
      );
      await Promise.all(deleteRequests);
      return notificationIds;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markNotificationAsRead",
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `${URLS.NOTIFICATIONS}${notificationId}/status/read`,
        {
          is_read: true,
        },
      );
      return { notificationId, is_read: response.data.is_read };
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

// Create slice for notifications
const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "idle";
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(deleteNotifications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteNotifications.fulfilled, (state, action) => {
        state.status = "idle";
        // Remove deleted notifications from state
        state.notifications = state.notifications.filter(
          (notification) => !action.payload.includes(notification.id),
        );
      })
      .addCase(deleteNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const {} = notificationsSlice.actions; // You can add any additional actions here if needed
export default notificationsSlice.reducer;
