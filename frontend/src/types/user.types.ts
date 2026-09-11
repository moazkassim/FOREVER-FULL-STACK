export interface AuthState {
  token: string;
  isAuthenticated: boolean;
  sessionLoading: boolean;
  setToken: (token: string) => void;
  restoreSession: () => Promise<void>;
  logout: () => Promise<void>;
}
