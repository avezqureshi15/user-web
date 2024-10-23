// imageUploadSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { URLS } from "@constants/urlConstants";
import { RootState } from "src/store";
import axiosInstance from "../api/axiosInstance";
// Assuming you have a store setup

export const uploadImages = createAsyncThunk(
  "imageUpload/uploadImages",
  async (selectedImages: File[], { rejectWithValue }) => {
    try {
      const formData = new FormData();
      selectedImages.forEach((image) => {
        formData.append("files", image);
      });
      console.log(formData);
      const response = await axiosInstance.post(URLS.FILE_UPLOAD, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("this is response", response.data);
      return response.data; // Assuming the API returns some data upon successful upload
    } catch (error) {
      return rejectWithValue(error); // Return error message
    }
  },
);

export const uploadImagesPUT = createAsyncThunk(
  "imageUpload/uploadImagesPUT",
  async (
    payload: { selectedImages: any[]; modelId: string },
    { rejectWithValue },
  ) => {
    const { selectedImages, modelId } = payload;
    try {
      const formData = new FormData();
      selectedImages.forEach((image) => {
        formData.append("files", image);
      });
      formData.append("model_id", modelId);

      const response = await axiosInstance.put(URLS.BATCH_UPLOAD, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("this is response", response.data);
      return response.data; // Assuming the API returns some data upon successful upload
    } catch (error) {
      return rejectWithValue(error); // Return error message
    }
  },
);

//upload images as draft

export const uploadImagesAsDraft = createAsyncThunk(
  "imageUpload/uploadImagesAsDraft",
  async (selectedImages: File[], { rejectWithValue }) => {
    try {
      const formData = new FormData();
      selectedImages.forEach((image) => {
        formData.append("files", image);
      });
      formData.append("is_draft", "True"); // Set is_draft field to true

      const response = await axiosInstance.post(URLS.FILE_UPLOAD, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("API Response:", response.data); // Debug log
      return response.data; // Assuming the API returns some data upon successful upload
    } catch (error: any) {
      console.error("API Error:", error); // Debug log
      return rejectWithValue(error.response?.data || error.message); // Return error message
    }
  },
);

export const updateDraft = createAsyncThunk(
  "drafts/updateDraft",
  async (
    payload: { modelId: string; selectedImages: File[] },
    { rejectWithValue },
  ) => {
    const { selectedImages, modelId } = payload;
    try {
      const formData = new FormData();
      selectedImages.forEach((image: any) => {
        formData.append("files", image);
      });
      formData.append("model_id", modelId);
      const response = await axiosInstance.put(
        `${URLS.BATCH_UPLOAD}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log("API Response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const upload3DModel = createAsyncThunk(
  "imageUpload/upload3DModel",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(URLS.GLD_UPLOAD, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const update3DModel = async ({ id, formData }: any) => {
  try {
    const response = await axiosInstance.put(
      `${URLS.GLD_UPLOAD}${id}/`,
      formData,
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const convert3DModel = createAsyncThunk(
  "imageUpload/convert3DModel",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(URLS.CONVERT_MODEL, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const generateModel = createAsyncThunk(
  "imageUpload/generateModel",
  async (modelId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${URLS.GENERATE_MODEL}`, {
        model_id: modelId,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const uploadVideosAsDraft = createAsyncThunk(
  "videoUpload/uploadVideosAsDraft",
  async (videoFile: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("files", videoFile); // Append the video file with the key "files"
      formData.append("is_draft", "True"); // Set is_draft field to true
      console.log(formData);
      const response = await axiosInstance.post(URLS.FILE_UPLOAD, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      return response.data; // Assuming the API returns some data upon successful upload
    } catch (error) {
      return rejectWithValue(error); // Return error message
    }
  },
);

export const upload3DasDraft = createAsyncThunk(
  "3DModelUpload/upload3DasDraft",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      formData.append("is_draft", "True"); // Set is_draft field to true

      const response = await axiosInstance.post(URLS.FILE_UPLOAD, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data; // Assuming the API returns some data upon successful upload
    } catch (error) {
      return rejectWithValue(error); // Return error message
    }
  },
);

interface ImageUploadState {
  selectedImages: File[];
  uploading: boolean;
  error: string | null;
}

const initialState: ImageUploadState = {
  selectedImages: [],
  uploading: false,
  error: null,
};

const imageUploadSlice = createSlice({
  name: "imageUpload",
  initialState,
  reducers: {
    addSelectedImage: (state, action) => {
      state.selectedImages.push(action.payload);
    },
    removeSelectedImage: (state, action) => {
      state.selectedImages = state.selectedImages.filter(
        (image) => image !== action.payload,
      );
    },
    resetState: (state) => {
      state.selectedImages = [];
      state.uploading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImages.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadImages.fulfilled, (state) => {
        state.uploading = false;
        state.selectedImages = [];
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string; // Assume payload is a string
      })
      .addCase(upload3DModel.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(upload3DModel.fulfilled, (state) => {
        state.uploading = false;
        state.selectedImages = [];
      })
      .addCase(upload3DModel.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string; // Assume payload is a string
      })
      .addCase(generateModel.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(generateModel.fulfilled, (state) => {
        state.uploading = false;
        // Optionally, update state based on the action payload if needed
      })
      .addCase(generateModel.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string; // Assume payload is a string
      })
      .addCase(uploadVideosAsDraft.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadVideosAsDraft.fulfilled, (state) => {
        state.uploading = false;
        // Optionally, update state based on the action payload if needed
      })
      .addCase(uploadVideosAsDraft.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string; // Assume payload is a string
      })
      // Reducers for 3D model upload
      .addCase(upload3DasDraft.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(upload3DasDraft.fulfilled, (state) => {
        state.uploading = false;
        // Optionally, update state based on the action payload if needed
      })
      .addCase(upload3DasDraft.rejected, (state, action) => {
        state.uploading = false;
        state.error = action.payload as string; // Assume payload is a string
      });
  },
});

export const { addSelectedImage, removeSelectedImage, resetState } =
  imageUploadSlice.actions;

export const selectSelectedImages = (state: RootState) =>
  state.imageUpload.selectedImages;

export default imageUploadSlice.reducer;
