import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { User, Camera, Github } from "lucide-react";

export const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState({
    avatar: '',
    github: '',
    twitter: ''
  });

  const handleSocialConnect = (platform: string) => {
    // Handle social media connection (would typically use OAuth)
    console.log(`Connecting to ${platform}`);
    // Here you would implement actual OAuth flow
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <User className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback className="text-lg">
                <User className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
            </div>
          </div>

          {/* Social Media Connections */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium text-sm">Connect Social Media</h3>
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleSocialConnect('github')}
                >
                  <Github className="h-4 w-4 mr-3" />
                  Connect GitHub
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleSocialConnect('twitter')}
                >
                  <svg className="h-4 w-4 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Connect X (Twitter)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Close Button */}
          <div className="flex pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};