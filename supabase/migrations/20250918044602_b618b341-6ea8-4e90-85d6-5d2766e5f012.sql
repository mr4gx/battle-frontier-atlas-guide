-- Create storage bucket for trainer avatars (if not exists)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('trainer_avatars', 'trainer_avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for trainer avatars (recreate to ensure they exist)
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete avatars" ON storage.objects;

CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'trainer_avatars');
CREATE POLICY "Users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'trainer_avatars');
CREATE POLICY "Users can update avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'trainer_avatars');
CREATE POLICY "Users can delete avatars" ON storage.objects FOR DELETE USING (bucket_id = 'trainer_avatars');