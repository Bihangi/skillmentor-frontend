import React, { createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";

import { useUser, useClerk, useAuth as useClerkAuth } from "@clerk/clerk-react";
import { setTokenGetter } from "../services/api";

type UserRole = "student" | "admin" | null;

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  imageUrl: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isSignedIn: boolean;
  role: UserRole;
  signIn: () => void;
  signOut: () => void;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function extractRole(publicMetadata: Record<string, unknown> | undefined): UserRole {
  if (!publicMetadata) return "student";
  const role = publicMetadata.role as string | undefined;
  if (role === "admin") return "admin";
  return "student";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user: clerkUser, isSignedIn: clerkSignedIn, isLoaded } = useUser();
  const { signOut: clerkSignOut, openSignIn } = useClerk();
  const { getToken } = useClerkAuth();

  // Wire Clerk token to API service
  useEffect(() => {
    setTokenGetter(() => getToken());
  }, [getToken]);

  const user: AuthUser | null =
    clerkSignedIn && clerkUser
      ? {
          id: clerkUser.id,
          name: clerkUser.fullName || clerkUser.firstName || "User",
          email: clerkUser.primaryEmailAddress?.emailAddress || "",
          role: extractRole(clerkUser.publicMetadata),
          imageUrl: clerkUser.imageUrl,
        }
      : null;

  const signIn = () => openSignIn();
  const signOut = () => clerkSignOut();

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isSignedIn: !!clerkSignedIn,
        role: user?.role ?? null,
        signIn,
        signOut,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
