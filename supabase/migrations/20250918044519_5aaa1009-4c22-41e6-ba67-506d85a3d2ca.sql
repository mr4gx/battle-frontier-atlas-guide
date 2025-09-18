-- Create trainers table
CREATE TABLE public.trainers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  avatar TEXT,
  trainer_class TEXT,
  level INTEGER DEFAULT 1,
  tokens INTEGER DEFAULT 0,
  badges TEXT[],
  team JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create battle_requests table
CREATE TABLE public.battle_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trainer_id TEXT NOT NULL,
  trainer_name TEXT NOT NULL,
  trainer_avatar TEXT,
  trainer_class TEXT,
  facility_id TEXT NOT NULL,
  facility_name TEXT NOT NULL,
  battle_style TEXT NOT NULL,
  time TEXT NOT NULL,
  tokens_wagered INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'accepted', 'completed', 'canceled')),
  opponent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create discord_connections table
CREATE TABLE public.discord_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  discord_user_id TEXT NOT NULL,
  discord_username TEXT NOT NULL,
  discord_discriminator TEXT,
  discord_avatar TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create discord_notifications table
CREATE TABLE public.discord_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  battle_requests BOOLEAN DEFAULT true,
  match_results BOOLEAN DEFAULT true,
  tournament_updates BOOLEAN DEFAULT true,
  leaderboard_changes BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discord_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discord_notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all trainers" ON public.trainers FOR SELECT USING (true);
CREATE POLICY "Users can manage their own trainer" ON public.trainers FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view all battle requests" ON public.battle_requests FOR SELECT USING (true);
CREATE POLICY "Users can create battle requests" ON public.battle_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own battle requests" ON public.battle_requests FOR UPDATE USING (trainer_id = auth.uid()::text OR opponent_id = auth.uid()::text);

CREATE POLICY "Users can manage their own discord connection" ON public.discord_connections FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own discord notifications" ON public.discord_notifications FOR ALL USING (auth.uid() = user_id);

-- Create storage bucket for trainer avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('trainer_avatars', 'trainer_avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for trainer avatars
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'trainer_avatars');
CREATE POLICY "Users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'trainer_avatars');
CREATE POLICY "Users can update avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'trainer_avatars');
CREATE POLICY "Users can delete avatars" ON storage.objects FOR DELETE USING (bucket_id = 'trainer_avatars');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_trainers_updated_at BEFORE UPDATE ON public.trainers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_battle_requests_updated_at BEFORE UPDATE ON public.battle_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_discord_connections_updated_at BEFORE UPDATE ON public.discord_connections FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_discord_notifications_updated_at BEFORE UPDATE ON public.discord_notifications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();