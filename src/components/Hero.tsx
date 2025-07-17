import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Users, Zap, Coins, TrendingUp, Network, Brain } from "lucide-react";
import { ThreeBackground } from "./ThreeBackground";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Three.js Interactive Background */}
      <ThreeBackground />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/20" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm animate-pulse">
                AI Video Generation + Data Tokenization Platform
              </Badge>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  AI Video Generation
                </span>{" "}
                meets{" "}
                <span className="bg-gradient-accent bg-clip-text text-transparent">
                  Data Tokenization
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                Create videos from text using decentralized AI, tokenize your data streams, and earn rewards through our distributed computing network.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                asChild
                className="bg-gradient-primary hover:shadow-glow-primary text-white border-0 px-10 py-8 text-xl"
              >
                <a href="/dashboard">
                  Join now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-10">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">10K+</div>
                <div className="text-base text-muted-foreground">Active Creators</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">$2M+</div>
                <div className="text-base text-muted-foreground">Tokens Earned</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">50K+</div>
                <div className="text-base text-muted-foreground">Video NFTs</div>
              </div>
            </div>
          </div>

          {/* Right Content - Features */}
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-glow-cosmic transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <Play className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Stream & Mint</h3>
                  <p className="text-muted-foreground">
                    Convert your live streams into valuable NFTs automatically with our AI system.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-glow-cosmic transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI Distributed Video Training</h3>
                  <p className="text-muted-foreground">
                    Generate stunning videos from text using our decentralized AI training network powered by community nodes.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-glow-cosmic transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <Network className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Decentralized Node Network</h3>
                  <p className="text-muted-foreground">
                    Contribute computing power to train AI models and earn tokens through our distributed reward system.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};