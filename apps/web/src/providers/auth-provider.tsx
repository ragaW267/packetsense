"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiClient, ApiError } from "@/lib/api-client";
import type { User, AuthResponse } from "@/types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const userData = await apiClient.get<User>("/api/auth/me");
      setUser(userData);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        localStorage.removeItem("access_token");
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const response = await apiClient.post<AuthResponse>("/api/auth/login", {
      email,
      password,
    });
    localStorage.setItem("access_token", response.access_token);
    setUser(response.user);
  };

  const signup = async (
    email: string,
    username: string,
    password: string,
    fullName?: string
  ) => {
    const response = await apiClient.post<AuthResponse>("/api/auth/signup", {
      email,
      username,
      password,
      full_name: fullName,
    });
    localStorage.setItem("access_token", response.access_token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
