import axios, { AxiosError, AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

/* ===========================
   REFRESH TOKEN STATE
=========================== */
// let isRefreshing = false;
// let failedQueue: {
//   resolve: (token: string) => void;
//   reject: (err: unknown) => void;
// }[] = [];

// const processQueue = (error: unknown, token: string | null = null) => {
//   failedQueue.forEach((p) => {
//     if (error) p.reject(error);
//     else p.resolve(token!);
//   });
//   failedQueue = [];
// };

/* ===========================
   REQUEST INTERCEPTOR
=========================== */
api.interceptors.request.use((config) => {
  const accessToken = Cookies.get("accessToken");
  if (accessToken && config.headers) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/* ===========================
   RESPONSE INTERCEPTOR
=========================== */
// api.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     if (!error.response) {
//       toast.error("Unable to reach server", {
//         description: "Please check your internet connection.",
//       });
//       return Promise.reject(error);
//     }

//     const originalRequest = error.config as AxiosRequestConfig & {
//       _retry?: boolean;
//     };

//     // 🔁 ACCESS TOKEN EXPIRED
//     if (error.response.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({
//             resolve: (token: string) => {
//               if (originalRequest.headers) {
//                 originalRequest.headers.Authorization = `Bearer ${token}`;
//               }
//               resolve(api(originalRequest));
//             },
//             reject,
//           });
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const res = await api.post("/auth/refresh");
//         const newToken = res.data.accessToken;

//         Cookies.set("token", newToken);
//         api.defaults.headers.common.Authorization = `Bearer ${newToken}`;

//         processQueue(null, newToken);
//         return api(originalRequest);
//       } catch (refreshError) {
//         processQueue(refreshError, null);

//         Cookies.remove("token");
//         Cookies.remove("user");

//         toast.error("Session expired", {
//           description: "Please login again.",
//         });

//         window.location.href = "/login";
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
