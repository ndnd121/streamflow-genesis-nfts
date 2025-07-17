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
import { 
  Sparkles, 
  Video,
  Network,
  Cpu,
  PlayCircle,
  Download,
  Share2,
  Zap
} from "lucide-react";

interface GenerationStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed';
  nodeId?: string;
  progress: number;
}

export const AIVideoGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(15);
  const [style, setStyle] = useState('realistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [activeNodes, setActiveNodes] = useState(12);
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([
    { id: '1', name: '初始化生成', status: 'pending', progress: 0 },
    { id: '2', name: '处理提示词', status: 'pending', progress: 0 },
    { id: '3', name: '生成视频帧', status: 'pending', progress: 0 },
    { id: '4', name: '应用特效', status: 'pending', progress: 0 },
    { id: '5', name: '完成输出', status: 'pending', progress: 0 }
  ]);

  const { toast } = useToast();

  // 模拟活动节点变化
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
        title: "缺少提示词",
        description: "请输入视频描述。",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    setGeneratedVideo(null);
    
    try {
      // 步骤 1: 初始化
      updateStepProgress(0, 'processing', 20);
      setTimeout(() => updateStepProgress(0, 'completed', 100), 1000);
      
      // 步骤 2: 处理提示词
      setTimeout(() => updateStepProgress(1, 'processing', 30), 1200);
      setTimeout(() => updateStepProgress(1, 'completed', 100), 3000);
      
      // 步骤 3: 生成帧
      setTimeout(() => updateStepProgress(2, 'processing', 20), 3200);
      
      // 使用 VideoGenerationService 生成视频
      const videoURL = await VideoGenerationService.generateVideo(
        { prompt, style, duration },
        (step, progress) => updateStepProgress(step, 'processing', progress)
      );
      
      // 步骤 4: 应用特效
      setTimeout(() => updateStepProgress(2, 'completed', 100), 10000);
      setTimeout(() => updateStepProgress(3, 'processing', 40), 10200);
      setTimeout(() => updateStepProgress(3, 'processing', 80), 12000);
      setTimeout(() => updateStepProgress(3, 'completed', 100), 13000);
      
      // 步骤 5: 完成
      setTimeout(() => updateStepProgress(4, 'processing', 50), 13200);
      setTimeout(() => {
        updateStepProgress(4, 'completed', 100);
        setGeneratedVideo(videoURL);
        
        toast({
          title: "视频已生成！",
          description: "您的 AI 视频已成功生成。",
        });
        
        setIsGenerating(false);
      }, 15000);

    } catch (error) {
      console.error('生成错误:', error);
      toast({
        title: "生成失败",
        description: error instanceof Error ? error.message : "视频生成过程中发生错误。",
        variant: "destructive",
      });
      
      // 重置步骤
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
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-gradient-primary">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI 视频生成器
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          使用我们的去中心化 AI 网络，从文本描述生成精美视频
        </p>
        
        {/* Network Status */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-muted-foreground">网络活跃</span>
          </div>
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">{activeNodes} 个节点在线</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">GPU 集群就绪</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Generation Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                视频生成
              </CardTitle>
              <CardDescription>
                描述您想要的视频，让我们的去中心化 AI 网络将其变为现实
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">视频描述</Label>
                <Textarea
                  id="prompt"
                  placeholder="描述您想要生成的视频...(例如: '一个未来城市的日落景象，有飞行汽车和霓虹灯')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] bg-background/50"
                  disabled={isGenerating}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">时长 (秒)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="5"
                    max="60"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    disabled={isGenerating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="style">风格</Label>
                  <select 
                    id="style"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    disabled={isGenerating}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm"
                  >
                    <option value="realistic">写实</option>
                    <option value="anime">动漫</option>
                    <option value="cartoon">卡通</option>
                    <option value="cinematic">电影</option>
                    <option value="abstract">抽象</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="bg-gradient-primary hover:shadow-glow-primary text-primary-foreground px-8"
                >
                  {isGenerating ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      生成视频
                    </>
                  )}
                </Button>
                
                {(isGenerating || generatedVideo) && (
                  <Button variant="outline" onClick={resetGeneration}>
                    重置
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Generation Progress */}
          {isGenerating && (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-primary" />
                  分布式处理
                </CardTitle>
                <CardDescription>
                  您的视频正在我们的分布式节点网络中处理
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {generationSteps.map((step) => (
                  <div key={step.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${
                          step.status === 'completed' ? 'bg-green-500' :
                          step.status === 'processing' ? 'bg-blue-500 animate-pulse' :
                          'bg-gray-400'
                        }`}></div>
                        <span className="font-medium">{step.name}</span>
                        {step.nodeId && (
                          <Badge variant="secondary" className="text-xs">
                            {step.nodeId}
                          </Badge>
                        )}
                      </div>
                      <span className="text-muted-foreground">
                        {step.progress}%
                      </span>
                    </div>
                    <Progress value={step.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Generated Video */}
          {generatedVideo && (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-green-500" />
                    生成的视频
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      下载
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      分享
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden bg-background">
                  <video
                    src={generatedVideo}
                    controls
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.error('视频加载错误:', e);
                      toast({
                        title: "视频加载错误",
                        description: "无法加载生成的视频。",
                        variant: "destructive",
                      });
                    }}
                  >
                    您的浏览器不支持视频标签。
                  </video>
                </div>
                <div className="mt-4 p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>提示词:</strong> {prompt}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>时长: {duration}秒</span>
                    <span>•</span>
                    <span>风格: {style}</span>
                    <span>•</span>
                    <span>由 {activeNodes} 个节点生成</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Network Stats Sidebar */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              网络状态
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">活跃节点</span>
                <Badge className="bg-green-100 text-green-800">{activeNodes}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">队列长度</span>
                <span className="text-sm font-medium">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">平均处理时间</span>
                <span className="text-sm font-medium">45秒</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};