import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { User, Camera, Instagram, Twitter, Facebook, Linkedin } from "lucide-react";

export const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    avatar: '',
    instagram: '',
    twitter: '',
    facebook: '',
    linkedin: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save profile data (would typically save to database)
    console.log('Profile saved:', profile);
    setIsOpen(false);
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
                {profile.name ? profile.name.charAt(0).toUpperCase() : <User className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={profile.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          {/* Social Media Links */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-medium text-sm">Connect Social Media</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Instagram className="h-4 w-4 text-pink-500" />
                  <Input
                    placeholder="Instagram username"
                    value={profile.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <Twitter className="h-4 w-4 text-blue-400" />
                  <Input
                    placeholder="Twitter handle"
                    value={profile.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <Facebook className="h-4 w-4 text-blue-600" />
                  <Input
                    placeholder="Facebook profile"
                    value={profile.facebook}
                    onChange={(e) => handleInputChange('facebook', e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <Linkedin className="h-4 w-4 text-blue-700" />
                  <Input
                    placeholder="LinkedIn profile"
                    value={profile.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Save Profile
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};