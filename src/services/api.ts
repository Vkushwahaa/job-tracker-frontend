import axios from "axios";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      toast.error("Unable to reach server", {
        description: "Please check your internet connection.",
      });
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    switch (status) {
      case 401:
        toast.error("Session expired", {
          description: "Please login again.",
        });
        window.location.href = "/login";
        break;

      case 403:
        toast.error("Access denied", {
          description: "You do not have permission to do this.",
        });
        break;

      case 404:
        toast.error("Not found", {
          description: "The requested resource does not exist.",
        });
        break;

      default:
        if (status >= 500) {
          toast.error("Server error", {
            description: "Please try again later.",
          });
        } else {
          toast.error("Error", {
            description: data?.message || "Something went wrong.",
          });
        }
    }

    return Promise.reject(error);
  }
);
