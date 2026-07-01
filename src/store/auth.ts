type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
};

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isHydrated: false,
};

let state: AuthState = initialState;
const listeners = new Set<() => void>();

const emit = () => {
  listeners.forEach((listener) => listener());
};

const hydrateFromStorage = () => {
  if (typeof window === "undefined") {
    return;
  }

  const accessToken = window.localStorage.getItem("accessToken");
  const refreshToken = window.localStorage.getItem("refreshToken");

  state = {
    accessToken,
    refreshToken,
    isAuthenticated: Boolean(accessToken),
    isHydrated: true,
  };

  emit();
};

export const authStore = {
  initialize: () => {
    if (!state.isHydrated) {
      hydrateFromStorage();
    }
  },
  getSnapshot: () => state,
  getServerSnapshot: () => initialState,
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  setAuth: (accessToken: string | null, refreshToken: string | null) => {
    state = {
      accessToken,
      refreshToken,
      isAuthenticated: Boolean(accessToken),
      isHydrated: true,
    };

    if (typeof window !== "undefined") {
      if (accessToken) {
        window.localStorage.setItem("accessToken", accessToken);
      } else {
        window.localStorage.removeItem("accessToken");
      }

      if (refreshToken) {
        window.localStorage.setItem("refreshToken", refreshToken);
      } else {
        window.localStorage.removeItem("refreshToken");
      }
    }

    emit();
  },
  clearAuth: () => {
    state = {
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isHydrated: true,
    };

    if (typeof window !== "undefined") {
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("refreshToken");
    }

    emit();
  },
};
