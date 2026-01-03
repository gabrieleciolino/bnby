"use client";

import { JwtPayload } from "@supabase/supabase-js";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";

type DashboardContextValue = {
  user: JwtPayload;
};

const DashboardContext = createContext<DashboardContextValue | undefined>(
  undefined,
);

export function DashboardProvider({
  user,
  children,
}: {
  user: JwtPayload;
  children: ReactNode;
}) {
  return (
    <DashboardContext.Provider value={{ user }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }

  return context;
}
