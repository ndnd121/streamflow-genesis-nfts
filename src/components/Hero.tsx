import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Users, Zap, Coins, TrendingUp } from "lucide-react";
import cosmicBackground from "@/assets/cosmic-video-wall.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Cosmic Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${cosmicBackground})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-primary/20 text-primary border-primary/30 backdrop-blur-sm">
                The Future of Data Tokenization
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                The ultimate{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  Data tokenomic
                </span>{" "}
                platform
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                Transform streaming video data into NFTs. Earn tokens through AI-driven recommendations and decentralized node computing.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                asChild
                className="bg-gradient-primary hover:shadow-glow-primary text-white border-0 px-8 py-6 text-lg"
              >
                <a href="/register">
                  Join now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Active Creators</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">$2M+</div>
                <div className="text-sm text-muted-foreground">Tokens Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Video NFTs</div>
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
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI Recommendations</h3>
                  <p className="text-muted-foreground">
                    Our intelligent system matches your content with the right audience for maximum earnings.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-glow-cosmic transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <Coins className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Decentralized Rewards</h3>
                  <p className="text-muted-foreground">
                    Earn tokens through our distributed node network that powers the platform.
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