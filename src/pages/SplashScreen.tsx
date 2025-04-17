
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Logo } from "@/components/logo";
import { useAuth } from "@/context/auth-context";

const SplashScreen = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + "." : "");
    }, 500);

    const timer = setTimeout(() => {
      // Redirect to dashboard if authenticated, otherwise to login
      navigate(isAuthenticated ? "/dashboard" : "/");
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigate, isAuthenticated]);

  return (
    <div className="atl-gradient-bg min-h-screen flex flex-col items-center justify-center">
      <div className="relative flex flex-col items-center text-white">
        <Logo size="lg" variant="full" className="text-white mb-12 animate-bounce-small" />
        
        <div className="mt-12 flex flex-col items-center">
          <LoadingSpinner className="mb-4 border-white" />
          <p className="text-white">
            Loading{dots}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
