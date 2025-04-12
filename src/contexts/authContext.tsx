import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// Create a default context value
const defaultContextValue: AuthContextType = {
  token: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
};

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Props interface for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Custom hook for using the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token") || null
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  // Update localStorage when token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  }, [token]);

  // Login function
  const login = (newToken: string) => {
    setToken(newToken);
  };

  // Logout function
  const logout = () => {
    setToken(null);
  };

  // Context value
  const value: AuthContextType = {
    token,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
