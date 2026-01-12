// import axios from "axios";
// import Cookies from "js-cookie";

// export const api = axios.create({
//   baseURL: "http://localhost:3001/api",
//   withCredentials: true,
// });

// api.interceptors.request.use((config) => {
//   const accessToken = Cookies.get("accessToken");
//   if (accessToken && config.headers) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }
//   return config;
// });

// api.interceptors.response.use(
//   (res) => res,
//   (error) => {
//     if (error.response?.status === 401) {
//       return Promise.reject(error);
//     }
//     return Promise.reject(error);
//   }
// );

// src/services/api.ts
import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true, // ensures refresh cookie is sent
});

// --- Helper state for refresh queue ---
let isRefreshing = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

function onRefreshed(token: string | null) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string | null) => void) {
  refreshSubscribers.push(cb);
}

// --- Attach access token from cookie for each request ---
api.interceptors.request.use((config) => {
  try {
    const accessToken = Cookies.get("accessToken");
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else if (config.headers) {
      delete config.headers.Authorization;
    }
  } catch (err) {
    // ignore
  }
  return config;
});

// --- Response interceptor: attempt refresh on 401 and retry original requests ---
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const originalRequest = error.config;

    // If no response or not 401 — just forward
    if (!error.response || error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite loop
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        addRefreshSubscriber((token) => {
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          } else {
            reject(error);
          }
        });
      });
    }

    // Otherwise, perform the refresh
    isRefreshing = true;
    return new Promise(async (resolve, reject) => {
      try {
        // Call refresh endpoint — refresh token is sent as httpOnly cookie
        const refreshRes = await axios.post(
          `${api.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshRes.data?.accessToken;
        if (!newAccessToken) {
          // refresh failed / no token returned
          onRefreshed(null);
          isRefreshing = false;
          return reject(error);
        }

        // Store new token in cookie and update header
        Cookies.set("accessToken", newAccessToken);
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        onRefreshed(newAccessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        resolve(api(originalRequest));
      } catch (refreshErr) {
        // Refresh failed — clear subscribers and fail
        onRefreshed(null);
        isRefreshing = false;

        // Optional: call logout endpoint so backend clears refresh cookie
        try {
          await axios.post(
            `${api.defaults.baseURL}/auth/logout`,
            {},
            { withCredentials: true }
          );
        } catch (e) {
          /* swallow */
        }

        reject(refreshErr);
      }
    });
  }
);

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
