
import { 
  ReactNode, 
  createContext, 
  useContext, 
  useState, 
  useEffect 
} from "react";
import { useNavigate } from "react-router-dom";
import { mockTrainer } from "@/data/mock-data";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved user in local storage (mock authentication)
    const savedUser = localStorage.getItem("atlUser");
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // This is a mock login - in a real app, we'd call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password) {
        const user = {
          id: mockTrainer.id,
          email,
          name: mockTrainer.name
        };
        
        setUser(user);
        localStorage.setItem("atlUser", JSON.stringify(user));
        navigate("/dashboard");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      // This is a mock registration - in a real app, we'd call an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password && name) {
        const user = {
          id: `T${Math.floor(Math.random() * 90000) + 10000}`,
          email,
          name
        };
        
        setUser(user);
        localStorage.setItem("atlUser", JSON.stringify(user));
        navigate("/dashboard");
      } else {
        throw new Error("Invalid registration data");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("atlUser");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
