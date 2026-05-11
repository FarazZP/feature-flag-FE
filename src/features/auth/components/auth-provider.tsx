import { useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getMeQueryOptions } from "../api/get-me";
import { loginUser } from "../api/login";
import { registerUser } from "../api/register";
import type { User } from "../types/auth.types";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    queryClient
      .fetchQuery(getMeQueryOptions())
      .then((userData) => {
        setUser(userData);
      })
      .catch(() => {
        localStorage.removeItem("auth_token");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [queryClient]);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await loginUser(email, password);
      localStorage.setItem("auth_token", data.token);
      setUser(data.user);
      queryClient.setQueryData(["auth", "me"], data.user);
    },
    [queryClient],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      await registerUser(name, email, password);
      await login(email, password);
    },
    [login],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    setUser(null);
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}
