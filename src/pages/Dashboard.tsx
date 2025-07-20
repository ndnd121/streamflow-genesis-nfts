import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { BittokLogo } from '@/components/BittokLogo';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { VideoNFT } from '@/components/VideoNFT';
import { AIVideoGenerator } from '@/components/AIVideoGenerator';
import { Plus, Video, LogOut, User } from 'lucide-react';

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
        title: "加载失败",
        description: "无法加载您的视频，请刷新页面重试。",
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
        title: "登出失败",
        description: "登出时发生错误，请重试。",
        variant: "destructive"
      });
    }
  };

  const handleVideoSaved = () => {
    setShowVideoGenerator(false);
    fetchUserVideos();
    toast({
      title: "视频已保存",
      description: "您的视频已成功保存到个人库中。"
    });
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BittokLogo className="h-8 w-auto" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              我的工作台
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSignOut}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>登出</span>
            </Button>
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
            <span>创建新视频</span>
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/node-purchase')}
            className="flex items-center space-x-2"
          >
            <span>购买节点</span>
          </Button>
        </div>

        {/* Video Generator Modal */}
        {showVideoGenerator && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">创建 AI 视频</h2>
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
            <h2 className="text-lg font-semibold">我的视频库</h2>
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
                  creator="您"
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
                <CardTitle className="mb-2">还没有视频</CardTitle>
                <CardDescription className="mb-4">
                  创建您的第一个 AI 视频开始您的创作之旅
                </CardDescription>
                <Button 
                  onClick={() => setShowVideoGenerator(true)}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  创建第一个视频
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