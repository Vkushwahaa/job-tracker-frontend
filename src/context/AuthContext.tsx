// "use client";

// import { createContext, useContext, useEffect, useState } from "react";
// import Cookies from "js-cookie";
// import { api } from "@/services/api";
// import { AxiosError } from "axios";

// type User = {
//   id: string;
//   email: string;
//   name: string;
// };

// type AuthContextType = {
//   user: User | null;
//   accessToken: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   register: (name: string, email: string, password: string) => Promise<void>;
//   logout: () => void;
//   loading: boolean;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   // ✅ Initialize from cookies during state creation — no useEffect needed for this
//   const [user, setUser] = useState<User | null>(() => {
//     if (typeof window === "undefined") return null;
//     const storedUser = Cookies.get("user");
//     return storedUser ? JSON.parse(storedUser) : null;
//   });

//   const [accessToken, setAccessToken] = useState<string | null>(() => {
//     if (typeof window === "undefined") return null;
//     return Cookies.get("token") || null;
//   });

//   const [loading, setLoading] = useState(true);

//   // ✅ Only use useEffect to sync with external system (Axios headers)
//   useEffect(() => {
//     if (accessToken) {
//       api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
//     } else {
//       delete api.defaults.headers.common.Authorization;
//     }

//     // Mark loading as done after hydration setup
//     setTimeout(() => {
//       setLoading(false);
//     }, 0);
//   }, [accessToken]); // Re-run if token changes (e.g., login/logout)

//   async function login(email: string, password: string) {
//     const res = await api.post("/auth/login", { email, password });

//     const { user, accessToken } = res.data;
//     console.log("res", res, "user", user);

//     Cookies.set("accessToken", accessToken);
//     Cookies.set("user", JSON.stringify(user));

//     setUser(user);
//     setAccessToken(accessToken);
//   }
//   function logout() {
//     api.post("/auth/logout").finally(() => {
//       Cookies.remove("accessToken");
//       Cookies.remove("user");
//       setUser(null);
//       setAccessToken(null);
//       window.location.href = "/login";
//     });
//   }
//   useEffect(() => {
//     const initializeAuth = async () => {
//       try {
//         let accessToken = Cookies.get("accessToken");
//         if (!accessToken) {
//           // Silent refresh
//           const res = await api.post("/auth/refresh"); // refreshToken cookie is sent automatically
//           console.log("cookies:", res);

//           accessToken = res.data?.accessToken;
//           if (accessToken) {
//             Cookies.set("accessToken", accessToken);
//           }
//         }

//         if (accessToken) {
//           api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
//           setAccessToken(accessToken);

//           // Fetch user after token is valid
//           const userRes = await api.get("/auth/me");
//           setUser(userRes.data.user);
//           Cookies.set("user", JSON.stringify(userRes.data.user));
//         }
//       } catch (err) {
//         Cookies.remove("accessToken");
//         Cookies.remove("user");
//         setUser(null);
//         setAccessToken(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeAuth();
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         accessToken,
//         login,
//         logout,
//         register: async () => {}, // implement later
//         loading,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
//   return ctx;
// }
// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { api } from "@/services/api";
import { AxiosError } from "axios";

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // initialize from cookie using same key "accessToken"
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const storedUser = Cookies.get("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [accessToken, setAccessToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return Cookies.get("accessToken") || null;
  });

  const [loading, setLoading] = useState(true);

  // ensure axios default header stays in sync with state
  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [accessToken]);

  // helper to set token + user in one place
  function setAccessAndUser(token: string | null, u: User | null) {
    if (token) {
      Cookies.set("accessToken", token);
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      Cookies.remove("accessToken");
      delete api.defaults.headers.common.Authorization;
    }

    if (u) Cookies.set("user", JSON.stringify(u));
    else Cookies.remove("user");

    setAccessToken(token);
    setUser(u);
  }

  async function login(email: string, password: string) {
    const res = await api.post("/auth/login", { email, password });

    const { user: userData, accessToken: token } = res.data;

    setAccessAndUser(token, userData);
  }

  function logout() {
    api.post("/auth/logout").finally(() => {
      setAccessAndUser(null, null);
      window.location.href = "/login";
    });
  }

  useEffect(() => {
    // run once on mount
    const initializeAuth = async () => {
      try {
        setLoading(true);

        let token = Cookies.get("accessToken");

        if (!token) {
          // attempt silent refresh - axios interceptor will also try refresh on 401,
          // but we want to fetch user proactively
          const res = await api.post("/auth/refresh"); // refresh cookie sent via withCredentials
          token = res.data?.accessToken;
          if (token) {
            Cookies.set("accessToken", token);
          }
        }

        if (token) {
          api.defaults.headers.common.Authorization = `Bearer ${token}`;
          setAccessToken(token);

          // fetch /me
          const userRes = await api.get("/auth/me");
          const u = userRes.data.user;
          setUser(u);
          Cookies.set("user", JSON.stringify(u));
        } else {
          // no token after refresh => sign out state
          setUser(null);
          setAccessToken(null);
          Cookies.remove("user");
        }
      } catch (err) {
        // any error => clear auth
        setUser(null);
        setAccessToken(null);
        Cookies.remove("accessToken");
        Cookies.remove("user");
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        logout,
        register: async () => {}, // implement later
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
