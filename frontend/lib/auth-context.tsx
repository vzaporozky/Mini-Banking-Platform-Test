"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, AuthContextType } from "./types";
import { authApi } from "./api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      // Проверяем валидность токена
      authApi
        .getProfile()
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          // Токен недействителен, удаляем его
          localStorage.removeItem("auth_token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { user: userData, token } = await authApi.signIn(email, password);
      localStorage.setItem("auth_token", token);
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign in");
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { user: userData, token } = await authApi.signUp(
        email,
        password,
        fullName
      );
      localStorage.setItem("auth_token", token);
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign up");
    }
  };

  const signOut = async () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
