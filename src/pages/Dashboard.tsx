import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { BittokLogo } from '@/components/BittokLogo';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { VideoNFT } from '@/components/VideoNFT';
import { AIVideoGenerator } from '@/components/AIVideoGenerator';
import { useWallet } from '@solana/wallet-adapter-react';
import { Plus, Video, LogOut, User, Home, ArrowLeft, ShoppingCart } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  video_url: string;
  description: string | null;
  created_at: string;
  creator: string;
  thumbnail: string | null;
  price: number;
  likes: number;
  shares: number;
  views: number;
  growth_rate: number;
  token_reward: number;
}

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const { connected, publicKey, disconnect } = useWallet();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [showVideoGenerator, setShowVideoGenerator] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [creatingNFT, setCreatingNFT] = useState(false);

  // Check if user is authenticated (either through Supabase or wallet)
  const isAuthenticated = user || connected;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [user, connected, loading, navigate, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserVideos();
    }
  }, [isAuthenticated]);

  const fetchUserVideos = async () => {
    if (!user) {
      setLoadingVideos(false);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast({
        title: "Loading Failed",
        description: "Unable to load your videos, please refresh and try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingVideos(false);
    }
  };

  const handleSignOut = async () => {
    try {
      // If wallet is connected, disconnect it
      if (connected && disconnect) {
        disconnect();
        toast({
          title: "Wallet Disconnected",
          description: "Your wallet has been disconnected."
        });
      }
      
      // If Supabase user is logged in, sign them out
      if (user) {
        await signOut();
      }
      
      // Navigate to auth page
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      // Force navigation even if there's an error
      navigate('/auth');
    }
  };

  const handleVideoSaved = () => {
    setShowVideoGenerator(false);
    fetchUserVideos();
    toast({
      title: "Video Saved",
      description: "Your video has been successfully saved to your library."
    });
  };

  // Extract YouTube video ID from URL
  const extractYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  // Get YouTube thumbnail URL
  const getYouTubeThumbnail = (videoId: string): string => {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  // Extract video title from YouTube (basic implementation)
  const extractVideoTitle = (url: string): string => {
    const videoId = extractYouTubeVideoId(url);
    return videoId ? `YouTube Video ${videoId.substring(0, 8)}` : 'Untitled Video';
  };

  const handleCreateNFT = async () => {
    if (!youtubeUrl.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a YouTube URL to create an NFT.",
        variant: "destructive"
      });
      return;
    }

    const videoId = extractYouTubeVideoId(youtubeUrl);
    if (!videoId) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL.",
        variant: "destructive"
      });
      return;
    }

    setCreatingNFT(true);

    try {
      // Get user ID for authentication
      let userId = user?.id;
      
      if (!userId && connected && publicKey) {
        // Anonymous auth for wallet users
        const { data: { user: anonUser }, error: authError } = await supabase.auth.signInAnonymously();
        if (authError) throw authError;
        userId = anonUser?.id;
        
        if (userId) {
          // Create profile for wallet user
          await supabase
            .from('profiles')
            .upsert({
              user_id: userId,
              display_name: `${publicKey.toString().slice(0, 8)}...${publicKey.toString().slice(-8)}`,
              email: null
            });
        }
      }

      if (!userId) {
        throw new Error('Unable to authenticate user');
      }

      const thumbnail = getYouTubeThumbnail(videoId);
      const title = extractVideoTitle(youtubeUrl);

      const { error } = await supabase
        .from('videos')
        .insert({
          title,
          video_url: youtubeUrl,
          description: `YouTube video NFT created from ${youtubeUrl}`,
          user_id: userId,
          creator: user?.email || (publicKey ? `${publicKey.toString().slice(0, 8)}...${publicKey.toString().slice(-8)}` : 'You'),
          thumbnail,
          price: 0,
          likes: Math.floor(Math.random() * 100) + 10,
          shares: Math.floor(Math.random() * 50) + 5,
          views: Math.floor(Math.random() * 1000) + 100,
          growth_rate: Math.round(Math.random() * 20 * 10) / 10,
          token_reward: 25
        });

      if (error) throw error;

      setYoutubeUrl('');
      fetchUserVideos();
      
      toast({
        title: "NFT Created Successfully!",
        description: "Your YouTube video has been converted to an NFT.",
      });
    } catch (error) {
      console.error('Error creating NFT:', error);
      toast({
        title: "Creation Failed",
        description: "Unable to create NFT from YouTube URL.",
        variant: "destructive"
      });
    } finally {
      setCreatingNFT(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="text-muted-foreground mb-6">You need to be signed in to access the dashboard.</p>
          <Button onClick={() => navigate('/auth')} className="bg-gradient-primary">
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <BittokLogo size={28} className="drop-shadow-lg" />
                 <span className="text-xl font-brand font-bold bg-gradient-primary bg-clip-text text-transparent tracking-wide">
                  BitTok Dashboard
                </span>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Link to="/node-purchase">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Node Purchase
                </Button>
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user?.email || (publicKey ? `${publicKey.toString().slice(0, 8)}...${publicKey.toString().slice(-8)}` : 'User')}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Upload Video to NFT Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-background/80 to-primary/5 border border-border/30 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-2 text-foreground">Upload Video to NFT</h2>
            <p className="text-muted-foreground mb-6">Paste your video URL from YouTube to convert it into an NFT.</p>
            
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 text-muted-foreground">🔗</div>
                </div>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full pl-10 pr-4 py-3 bg-background/50 border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                />
              </div>
              <Button 
                onClick={handleCreateNFT}
                disabled={creatingNFT}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-lg disabled:opacity-50"
              >
                {creatingNFT ? 'Creating...' : 'Create NFT'}
              </Button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-8 flex gap-4">
          <Button 
            onClick={() => setShowVideoGenerator(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <Plus className="h-4 w-4" />
            <span>Create AI Video</span>
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/node-purchase')}
            className="flex items-center space-x-2"
          >
            <span>Purchase Nodes</span>
          </Button>
        </div>

        {/* Video Generator Modal */}
        {showVideoGenerator && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Create AI Video</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowVideoGenerator(false)}
                  >
                    ✕
                  </Button>
                </div>
                <AIVideoGenerator onVideoSaved={handleVideoSaved} />
              </div>
            </div>
          </div>
        )}

        {/* Videos Grid */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Video className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Your Video NFTs</h2>
            <span className="text-sm text-muted-foreground">({videos.length})</span>
          </div>

          {loadingVideos ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <VideoNFT
                  key={video.id}
                  id={video.id}
                  title={video.title}
                  videoUrl={video.video_url}
                  thumbnail={video.thumbnail || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1000&q=80"}
                  creator={video.creator}
                  price={video.price}
                  likes={video.likes}
                  shares={video.shares}
                  views={video.views}
                  growthRate={video.growth_rate}
                  tokenReward={video.token_reward}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="mb-2">No videos yet</CardTitle>
                <CardDescription className="mb-4">
                  Create your first AI video to start your creative journey
                </CardDescription>
                <Button 
                  onClick={() => setShowVideoGenerator(true)}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  Create First Video
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;