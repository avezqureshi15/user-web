import { BASE_URL } from "@constants/urlConstants";
import axios from "axios";

// Function to retrieve the access token from local storage or authentication state
const getAccessToken = () => {
  // Implement your logic to retrieve the access token
  // For example, if you store the token in local storage:
  return localStorage.getItem("accessToken");
};

// Create an Axios instance with default options
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Ensure credentials are sent with each request
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add a response interceptor to handle errors from the server
axiosInstance.interceptors.response.use(
  (response) => {
    // Return a successful response
    return response;
  },
  (error) => {
    // Handle errors from the server
    if (error.response.status === 400) {
      // Parse 400 errors to show errors from the server
      console.log(error.response.data);
      return Promise.reject(error.response.data);
    } else {
      // Handle other errors (e.g., network errors)
      return Promise.reject(error);
    }
  },
);

export default axiosInstance;
