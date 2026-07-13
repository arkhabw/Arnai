"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  isDemo: boolean;
  provider?: "email" | "google" | "demo";
  streakDays: number;
  completedQuizzes: number;
  masteredFlashcards: number;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: (accessToken: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load persisted user from localStorage
    try {
      const stored = localStorage.getItem("arnai_current_user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default to null, user can login or click Quick Demo
        setUser(null);
      }
    } catch (e) {
      console.error("Failed to load user from localStorage", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persistUser = (profile: UserProfile | null) => {
    setUser(profile);
    try {
      if (profile) {
        localStorage.setItem("arnai_current_user", JSON.stringify(profile));
      } else {
        localStorage.removeItem("arnai_current_user");
      }
    } catch (e) {
      console.error("Failed to save user to localStorage", e);
    }
  };

  const login = async (email: string, _password?: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const loggedInUser: UserProfile = {
      id: "usr-" + Math.random().toString(36).substring(2, 9),
      name: email.split("@")[0] || "Pelajar Arnai",
      email: email,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      role: "Student Account",
      isDemo: false,
      provider: "email",
      streakDays: 1,
      completedQuizzes: 0,
      masteredFlashcards: 0,
    };

    persistUser(loggedInUser);
    setIsLoading(false);
    return true;
  };

  const register = async (name: string, email: string, _password?: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newUser: UserProfile = {
      id: "usr-" + Math.random().toString(36).substring(2, 9),
      name: name || "Pelajar Baru",
      email: email,
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
      role: "Student Account",
      isDemo: false,
      provider: "email",
      streakDays: 1,
      completedQuizzes: 0,
      masteredFlashcards: 0,
    };

    persistUser(newUser);
    setIsLoading(false);
    return true;
  };

  const loginWithGoogle = async (accessToken: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
      if (!res.ok) {
        throw new Error("Gagal mengambil data profil Google");
      }
      const googleData = await res.json();

      const loggedInUser: UserProfile = {
        id: "usr-google-" + googleData.sub,
        name: googleData.name || "Pengguna Google",
        email: googleData.email,
        avatar: googleData.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role: "Student Account",
        isDemo: false,
        provider: "google",
        streakDays: 1,
        completedQuizzes: 0,
        masteredFlashcards: 0,
      };

      persistUser(loggedInUser);
      setIsLoading(false);
      return true;
    } catch (e) {
      setIsLoading(false);
      throw e;
    }
  };

  const logout = () => {
    persistUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
