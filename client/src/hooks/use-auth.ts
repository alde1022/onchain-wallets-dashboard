import { useQueryClient } from "@tanstack/react-query";
import { initializeApp, getApps } from "firebase/app";
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  type User as FirebaseUser
} from "firebase/auth";
import { useEffect, useState } from "react";

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Helper to get ID token for API requests
export async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

// Helper for authenticated API requests
export async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getIdToken();
  if (!token) {
    throw new Error("Not authenticated");
  }
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      queryClient.clear();
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  return {
    user: user ? {
      id: user.uid,
      email: user.email,
      firstName: user.displayName?.split(" ")[0] || null,
      lastName: user.displayName?.split(" ").slice(1).join(" ") || null,
      profileImageUrl: user.photoURL,
    } : null,
    firebaseUser: user,
    isLoading,
    isAuthenticated: !!user,
    loginWithGoogle,
    logout,
  };
}
