
import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface AvatarUploadProps {
  onUpload: (url: string) => void;
}

export const AvatarUpload = ({ onUpload }: AvatarUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  const uploadAvatar = async (file: File) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('trainer_avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('trainer_avatars')
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      onUpload(publicUrl);
      toast.success('Avatar uploaded successfully!');
    } catch (error) {
      toast.error('Error uploading avatar');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    const file = event.target.files[0];
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }
    uploadAvatar(file);
  };

  // Adjust sizes based on device
  const avatarSize = isMobile ? "h-24 w-24" : "h-32 w-32";
  const iconSize = isMobile ? "h-12 w-12" : "h-16 w-16";
  const uploadIconSize = isMobile ? "h-8 w-8" : "h-10 w-10";

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xs mx-auto">
      <div className="relative w-full flex justify-center">
        <Avatar 
          className={`${avatarSize} cursor-pointer border-4 border-atl-primary-purple`} 
          onClick={() => fileInputRef.current?.click()}
        >
          <AvatarImage src={preview || ''} className="object-cover" />
          <AvatarFallback className="bg-atl-light-purple/20">
            <User className={`${iconSize} text-atl-dark-purple`} />
          </AvatarFallback>
        </Avatar>
        {!preview && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
            <Upload className={`${uploadIconSize} text-white`} />
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
      />

      <Button 
        variant="outline" 
        size="lg"
        className="gap-2 w-full bg-atl-light-purple/10 hover:bg-atl-light-purple/20 text-atl-dark-purple font-medium"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        <Upload className="h-5 w-5" />
        {uploading ? 'Uploading...' : 'Upload Trainer Avatar'}
      </Button>
    </div>
  );
};
