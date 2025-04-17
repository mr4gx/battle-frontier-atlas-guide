
import { Link } from "react-router-dom";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="atl-gradient-bg min-h-screen flex items-center justify-center">
      <div className="text-center px-6 max-w-md">
        <Logo variant="full" size="lg" className="mx-auto mb-8" />
        
        <h1 className="text-3xl font-bold mb-4">Atlanta Battle Frontier</h1>
        <p className="text-xl text-white/80 mb-8">
          Challenge trainers, collect badges, and prove your skills in the Battle Frontier!
        </p>
        
        <div className="flex flex-col gap-4">
          <Link to="/login">
            <Button variant="secondary" size="lg" className="w-full bg-white text-atl-dark-purple hover:bg-white/90">
              Login
            </Button>
          </Link>
          
          <Link to="/register">
            <Button variant="outline" size="lg" className="w-full border-white text-white hover:bg-white/10">
              Register
            </Button>
          </Link>
        </div>
        
        <div className="mt-12 text-sm text-white/60">
          <p>Atlanta Battle Frontier © 2025</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
