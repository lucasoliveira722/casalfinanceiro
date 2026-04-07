"use client";

import { configureAmplify } from "@/src/lib/amplify";
import {
  fetchUserAttributes,
  getCurrentUser,
  signOut,
} from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

configureAmplify();

interface AuthContextValue {
  userName: string;
  isLoading: boolean;
  handleSignOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  userName: "",
  isLoading: true,
  handleSignOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        await getCurrentUser();
        const attrs = await fetchUserAttributes();
        setUserName(attrs.name || "Usuário");
      } catch {
        router.replace("/login");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [router]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    router.replace("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ userName, isLoading, handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}
