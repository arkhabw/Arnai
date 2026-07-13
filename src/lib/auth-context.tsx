"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db, isFirebaseConfigured } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
  xp: number;
  level: number;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  loginWithGoogle: (accessToken: string) => Promise<boolean>;
  updateUserStats: (stats: Partial<UserProfile>) => Promise<void>;
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
        const parsedUser = JSON.parse(stored);
        setUser(parsedUser);
        
        // Asynchronously pull latest updates from Firestore if online
        if (isFirebaseConfigured && db && parsedUser.email) {
          const docId = parsedUser.email.replace(/\./g, "_");
          getDoc(doc(db, "users", docId)).then((docSnap) => {
            if (docSnap.exists()) {
              const latestData = docSnap.data() as UserProfile;
              setUser(latestData);
              localStorage.setItem("arnai_current_user", JSON.stringify(latestData));
            }
          }).catch(err => console.error("Error fetching latest user stats:", err));
        }
      } else {
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

  const syncUserFirestore = async (profile: UserProfile): Promise<UserProfile> => {
    if (!isFirebaseConfigured || !db) return profile;
    try {
      const docId = profile.email.replace(/\./g, "_");
      const docRef = doc(db, "users", docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const firestoreData = docSnap.data();
        const mergedProfile = {
          ...profile,
          name: firestoreData.name || profile.name,
          avatar: firestoreData.avatar || profile.avatar,
          streakDays: typeof firestoreData.streakDays === "number" ? firestoreData.streakDays : profile.streakDays,
          completedQuizzes: typeof firestoreData.completedQuizzes === "number" ? firestoreData.completedQuizzes : profile.completedQuizzes,
          masteredFlashcards: typeof firestoreData.masteredFlashcards === "number" ? firestoreData.masteredFlashcards : profile.masteredFlashcards,
          xp: typeof firestoreData.xp === "number" ? firestoreData.xp : profile.xp,
          level: typeof firestoreData.level === "number" ? firestoreData.level : profile.level,
        };
        // Update to make sure any missing properties are saved back
        await setDoc(docRef, mergedProfile, { merge: true });
        return mergedProfile as UserProfile;
      } else {
        await setDoc(docRef, profile);
        return profile;
      }
    } catch (err) {
      console.error("Firestore sync error:", err);
      return profile;
    }
  };

  const login = async (email: string, _password?: string): Promise<boolean> => {
    setIsLoading(true);
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
      xp: 100, // Starting bonus XP
      level: 1,
    };

    const syncedUser = await syncUserFirestore(loggedInUser);
    persistUser(syncedUser);
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
      xp: 100,
      level: 1,
    };

    const syncedUser = await syncUserFirestore(newUser);
    persistUser(syncedUser);
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
        xp: 100,
        level: 1,
      };

      const syncedUser = await syncUserFirestore(loggedInUser);
      persistUser(syncedUser);
      setIsLoading(false);
      return true;
    } catch (e) {
      setIsLoading(false);
      throw e;
    }
  };

  const updateUserStats = async (stats: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = { ...user, ...stats };

    // Calculate level based on XP (500 XP per level)
    if (typeof updatedUser.xp === "number") {
      updatedUser.level = Math.max(1, Math.floor(updatedUser.xp / 500) + 1);
    }

    persistUser(updatedUser);

    if (isFirebaseConfigured && db && user.email) {
      try {
        const docId = user.email.replace(/\./g, "_");
        await setDoc(doc(db, "users", docId), updatedUser, { merge: true });
      } catch (err) {
        console.error("Gagal menyinkronkan progres ke Firestore:", err);
      }
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
        updateUserStats,
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
