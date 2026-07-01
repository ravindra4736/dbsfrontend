"use client";

import { useSyncExternalStore } from "react";

import { authStore } from "@/store/auth";

export function useAuth() {
  const auth = useSyncExternalStore(
    authStore.subscribe,
    authStore.getSnapshot,
    authStore.getServerSnapshot,
  );

  return {
    ...auth,
    initialize: authStore.initialize,
    setAuth: authStore.setAuth,
    clearAuth: authStore.clearAuth,
  };
}
