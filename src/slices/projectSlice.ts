import { URLS } from "@constants/urlConstants";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import ErrorResponse, { handleApiError } from "@utils/errorUtils";
import axiosInstance from "../api/axiosInstance";

interface Project {
  id: string;
  name: string;
  description: string;
}

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

interface FetchProjectsResponse {
  projects: Project[];
}

interface FetchCartDetailsResponse {
  projects: Project[];
}

interface UpdateProjectDetailsPayload {
  modelId: string;
  modelName: string;
}

const initialState: ProjectsState = {
  projects: [],
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(URLS.PROJECTS);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

export const updateProjectDetails = createAsyncThunk(
  "projects/updateProjectDetails",
  async (
    { modelId, modelName }: UpdateProjectDetailsPayload,
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.put(`${URLS.PROJECTS}${modelId}/`, {
        name: modelName,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

export const deleteProjects = createAsyncThunk(
  "projects/deleteProjects",
  async (modelIds: any[], { rejectWithValue }) => {
    try {
      const payload = { model_ids: modelIds };
      const response = await axiosInstance.delete(URLS.DELETE_MODELS, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

export const addToCart = createAsyncThunk(
  "projects/addToCart",
  async (modelIds: any[], { rejectWithValue }) => {
    try {
      // Construct the payload with model_ids key containing the array of modelIds
      const payload = { model_ids: modelIds };

      // Make the PUT request with the payload
      const response = await axiosInstance.put(URLS.CART, payload);

      // Return the data from the response
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

export const fetchCartDetails = createAsyncThunk(
  "projects/fetchCartDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(URLS.CART);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

export const shareModelViaEmail = createAsyncThunk(
  "projects/shareModelViaEmail",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(URLS.MODEL_SHARE, {
        model_id: id,
      });
      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

export const removeFromCart = createAsyncThunk(
  "projects/removeFromCart",
  async (modelId: string, { rejectWithValue }) => {
    try {
      const payload = { model_id: modelId };
      console.log(modelId);
      const response = await axiosInstance.delete(URLS.CART, { data: payload });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error as ErrorResponse));
    }
  },
);

export const retrieveModel = createAsyncThunk(
  "projects/retrieveModel",
  async (modelId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${URLS.RETRIEVE_MODEL}${modelId}/`,
      );
      return response.data;
    } catch (error: any) {
      if (
        (error.response && error.response.status === 404) ||
        error.response.status === 500
      ) {
        const status = error.response?.status;
        // Return the status as part of the rejected value
        return rejectWithValue({ status });
      } else {
        // Handle other errors
        return rejectWithValue(handleApiError(error as ErrorResponse));
      }
    }
  },
);

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProjects.fulfilled,
        (state, action: PayloadAction<FetchProjectsResponse>) => {
          state.loading = false;
          state.projects = action.payload.projects;
        },
      )
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProjectDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProjectDetails.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProjectDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCartDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCartDetails.fulfilled,
        (state, action: PayloadAction<FetchCartDetailsResponse>) => {
          state.loading = false;
          state.projects = action.payload.projects;
        },
      )
      .addCase(fetchCartDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProjects.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(retrieveModel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(retrieveModel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(retrieveModel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default projectsSlice.reducer;
