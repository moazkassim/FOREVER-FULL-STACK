export interface AuthState {
  token: string;
  sessionLoading: boolean;
  setToken: (token: string) => void;
  restoreSession: () => Promise<void>;
  logout: () => Promise<void>;
}
