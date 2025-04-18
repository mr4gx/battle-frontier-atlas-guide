import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { TokenDisplay } from "@/components/token-display";
import { AvatarUpload } from "@/components/avatar-upload";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [twitchUrl, setTwitchUrl] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      setError("");
      await register(email, password, name, {
        avatarUrl,
        twitterUrl,
        instagramUrl,
        youtubeUrl,
        twitchUrl
      });
      setShowSuccess(true);
    } catch (err) {
      setError("Registration failed. Please try again.");
      setShowSuccess(false);
    }
  };

  return (
    <div className="atl-gradient-bg min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Logo variant="full" size="md" />
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg border border-atl-light-purple/30">
            <h1 className="text-2xl font-bold mb-6 text-center text-atl-dark-purple">
              Register New Trainer
            </h1>
            
            <div className="flex justify-center mb-6">
              <AvatarUpload onUpload={url => setAvatarUrl(url)} />
            </div>

            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4 text-sm">
                {error}
              </div>
            )}
            
            {showSuccess && (
              <div className="bg-green-50 text-green-600 p-3 rounded-md mb-4 flex flex-col items-center">
                <p className="text-sm font-medium mb-2">Registration successful!</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Starting tokens:</span>
                  <TokenDisplay count={5} size="sm" />
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">
                  Trainer Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ash Ketchum"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="trainer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="password">
                  Password *
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
                  Confirm Password *
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Social Media Links (Optional)</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="twitter">
                    Twitter
                  </label>
                  <Input
                    id="twitter"
                    type="url"
                    placeholder="https://twitter.com/username"
                    value={twitterUrl}
                    onChange={(e) => setTwitterUrl(e.target.value)}
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="instagram">
                    Instagram
                  </label>
                  <Input
                    id="instagram"
                    type="url"
                    placeholder="https://instagram.com/username"
                    value={instagramUrl}
                    onChange={(e) => setInstagramUrl(e.target.value)}
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="youtube">
                    YouTube
                  </label>
                  <Input
                    id="youtube"
                    type="url"
                    placeholder="https://youtube.com/@channel"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="twitch">
                    Twitch
                  </label>
                  <Input
                    id="twitch"
                    type="url"
                    placeholder="https://twitch.tv/username"
                    value={twitchUrl}
                    onChange={(e) => setTwitchUrl(e.target.value)}
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-atl-primary-purple hover:bg-atl-secondary-purple"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : null}
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link 
                  to="/login" 
                  className="text-atl-primary-purple hover:text-atl-secondary-purple font-medium"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-4 text-center text-xs text-white/60">
        <p>Atlanta Battle Frontier © 2025</p>
      </div>
    </div>
  );
};

export default RegisterPage;
