
import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Badge } from "@/components/ui/badge";

interface TrainerData {
  id: string;
  name: string;
  avatar_url: string | null;
  trainer_class: string;
  wins: number;
  losses: number;
  tokens: number;
  created_at: string;
}

const TrainersListPage = () => {
  const [trainers, setTrainers] = useState<TrainerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrainers = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('trainers')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setTrainers(data || []);
      } catch (err) {
        console.error('Error fetching trainers:', err);
        setError('Failed to load trainers. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrainers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="bg-atl-primary-purple text-white p-4">
        <h1 className="text-xl font-bold">Registered Trainers</h1>
        <p className="text-sm opacity-80">
          Total Trainers: {trainers.length}
        </p>
      </div>
      
      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-md">
            {error}
          </div>
        ) : trainers.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg shadow-sm">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-2" />
            <h3 className="text-lg font-medium text-gray-600">No Trainers Found</h3>
            <p className="text-sm text-gray-500 mt-1">
              There are no registered trainers in the system yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {trainers.map((trainer) => (
              <Card key={trainer.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-atl-light-purple">
                      <AvatarImage src={trainer.avatar_url || ''} alt={trainer.name} />
                      <AvatarFallback className="bg-atl-light-purple/20">
                        <User className="h-8 w-8 text-atl-dark-purple" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{trainer.name}</h3>
                          <Badge variant="outline" className="bg-atl-light-purple/10 text-atl-dark-purple border-atl-light-purple/30">
                            {trainer.trainer_class}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Joined</div>
                          <div className="text-sm font-medium">
                            {new Date(trainer.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-3 p-2 text-center">
                    <div className="p-2">
                      <div className="text-sm text-gray-500">Wins</div>
                      <div className="font-bold text-atl-primary-purple">{trainer.wins}</div>
                    </div>
                    <div className="p-2">
                      <div className="text-sm text-gray-500">Losses</div>
                      <div className="font-bold text-gray-700">{trainer.losses}</div>
                    </div>
                    <div className="p-2">
                      <div className="text-sm text-gray-500">Tokens</div>
                      <div className="font-bold text-amber-500">{trainer.tokens}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default TrainersListPage;
