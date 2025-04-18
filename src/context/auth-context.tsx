import { 
  ReactNode, 
  createContext, 
  useContext, 
  useState, 
  useEffect 
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { mockTrainer } from "@/data/mock-data";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  email: string;
  name: string;
}

interface RegisterOptions {
  avatarUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  twitchUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string, options?: RegisterOptions) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for saved user in local storage (mock authentication)
    const savedUser = localStorage.getItem("atlUser");
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    setIsLoading(false);
  }, []);

  // Check for Discord connection success/error
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const discordConnected = queryParams.get('discord_connected');
    const discordError = queryParams.get('error');

    if (discordConnected === 'true') {
      toast.success('Discord account connected successfully!', {
        description: 'You can now receive notifications through Discord.',
      });
      
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }

    if (discordError) {
      let errorMessage = 'Failed to connect Discord account.';
      
      // Provide more specific error messages based on error type
      if (discordError === 'token_exchange_failed') {
        errorMessage = 'Failed to authenticate with Discord. Please try again.';
      } else if (discordError === 'user_fetch_failed') {
        errorMessage = 'Failed to fetch Discord user data. Please try again.';
      } else if (discordError === 'db_error') {
        errorMessage = 'Failed to save Discord connection. Please try again.';
      }
      
      toast.error('Discord Connection Failed', {
        description: errorMessage,
      });
      
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [location.search]);

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

  const register = async (email: string, password: string, name: string, options?: RegisterOptions) => {
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
        
        // Store user in local storage
        setUser(user);
        localStorage.setItem("atlUser", JSON.stringify(user));
        
        // Set initial trainer data with tokens and social links
        const trainerData = {
          id: user.id,
          name: user.name,
          avatar: options?.avatarUrl || "/assets/trainers/default.png",
          trainerClass: "Novice",
          wins: 0,
          losses: 0,
          badges: [],
          tokens: 5,
          team: [],
          achievementBadges: [],
          twitterUrl: options?.twitterUrl || '',
          instagramUrl: options?.instagramUrl || '',
          youtubeUrl: options?.youtubeUrl || '',
          twitchUrl: options?.twitchUrl || ''
        };
        
        localStorage.setItem("atlTrainer", JSON.stringify(trainerData));
        
        toast.success(`Welcome, Trainer ${name}!`, {
          description: `You've received 5 tokens to start your journey.`
        });
        
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
