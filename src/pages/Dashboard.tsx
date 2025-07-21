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
import { Plus, Video, LogOut, User, Home, ArrowLeft, ShoppingCart } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  video_url: string;
  description: string | null;
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [showVideoGenerator, setShowVideoGenerator] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserVideos();
    }
  }, [user]);

  const fetchUserVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
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
      await signOut();
      navigate('/');
    } catch (error) {
      toast({
        title: "Sign Out Failed",
        description: "An error occurred during sign out, please try again.",
        variant: "destructive"
      });
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

  if (!user) {
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
                <span>{user?.email || 'User'}</span>
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
        {/* Actions */}
        <div className="mb-8 flex gap-4">
          <Button 
            onClick={() => setShowVideoGenerator(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Video</span>
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
            <h2 className="text-lg font-semibold">My Video Library</h2>
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
                  thumbnail="/placeholder.svg"
                  creator="You"
                  price={0}
                  likes={0}
                  shares={0}
                  views={0}
                  growthRate={0}
                  tokenReward={0}
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