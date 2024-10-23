import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import { URLS } from "@constants/urlConstants";

import ErrorResponse, { handleApiError } from "@utils/errorUtils";
import { RootState } from "../store";

interface PaymentState {
  isLoading: boolean;
  error: string | null;
  supportTickets: any;
  supportTicketDetails: any;
  ticketCategories: any;
}

const initialState: PaymentState = {
  isLoading: false,
  error: null,

  supportTickets: null,
  supportTicketDetails: null,
  ticketCategories: null,
};

export const fetchSupportTickets = createAsyncThunk(
  "support-ticket/fetchSupportTickets",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${URLS.SUPPORT_TICKET}`);
      console.log("support tickets response:", response.data); // Log the response
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

export const fetchSupportTicketDetails = createAsyncThunk(
  "support-ticket/fetchSupportTicketDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${URLS.SUPPORT_TICKET}${id}`);
      console.log("support ticket details response:", response.data); // Log the response
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

export const createSupportTicket = createAsyncThunk(
  "support-ticket/createSupportTicket",
  async (ticketDetails: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${URLS.SUPPORT_TICKET}`,
        ticketDetails,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

export const updateSupportTicket = createAsyncThunk(
  "support-ticket/updateSupportTicket",
  async (ticketDetails: any, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${URLS.SUPPORT_TICKET}${ticketDetails.id}`,
        ticketDetails,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

export const updateSupportStatus = async (ticketDetails: {
  id: string;
  data: { status: string };
}) => {
  try {
    const response = await axiosInstance.patch(
      `${URLS.SUPPORT_TICKET}${ticketDetails.id}/`,
      ticketDetails.data,
    );

    return response.data;
  } catch (error) {
    return error;
  }
};

export const deleteSupportTicket = createAsyncThunk(
  "support-ticket/deleteSupportTicket",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `${URLS.SUPPORT_TICKET}${id}`,
      );
      console.log("delete support ticket response:", response.data); // Log the response
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

export const fetchSupportTicketCategories = createAsyncThunk(
  "support-ticket/fetchSupportTicketCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${URLS.TICKET_CATEGORIES}`);
      console.log("ticket categories response:", response.data); // Log the response
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

const supportTicketSlice = createSlice({
  name: "supportTicket",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchSupportTickets action
      .addCase(fetchSupportTickets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchSupportTickets.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.supportTickets = action.payload;
        },
      )
      .addCase(fetchSupportTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Handle fetchSupportTicketDetails action
      .addCase(fetchSupportTicketDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchSupportTicketDetails.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.supportTicketDetails = action.payload;
        },
      )
      .addCase(fetchSupportTicketDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Handle createSupportTicket action
      .addCase(createSupportTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSupportTicket.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createSupportTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Handle updateSupportTicket action
      .addCase(updateSupportTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSupportTicket.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateSupportTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      }) // Handle deleteSupportTicket action
      .addCase(deleteSupportTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSupportTicket.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteSupportTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Handle fetchSupportTicketCategories action
      .addCase(fetchSupportTicketCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchSupportTicketCategories.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.ticketCategories = action.payload;
        },
      )
      .addCase(fetchSupportTicketCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const supportTicket = (state: RootState) => state.supportTicket;
export default supportTicketSlice.reducer;
