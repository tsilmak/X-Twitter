"use client";

import { persistor } from "@/app/lib/store";
import { ReactNode } from "react";
import { PersistGate } from "redux-persist/integration/react";

export function ClientPersistGate({ children }: { children: ReactNode }) {
  return (
    <PersistGate loading={null} persistor={persistor}>
      {children}
    </PersistGate>
  );
}
