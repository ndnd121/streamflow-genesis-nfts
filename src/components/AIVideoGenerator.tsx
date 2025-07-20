import { useState, useEffect } from "react";
import VideoGenerationService from "@/services/VideoGenerationService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Sparkles, 
  Video,
  Network,
  Cpu,
  PlayCircle,
  Download,
  Share2,
  Zap,
  Upload
} from "lucide-react";

interface GenerationStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed';
  nodeId?: string;
  progress: number;
}

interface AIVideoGeneratorProps {
  onVideoSaved?: () => void;
}

export const AIVideoGenerator: React.FC<AIVideoGeneratorProps> = ({ onVideoSaved }) => {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(15);
  const [style, setStyle] = useState('realistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<{ title: string; videoUrl: string; description: string } | null>(null);
  const [activeNodes, setActiveNodes] = useState(12);
  const { user } = useAuth();
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([
    { id: '1', name: 'Initializing', status: 'pending', progress: 0 },
    { id: '2', name: 'Processing Prompt', status: 'pending', progress: 0 },
    { id: '3', name: 'Generating Frames', status: 'pending', progress: 0 },
    { id: '4', name: 'Applying Effects', status: 'pending', progress: 0 },
    { id: '5', name: 'Finalizing Output', status: 'pending', progress: 0 }
  ]);

  const { toast } = useToast();

  const handleDirectUpload = () => {
    if (!videoUrl.trim() || !title.trim()) {
      toast({
        title: "请填写完整信息",
        description: "请输入视频标题和视频链接",
        variant: "destructive"
      });
      return;
    }

    const video = {
      title: title.trim(),
      videoUrl: videoUrl.trim(),
      description: description.trim()
    };

    setGeneratedVideo(video);
    toast({
      title: "视频准备就绪",
      description: "请保存到您的视频库"
    });
  };

  const handleSaveVideo = async () => {
    if (!user) {
      toast({
        title: "请先登录",
        description: "您需要登录才能保存视频",
        variant: "destructive"
      });
      return;
    }

    if (!generatedVideo) {
      toast({
        title: "没有视频可保存",
        description: "请先上传或生成视频",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('videos')
        .insert({
          title: generatedVideo.title,
          video_url: generatedVideo.videoUrl,
          description: generatedVideo.description,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "保存成功",
        description: "视频已保存到您的个人库中"
      });

      // Reset form
      setPrompt('');
      setVideoUrl('');
      setTitle('');
      setDescription('');
      setGeneratedVideo(null);

      // Call callback if provided
      onVideoSaved?.();
    } catch (error) {
      console.error('Error saving video:', error);
      toast({
        title: "保存失败",
        description: "保存视频时发生错误，请重试",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Simulate active node changes
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNodes(prev => {
        const change = Math.floor(Math.random() * 3) - 1;
        return Math.max(8, Math.min(15, prev + change));
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a video description.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    setGeneratedVideo(null);
    
    try {
      // Step 1: Initialize
      updateStepProgress(0, 'processing', 20);
      setTimeout(() => updateStepProgress(0, 'completed', 100), 1000);
      
      // Step 2: Process Prompt
      setTimeout(() => updateStepProgress(1, 'processing', 30), 1200);
      setTimeout(() => updateStepProgress(1, 'completed', 100), 3000);
      
      // Step 3: Generate Frames
      setTimeout(() => updateStepProgress(2, 'processing', 20), 3200);
      
      // Use VideoGenerationService to generate video
      const videoURL = await VideoGenerationService.generateVideo(
        { prompt, style, duration },
        (step, progress) => updateStepProgress(step, 'processing', progress)
      );
      
      // Step 4: Apply Effects
      setTimeout(() => updateStepProgress(2, 'completed', 100), 10000);
      setTimeout(() => updateStepProgress(3, 'processing', 40), 10200);
      setTimeout(() => updateStepProgress(3, 'processing', 80), 12000);
      setTimeout(() => updateStepProgress(3, 'completed', 100), 13000);
      
      // Step 5: Finalize
      setTimeout(() => updateStepProgress(4, 'processing', 50), 13200);
      setTimeout(() => {
        updateStepProgress(4, 'completed', 100);
        setGeneratedVideo({
          title: `AI Generated: ${prompt.slice(0, 50)}...`,
          videoUrl: videoURL,
          description: `Generated using ${style} style for ${duration} seconds`
        });
        
        toast({
          title: "Video Generated!",
          description: "Your AI video has been successfully generated.",
        });
        
        setIsGenerating(false);
      }, 15000);

    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An error occurred during video generation.",
        variant: "destructive",
      });
      
      // Reset steps
      setGenerationSteps(steps => steps.map(step => ({
        ...step,
        status: 'pending',
        progress: 0,
        nodeId: undefined
      })));
      
      setIsGenerating(false);
    }
  };

  const updateStepProgress = (stepIndex: number, status: 'pending' | 'processing' | 'completed', progress: number) => {
    setGenerationSteps(prevSteps => {
      const newSteps = [...prevSteps];
      newSteps[stepIndex] = {
        ...newSteps[stepIndex],
        status,
        progress,
        nodeId: status === 'processing' ? `Node-${Math.floor(Math.random() * 1000)}` : undefined
      };
      return newSteps;
    });
  };

  const resetGeneration = () => {
    setIsGenerating(false);
    setGeneratedVideo(null);
    setGenerationSteps(steps => steps.map(step => ({
      ...step,
      status: 'pending',
      progress: 0,
      nodeId: undefined
    })));
  };

  return (
    <div className="relative">
      {/* Original Content */}
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-gradient-primary">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Video Generator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create beautiful videos from text descriptions using our decentralized AI network
          </p>
          
          {/* Network Status */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-muted-foreground">Network Active</span>
            </div>
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">{activeNodes} Nodes Online</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">GPU Cluster Ready</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Direct Upload Panel */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                上传视频链接
              </CardTitle>
              <CardDescription>
                输入视频标题、描述和链接快速创建视频NFT
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">视频标题</Label>
                <Input
                  id="title"
                  placeholder="输入视频标题..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoUrl">视频链接</Label>
                <Input
                  id="videoUrl"
                  placeholder="https://www.youtube.com/watch?v=... 或其他平台链接"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">视频描述</Label>
                <Textarea
                  id="description"
                  placeholder="描述您的视频内容..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-background/50"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleDirectUpload}
                disabled={!title.trim() || !videoUrl.trim()}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                <Upload className="h-4 w-4 mr-2" />
                准备视频
              </Button>
            </CardContent>
          </Card>

          {/* AI Generation Panel - Coming Soon */}
          <Card className="relative border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
            {/* Blur overlay */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="p-4 rounded-full bg-gradient-primary mx-auto w-fit">
                  <Sparkles className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    Coming Soon
                  </h3>
                  <p className="text-muted-foreground max-w-sm">
                    AI Video Generation feature is currently in development
                  </p>
                </div>
                <Badge variant="secondary" className="px-4 py-2">
                  <Zap className="h-3 w-3 mr-1" />
                  Beta Testing
                </Badge>
              </div>
            </div>
            
            {/* Blurred content behind */}
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                AI Video Generation
              </CardTitle>
              <CardDescription>
                Create videos from text descriptions using our decentralized AI network
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Video Description</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe your video... (e.g. 'A futuristic city at sunset with flying cars and neon lights')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] bg-background/50"
                  disabled={true}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (seconds)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="5"
                    max="60"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    disabled={true}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="style">Style</Label>
                  <select 
                    id="style"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    disabled={true}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm"
                  >
                    <option value="realistic">Realistic</option>
                    <option value="anime">Anime</option>
                    <option value="cartoon">Cartoon</option>
                    <option value="cinematic">Cinematic</option>
                    <option value="abstract">Abstract</option>
                  </select>
                </div>
              </div>

              <Button
                disabled={true}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Video
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Generated Video Display */}
        {generatedVideo && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-green-500" />
                  视频预览
                </div>
                {user && (
                  <Button 
                    onClick={handleSaveVideo}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    {isSaving ? "保存中..." : "保存到我的视频库"}
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{generatedVideo.title}</h3>
                  {generatedVideo.description && (
                    <p className="text-muted-foreground mt-1">{generatedVideo.description}</p>
                  )}
                </div>
                
                <div className="aspect-video rounded-lg overflow-hidden bg-background border">
                  {generatedVideo.videoUrl.includes('youtube.com') || generatedVideo.videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={generatedVideo.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                      <div className="text-center">
                        <Video className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">视频链接预览</p>
                        <p className="text-xs text-muted-foreground mt-1">{generatedVideo.videoUrl}</p>
                      </div>
                    </div>
                  )}
                </div>

                {!user && (
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      请先登录以保存视频到您的个人库
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};