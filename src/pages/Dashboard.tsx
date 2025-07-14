import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ArrowLeft, Youtube, Upload, User, Mail, Link as LinkIcon, Settings, Play, Eye, Heart, Share2 } from "lucide-react";
import { VideoNFT } from "@/components/VideoNFT";

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    bio: '',
    youtubeUrl: '',
    tiktokUrl: '',
    xUrl: ''
  });

  const [videoUrl, setVideoUrl] = useState('');
  const [uploadedVideos, setUploadedVideos] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleProfileChange = (field: string, value: string) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleVideoUpload = async () => {
    if (!videoUrl.trim()) return;
    
    setIsUploading(true);
    
    // Simulate API call to parse video
    setTimeout(() => {
      const newVideo = {
        id: Date.now().toString(),
        title: `Video from ${extractPlatform(videoUrl)}`,
        creator: userProfile.name || "Unknown Creator",
        thumbnail: "/placeholder.svg",
        price: Math.floor(Math.random() * 100) + 10,
        likes: Math.floor(Math.random() * 1000),
        shares: Math.floor(Math.random() * 500),
        views: Math.floor(Math.random() * 10000),
        growthRate: Math.floor(Math.random() * 50),
        tokenReward: Math.floor(Math.random() * 100) + 25,
        sourceUrl: videoUrl
      };
      
      setUploadedVideos(prev => [newVideo, ...prev]);
      setVideoUrl('');
      setIsUploading(false);
    }, 2000);
  };

  const extractPlatform = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('tiktok.com')) return 'TikTok';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'X';
    return 'Unknown Platform';
  };

  const isPlatformConnected = (platform: string) => {
    switch (platform) {
      case 'youtube': return !!userProfile.youtubeUrl;
      case 'tiktok': return !!userProfile.tiktokUrl;
      case 'x': return !!userProfile.xUrl;
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/" 
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Home
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg" />
                <span className="text-xl font-bold text-foreground">Dashboard</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground">
                Balance: 1,250 BTKs
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Video
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="connect" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Connect Platforms
            </TabsTrigger>
          </TabsList>

          {/* Upload Video Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Upload Video to NFT</h2>
                  <p className="text-muted-foreground">Paste your video URL from YouTube, TikTok, or X to convert it into an NFT</p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="videoUrl">Video URL</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="videoUrl"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          className="pl-10 bg-background/50"
                        />
                      </div>
                      <Button 
                        onClick={handleVideoUpload}
                        disabled={!videoUrl.trim() || isUploading}
                        className="bg-gradient-primary hover:shadow-glow-primary text-primary-foreground border-0"
                      >
                        {isUploading ? 'Processing...' : 'Create NFT'}
                      </Button>
                    </div>
                  </div>
                  
                  {videoUrl && (
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Platform detected: <Badge variant="outline">{extractPlatform(videoUrl)}</Badge>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Uploaded Videos Preview */}
            {uploadedVideos.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground">Your Video NFTs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {uploadedVideos.map((video) => (
                    <VideoNFT key={video.id} {...video} />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Profile Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        value={userProfile.name}
                        onChange={(e) => handleProfileChange('name', e.target.value)}
                        className="pl-10 bg-background/50"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={userProfile.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        className="pl-10 bg-background/50"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={userProfile.bio}
                    onChange={(e) => handleProfileChange('bio', e.target.value)}
                    className="bg-background/50"
                    rows={4}
                  />
                </div>
                
                <Button className="bg-gradient-primary hover:shadow-glow-primary text-primary-foreground border-0">
                  Save Profile
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Connect Platforms Tab */}
          <TabsContent value="connect" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* YouTube */}
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                    <Youtube className="h-8 w-8 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">YouTube</h3>
                    <p className="text-sm text-muted-foreground">Connect your YouTube channel</p>
                  </div>
                  
                  {isPlatformConnected('youtube') ? (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                      Connected
                    </Badge>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        placeholder="YouTube channel URL"
                        value={userProfile.youtubeUrl}
                        onChange={(e) => handleProfileChange('youtubeUrl', e.target.value)}
                        className="bg-background/50"
                      />
                      <Button 
                        size="sm" 
                        className="w-full bg-red-500 hover:bg-red-600 text-white"
                      >
                        Connect
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              {/* TikTok */}
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto">
                    <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">TT</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">TikTok</h3>
                    <p className="text-sm text-muted-foreground">Connect your TikTok account</p>
                  </div>
                  
                  {isPlatformConnected('tiktok') ? (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                      Connected
                    </Badge>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        placeholder="TikTok profile URL"
                        value={userProfile.tiktokUrl}
                        onChange={(e) => handleProfileChange('tiktokUrl', e.target.value)}
                        className="bg-background/50"
                      />
                      <Button 
                        size="sm" 
                        className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                      >
                        Connect
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              {/* X (Twitter) */}
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">𝕏</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">X (Twitter)</h3>
                    <p className="text-sm text-muted-foreground">Connect your X account</p>
                  </div>
                  
                  {isPlatformConnected('x') ? (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-500">
                      Connected
                    </Badge>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        placeholder="X profile URL"
                        value={userProfile.xUrl}
                        onChange={(e) => handleProfileChange('xUrl', e.target.value)}
                        className="bg-background/50"
                      />
                      <Button 
                        size="sm" 
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Connect
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;