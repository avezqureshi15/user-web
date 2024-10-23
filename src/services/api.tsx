// api.ts

import axios, { AxiosError, AxiosResponse } from "axios";
export const BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
interface ErrorResponse {
  message: string;
}

export const uploadImagesAPI = async (
  selectedImages: File[],
): Promise<AxiosResponse<any>> => {
  try {
    const formData = new FormData();
    selectedImages.forEach((image) => {
      formData.append("files", image);
    });

    const response = await axios.post(
      `${BASE_URL}/proj/file-upload/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    throw new Error(
      axiosError.response?.data?.message ?? "Unknown error occurred",
    );
  }
};
