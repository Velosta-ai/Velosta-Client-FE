"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const UserContext = createContext();

const API_URL = process.env.NEXT_PUBLIC_URL;

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Refreshes the access token using the stored refresh token.
  // Returns the new token on success, or null on failure.
  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) return null;
    try {
      const res = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      if (!res.ok) {
        // Refresh token is invalid/expired — clear storage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");
        setAccessToken(null);
        setUser(null);
        return null;
      }
      const data = await res.json();
      const newToken = data.accessToken;
      localStorage.setItem("accessToken", newToken);
      setAccessToken(newToken);
      return newToken;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("userData");

      if (token && storedUser) {
        // Optimistically set the token, then verify by attempting a refresh
        // if it looks expired (we check exp claim without a library).
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const isExpired = payload.exp * 1000 < Date.now();
          if (isExpired) {
            // Token expired — refresh silently
            const newToken = await refreshAccessToken();
            if (newToken) {
              setUser(JSON.parse(storedUser));
            }
          } else {
            setAccessToken(token);
            setUser(JSON.parse(storedUser));
          }
        } catch {
          // Malformed token — clear everything
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userData");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [refreshAccessToken]);

  return (
    <UserContext.Provider
      value={{ user, setUser, accessToken, setAccessToken, loading, refreshAccessToken }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
