import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import { URLS } from "@constants/urlConstants";

import ErrorResponse, { handleApiError } from "@utils/errorUtils";
import { RootState } from "../store";

interface PaymentState {
  isLoading: boolean;
  orderId: string | null;
  error: string | null;
  netAmount: number | null;
  discount: number | null;
  tax: number | null;
  invoice: any;

  taxApplied: string | null;
  reason: string | null;
  taxAmount: number | null;
  totalAmount: number | null;
}

const initialState: PaymentState = {
  isLoading: false,
  orderId: null,
  error: null,
  netAmount: null,
  discount: null,
  taxApplied: null,
  tax: null,
  taxAmount: null,
  totalAmount: null,

  invoice: null,
  reason: null,
};

// export const getOrderId = createAsyncThunk(
//   "payment/getOrderId",
//   async ({ id, referralCode }: { id: string; referralCode: string }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post<{ id: string }>(`${URLS.ORDER_ID}?referral_code=${referralCode}`, {
//         address_id: id,
//       });
//       console.log(response.data)
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(handleApiError(error as ErrorResponse));
//     }
//   },
// );

export const getOrderId = createAsyncThunk(
  "payment/getOrderId",
  async (
    {
      // id,
      // referralCode,
      referral_applied,
    }: { referral_applied?: boolean },
    { rejectWithValue },
  ) => {
    try {
      // const params = new URLSearchParams();
      // params.append("address_id", id);
      // if (referralCode) {
      //   params.append("referral_code", referralCode);
      // }

      const response = await axiosInstance.post(
        `${URLS.ORDER_ID}`,
        {
          // referral_code
          referral_applied: referral_applied,
        },

        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

export const fetchPriceDetails = createAsyncThunk(
  "payment/fetchPriceDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${URLS.PRICE_DETAILS}?reason=AR_VIEWS`,
      );
      console.log("Price details response:", response.data); // Log the response
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);
export const getInvoiceDetails = createAsyncThunk(
  "payment/getInvoiceDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(URLS.GET_INVOICES);
      return response.data.data; // Assuming the invoice details are in response.data.data
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

export const fetchPriceDetailsWithReferralCode = createAsyncThunk(
  "payment/fetchPriceDetailsWithoutReferralCode",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${URLS.PRICE_DETAILS}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);
export const fetchPriceDetailsWithReferralApplied = createAsyncThunk(
  "payment/fetchPriceDetailsWithReferralApplied",
  async (referralCode: boolean, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${URLS.PRICE_DETAILS}?referral_applied=${referralCode}`,
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

export const downloadInvoice = async (order_id: string) => {
  try {
    const response = await axiosInstance.post(URLS.DOWNLOAD_INVOICES, {
      order_id: order_id,
    });
    return response.data.url;
  } catch (error: any) {
    console.log(error.message);
  }
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPriceDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchPriceDetails.fulfilled,
        (state, action: PayloadAction<any>) => {
          const {
            net_amount,
            tax_applied,
            tax_amount,
            total_amount,
            reason,
            discount,
          } = action.payload.data;
          state.isLoading = false;
          state.netAmount = net_amount;
          state.discount = discount;
          state.taxApplied = tax_applied;
          state.taxAmount = tax_amount;
          state.totalAmount = total_amount;
          state.reason = reason;
        },
      )
      .addCase(fetchPriceDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Handle getInvoiceDetails action
      .addCase(getInvoiceDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getInvoiceDetails.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.invoice = action.payload; // Store the invoice details in the state
        },
      )
      .addCase(getInvoiceDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getOrderId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getOrderId.fulfilled,
        (state, action: PayloadAction<{ id: string }>) => {
          state.isLoading = false;
          state.orderId = action.payload.id;
        },
      )
      .addCase(getOrderId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPriceDetailsWithReferralCode.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchPriceDetailsWithReferralCode.fulfilled,
        (state, action: PayloadAction<any>) => {
          const {
            net_amount,
            tax_applied,
            tax_amount,
            total_amount,
            reason,
            discount,
          } = action.payload.data;
          state.isLoading = false;
          state.netAmount = net_amount;
          state.discount = discount;
          state.taxApplied = tax_applied;
          state.taxAmount = tax_amount;
          state.totalAmount = total_amount;
          state.reason = reason;
        },
      )
      .addCase(
        fetchPriceDetailsWithReferralApplied.fulfilled,
        (state, action: PayloadAction<any>) => {
          const {
            net_amount,
            tax_applied,
            tax_amount,
            total_amount,
            reason,
            discount,
          } = action.payload.data;
          state.isLoading = false;
          state.netAmount = net_amount;
          state.discount = discount;
          state.taxApplied = tax_applied;
          state.taxAmount = tax_amount;
          state.totalAmount = total_amount;
          state.reason = reason;
        },
      )
      .addCase(fetchPriceDetailsWithReferralCode.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectPayment = (state: RootState) => state.payment;
export default paymentSlice.reducer;
