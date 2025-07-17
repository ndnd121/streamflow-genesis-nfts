import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Share2
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
    { id: '1', name: 'Text Analysis & Processing', status: 'pending', progress: 0 },
    { id: '2', name: 'Scene Planning & Storyboard', status: 'pending', progress: 0 },
    { id: '3', name: 'Visual Element Generation', status: 'pending', progress: 0 },
    { id: '4', name: 'Motion & Animation Synthesis', status: 'pending', progress: 0 },
    { id: '5', name: 'Audio Track Generation', status: 'pending', progress: 0 },
    { id: '6', name: 'Final Assembly & Rendering', status: 'pending', progress: 0 }
  ]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setGeneratedVideo(null);
    
    // Simulate distributed generation process
    for (let i = 0; i < generationSteps.length; i++) {
      const newSteps = [...generationSteps];
      newSteps[i].status = 'processing';
      newSteps[i].nodeId = `Node-${Math.floor(Math.random() * 100) + 1}`;
      setGenerationSteps(newSteps);
      
      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const progressSteps = [...newSteps];
        progressSteps[i].progress = progress;
        setGenerationSteps(progressSteps);
      }
      
      newSteps[i].status = 'completed';
      setGenerationSteps(newSteps);
    }
    
    // Simulate video generation completion
    setTimeout(() => {
      setGeneratedVideo('https://www.youtube.com/embed/dQw4w9WgXcQ');
      setIsGenerating(false);
    }, 1000);
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
                  disabled={!prompt.trim() || isGenerating}
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
                  <iframe
                    src={generatedVideo}
                    title="Generated Video"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
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