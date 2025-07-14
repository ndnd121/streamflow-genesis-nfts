import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { ArrowLeft, Youtube, Upload, User, Mail, Link as LinkIcon, Settings, Play, Eye, Heart, Share2, Star, Calendar, CheckCircle, Wallet, Coffee } from "lucide-react";
import { VideoNFT } from "@/components/VideoNFT";
import { BittokLogo } from "@/components/BittokLogo";

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
  const [lastCheckinDate, setLastCheckinDate] = useState<string>('');
  const [isCheckedInToday, setIsCheckedInToday] = useState(false);
  const [checkinStreak, setCheckinStreak] = useState(0);

  const handleProfileChange = (field: string, value: string) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const extractVideoThumbnail = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    // For TikTok and X, we'll use placeholder for now as they require API access
    return "/placeholder.svg";
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
        thumbnail: extractVideoThumbnail(videoUrl),
        price: Math.floor(Math.random() * 100) + 10,
        likes: Math.floor(Math.random() * 1000),
        shares: Math.floor(Math.random() * 500),
        views: Math.floor(Math.random() * 10000),
        growthRate: Math.floor(Math.random() * 50),
        tokenReward: Math.floor(Math.random() * 100) + 25,
        videoUrl: videoUrl
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
      case 'youtube': return userProfile.youtubeUrl === 'connected';
      case 'tiktok': return userProfile.tiktokUrl === 'connected';
      case 'x': return userProfile.xUrl === 'connected';
      default: return false;
    }
  };

  const handleDailyCheckin = () => {
    const today = new Date().toDateString();
    if (!isCheckedInToday) {
      setLastCheckinDate(today);
      setIsCheckedInToday(true);
      setCheckinStreak(prev => prev + 1);
      // Add BTK rewards logic here
    }
  };

  const canCheckin = () => {
    return isPlatformConnected('youtube') || isPlatformConnected('tiktok') || isPlatformConnected('x');
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
              <div className="flex items-center gap-3">
                <BittokLogo size={32} className="drop-shadow-lg" />
                <span className="text-xl font-brand font-bold bg-gradient-primary bg-clip-text text-transparent tracking-wide">
                  Dashboard
                </span>
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
          <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm">
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
            <TabsTrigger value="checkin" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Daily Check-in
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
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                    <Youtube className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">YouTube</h3>
                    <p className="text-sm text-muted-foreground">Connect via YouTube API</p>
                  </div>
                  
                  {isPlatformConnected('youtube') ? (
                    <Badge variant="secondary" className="bg-gradient-secondary text-secondary-foreground">
                      Connected
                    </Badge>
                  ) : (
                    <Button 
                      size="sm" 
                      className="w-full bg-gradient-primary hover:shadow-glow-primary text-primary-foreground border-0"
                      onClick={() => {
                        // Simulate OAuth connection
                        handleProfileChange('youtubeUrl', 'connected');
                      }}
                    >
                      Connect with YouTube
                    </Button>
                  )}
                </div>
              </Card>

              {/* TikTok */}
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                      <span className="text-accent-foreground font-bold text-sm">TT</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">TikTok</h3>
                    <p className="text-sm text-muted-foreground">Connect via TikTok API</p>
                  </div>
                  
                  {isPlatformConnected('tiktok') ? (
                    <Badge variant="secondary" className="bg-gradient-secondary text-secondary-foreground">
                      Connected
                    </Badge>
                  ) : (
                    <Button 
                      size="sm" 
                      className="w-full bg-gradient-accent hover:shadow-glow-accent text-accent-foreground border-0"
                      onClick={() => {
                        // Simulate OAuth connection
                        handleProfileChange('tiktokUrl', 'connected');
                      }}
                    >
                      Connect with TikTok
                    </Button>
                  )}
                </div>
              </Card>

              {/* X (Twitter) */}
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
                    <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                      <span className="text-secondary-foreground font-bold text-lg">𝕏</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">X (Twitter)</h3>
                    <p className="text-sm text-muted-foreground">Connect via X API</p>
                  </div>
                  
                  {isPlatformConnected('x') ? (
                    <Badge variant="secondary" className="bg-gradient-secondary text-secondary-foreground">
                      Connected
                    </Badge>
                  ) : (
                    <Button 
                      size="sm" 
                      className="w-full bg-gradient-secondary hover:shadow-glow-secondary text-secondary-foreground border-0"
                      onClick={() => {
                        // Simulate OAuth connection
                        handleProfileChange('xUrl', 'connected');
                      }}
                    >
                      Connect with X
                    </Button>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Daily Check-in Tab */}
          <TabsContent value="checkin" className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                    <Coffee className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Daily Check-in</h2>
                  <p className="text-muted-foreground">Complete daily tasks to earn BTKs</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-background/50">
                    <div className="text-center space-y-2">
                      <CheckCircle className={`h-8 w-8 mx-auto ${isPlatformConnected('youtube') || isPlatformConnected('tiktok') || isPlatformConnected('x') ? 'text-green-500' : 'text-muted-foreground'}`} />
                      <h3 className="font-medium text-foreground">Connect Platform</h3>
                      <p className="text-sm text-muted-foreground">Connect at least one social platform</p>
                      <Badge variant={canCheckin() ? "secondary" : "outline"} className={canCheckin() ? "bg-green-500/20 text-green-500" : ""}>
                        {canCheckin() ? "✓ Complete" : "Pending"}
                      </Badge>
                    </div>
                  </Card>

                  <Card className="p-4 bg-background/50">
                    <div className="text-center space-y-2">
                      <Mail className={`h-8 w-8 mx-auto ${userProfile.email ? 'text-green-500' : 'text-muted-foreground'}`} />
                      <h3 className="font-medium text-foreground">Bind Email</h3>
                      <p className="text-sm text-muted-foreground">Add your email address</p>
                      <Badge variant={userProfile.email ? "secondary" : "outline"} className={userProfile.email ? "bg-green-500/20 text-green-500" : ""}>
                        {userProfile.email ? "✓ Complete" : "Pending"}
                      </Badge>
                    </div>
                  </Card>

                  <Card className="p-4 bg-background/50">
                    <div className="text-center space-y-2">
                      <Wallet className="h-8 w-8 mx-auto text-muted-foreground" />
                      <h3 className="font-medium text-foreground">Connect Wallet</h3>
                      <p className="text-sm text-muted-foreground">Connect your crypto wallet</p>
                      <Badge variant="outline">
                        Coming Soon
                      </Badge>
                    </div>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{checkinStreak}</div>
                      <div className="text-sm text-muted-foreground">Days Streak</div>
                    </div>
                    <div className="w-px h-8 bg-border" />
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">+50</div>
                      <div className="text-sm text-muted-foreground">BTKs Today</div>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    disabled={!canCheckin() || !userProfile.email || isCheckedInToday}
                    onClick={handleDailyCheckin}
                    className="w-full bg-gradient-primary hover:shadow-glow-primary text-primary-foreground border-0 disabled:opacity-50"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    {isCheckedInToday ? "Checked in Today!" : "Daily Check-in (+50 BTKs)"}
                  </Button>
                  
                  {(!canCheckin() || !userProfile.email) && (
                    <p className="text-sm text-muted-foreground text-center">
                      Complete the requirements above to enable daily check-in
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;