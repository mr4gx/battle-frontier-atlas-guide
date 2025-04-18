
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
import { User, Session } from "@supabase/supabase-js";

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
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
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
      } else if (discordError === 'missing_parameters') {
        errorMessage = 'Missing required parameters for Discord connection.';
      }
      
      toast.error('Discord Connection Failed', {
        description: errorMessage,
      });
      
      // Clean up URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [location.search]);

  // Add listener for messages from popup window (for mobile auth flow)
  useEffect(() => {
    const handleAuthMessage = (event: MessageEvent) => {
      if (event.data.type === 'DISCORD_AUTH_SUCCESS') {
        toast.success('Discord account connected successfully!', {
          description: 'You can now receive notifications through Discord.',
        });
      } else if (event.data.type === 'DISCORD_AUTH_ERROR') {
        toast.error('Discord Connection Failed', {
          description: event.data.message || 'Failed to connect Discord account.',
        });
      }
    };

    window.addEventListener('message', handleAuthMessage);
    return () => window.removeEventListener('message', handleAuthMessage);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, options?: RegisterOptions) => {
    setIsLoading(true);
    
    try {
      // Register with Supabase and include user metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            avatarUrl: options?.avatarUrl,
            twitterUrl: options?.twitterUrl,
            instagramUrl: options?.instagramUrl,
            youtubeUrl: options?.youtubeUrl,
            twitchUrl: options?.twitchUrl
          }
        }
      });
      
      if (error) throw error;
      
      toast.success(`Welcome, Trainer ${name}!`, {
        description: `You've received 5 tokens to start your journey.`
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Registration failed:", error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
