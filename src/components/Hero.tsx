import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Play, Zap, TrendingUp, Globe } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-secondary/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--neon-purple)_0%,_transparent_50%)] opacity-20" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-primary rounded-full blur-xl opacity-30 animate-float" />
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-secondary rounded-full blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-gradient-accent rounded-full blur-xl opacity-40 animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Video Data
              </span>
              <br />
              <span className="bg-gradient-secondary bg-clip-text text-transparent">
                Tokenization
              </span>
              <br />
              <span className="text-foreground">Platform</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Transform streaming video data into NFTs. Earn tokens through AI-driven recommendations 
              and decentralized node computing.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <Card className="p-6 bg-card/20 backdrop-blur-sm border-border/50 hover:shadow-glow-primary transition-all duration-300">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
                  <Play className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Video NFTs</h3>
                <p className="text-sm text-muted-foreground">
                  Convert video data into tradeable NFTs with real-time performance tracking
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-card/20 backdrop-blur-sm border-border/50 hover:shadow-glow-accent transition-all duration-300">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto">
                  <TrendingUp className="h-6 w-6 text-background" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Token Economy</h3>
                <p className="text-sm text-muted-foreground">
                  Earn rewards based on video performance and AI recommendation algorithms
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-card/20 backdrop-blur-sm border-border/50 hover:shadow-glow-secondary transition-all duration-300">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mx-auto">
                  <Globe className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Node Network</h3>
                <p className="text-sm text-muted-foreground">
                  Decentralized computing for video transcoding and data extraction
                </p>
              </div>
            </Card>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col gap-6 justify-center items-center">
            <Button size="lg" className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300 px-16 py-6 text-3xl font-bold">
              <Zap className="h-8 w-8 mr-4" />
              Start
              <ArrowRight className="h-8 w-8 ml-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-border hover:bg-secondary/20 px-8">
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                12.8K+
              </div>
              <div className="text-sm text-muted-foreground">Video NFTs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
                234
              </div>
              <div className="text-sm text-muted-foreground">Active Nodes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
                450M
              </div>
              <div className="text-sm text-muted-foreground">Tokens Distributed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                98.7%
              </div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};