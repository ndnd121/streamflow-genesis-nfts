import { useState } from "react";
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
  Clock, 
  Zap, 
  Network,
  Cpu,
  Database,
  Users,
  PlayCircle,
  Download,
  Share2,
  Key,
  AlertCircle
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
  const [replicateKey, setReplicateKey] = useState(() => 
    localStorage.getItem('replicate_api_key') || ''
  );
  const [showApiKeyInput, setShowApiKeyInput] = useState(!replicateKey);
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([
    { id: '1', name: 'Initializing prediction', status: 'pending', progress: 0 },
    { id: '2', name: 'Processing text prompt', status: 'pending', progress: 0 },
    { id: '3', name: 'Generating video frames', status: 'pending', progress: 0 },
    { id: '4', name: 'Applying motion effects', status: 'pending', progress: 0 },
    { id: '5', name: 'Finalizing output', status: 'pending', progress: 0 }
  ]);

  const { toast } = useToast();

  const saveApiKey = () => {
    if (replicateKey.trim()) {
      localStorage.setItem('replicate_api_key', replicateKey);
      setShowApiKeyInput(false);
      toast({
        title: "API Key Saved",
        description: "Your Replicate API key has been saved locally.",
      });
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Missing Prompt",
        description: "Please enter a video description.",
        variant: "destructive",
      });
      return;
    }

    if (!replicateKey.trim()) {
      toast({
        title: "Missing API Key",
        description: "Please enter your Replicate API key.",
        variant: "destructive",
      });
      setShowApiKeyInput(true);
      return;
    }
    
    setIsGenerating(true);
    setGeneratedVideo(null);
    
    try {
      // Step 1: Initialize prediction
      const newSteps = [...generationSteps];
      newSteps[0].status = 'processing';
      setGenerationSteps([...newSteps]);

      const enhancedPrompt = `${prompt}, ${style} style, high quality, detailed`;
      
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${replicateKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: "9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351", // Stable Video Diffusion
          input: {
            prompt: enhancedPrompt,
            image: null, // Text-to-video mode
            width: 1024,
            height: 576,
            num_frames: Math.min(Math.max(duration * 8, 14), 25), // Convert seconds to frames
            motion_strength: 0.7
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const prediction = await response.json();
      
      newSteps[0].status = 'completed';
      newSteps[0].progress = 100;
      newSteps[1].status = 'processing';
      setGenerationSteps([...newSteps]);

      // Step 2: Poll for completion
      let predictionStatus = prediction;
      let stepIndex = 1;

      while (predictionStatus.status === 'starting' || predictionStatus.status === 'processing') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
          headers: {
            'Authorization': `Token ${replicateKey}`,
          },
        });

        predictionStatus = await statusResponse.json();
        
        // Update progress
        if (stepIndex < generationSteps.length) {
          const currentSteps = [...generationSteps];
          
          // Complete previous steps
          for (let i = 0; i < stepIndex; i++) {
            currentSteps[i].status = 'completed';
            currentSteps[i].progress = 100;
          }
          
          // Update current step
          currentSteps[stepIndex].status = 'processing';
          currentSteps[stepIndex].progress = Math.min(
            currentSteps[stepIndex].progress + 20, 
            90
          );
          
          setGenerationSteps([...currentSteps]);
          
          if (currentSteps[stepIndex].progress >= 90 && stepIndex < generationSteps.length - 1) {
            stepIndex++;
          }
        }
      }

      // Complete all steps
      const finalSteps = generationSteps.map(step => ({
        ...step,
        status: 'completed' as const,
        progress: 100
      }));
      setGenerationSteps(finalSteps);

      if (predictionStatus.status === 'succeeded' && predictionStatus.output) {
        setGeneratedVideo(predictionStatus.output);
        toast({
          title: "Video Generated!",
          description: "Your AI video has been generated successfully.",
        });
      } else {
        throw new Error(predictionStatus.error || 'Video generation failed');
      }

    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "An error occurred during video generation.",
        variant: "destructive",
      });
      
      // Reset steps on error
      setGenerationSteps(steps => steps.map(step => ({
        ...step,
        status: 'pending',
        progress: 0,
        nodeId: undefined
      })));
    } finally {
      setIsGenerating(false);
    }
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
            AI Video Generator
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Generate stunning videos from text descriptions using our decentralized AI network
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

      {/* API Key Input */}
      {showApiKeyInput && (
        <Card className="border-yellow-200 bg-yellow-50/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Key className="h-5 w-5" />
              Replicate API Configuration
            </CardTitle>
            <CardDescription className="text-yellow-700">
              Enter your Replicate API key to enable real AI video generation. Get your API key from{" "}
              <a 
                href="https://replicate.com/account/api-tokens" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-yellow-900"
              >
                replicate.com
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-yellow-100 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Your API key will be stored locally in your browser and never sent to our servers.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-key">Replicate API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="api-key"
                  type="password"
                  placeholder="r8_..."
                  value={replicateKey}
                  onChange={(e) => setReplicateKey(e.target.value)}
                  className="bg-background"
                />
                <Button onClick={saveApiKey} disabled={!replicateKey.trim()}>
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Generation Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Video Generation
              </CardTitle>
              <CardDescription>
                Describe your video and let our decentralized AI network bring it to life
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Video Description</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe the video you want to generate... (e.g., 'A futuristic cityscape at sunset with flying cars and neon lights')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px] bg-background/50"
                  disabled={isGenerating}
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
                    disabled={isGenerating}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="style">Style</Label>
                  <select 
                    id="style"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    disabled={isGenerating}
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

              <div className="flex items-center gap-4">
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating || !replicateKey}
                  className="bg-gradient-primary hover:shadow-glow-primary text-primary-foreground px-8"
                >
                  {isGenerating ? (
                    <>
                      <Zap className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Video
                    </>
                  )}
                </Button>
                
                {(isGenerating || generatedVideo) && (
                  <Button variant="outline" onClick={resetGeneration}>
                    Reset
                  </Button>
                )}
                
                {replicateKey && !showApiKeyInput && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowApiKeyInput(true)}
                    className="text-xs"
                  >
                    <Key className="h-3 w-3 mr-1" />
                    Reconfigure API
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
                  <Database className="h-5 w-5 text-primary" />
                  Decentralized Processing
                </CardTitle>
                <CardDescription>
                  Your video is being processed across our distributed node network
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
                    Generated Video
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
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
                      console.error('Video load error:', e);
                      toast({
                        title: "Video Load Error",
                        description: "Failed to load the generated video.",
                        variant: "destructive",
                      });
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="mt-4 p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Prompt:</strong> {prompt}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Duration: {duration}s</span>
                    <span>•</span>
                    <span>Style: {style}</span>
                    <span>•</span>
                    <span>Generated by {activeNodes} nodes</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Network Stats Sidebar */}
        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Network Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Nodes</span>
                  <Badge className="bg-green-100 text-green-800">{activeNodes}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Queue Length</span>
                  <span className="text-sm font-medium">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg Processing Time</span>
                  <span className="text-sm font-medium">2m 34s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Network Load</span>
                  <span className="text-sm font-medium">67%</span>
                </div>
              </div>
              <Progress value={67} className="h-2" />
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recent Generations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { user: "Alice", prompt: "Cyberpunk city night...", time: "2m ago" },
                { user: "Bob", prompt: "Mountain landscape...", time: "5m ago" },
                { user: "Carol", prompt: "Abstract art motion...", time: "8m ago" }
              ].map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.user}</span>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{item.prompt}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">0.5 BTK</div>
                <div className="text-sm text-muted-foreground">per 15 seconds</div>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Network fee:</span>
                  <span>0.1 BTK</span>
                </div>
                <div className="flex justify-between">
                  <span>Node rewards:</span>
                  <span>0.3 BTK</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform fee:</span>
                  <span>0.1 BTK</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};