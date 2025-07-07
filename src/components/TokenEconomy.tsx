import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Heart, Share2, Bookmark, Coins, Zap, Server, Flame, Video, Users } from "lucide-react";

interface TokenStats {
  totalSupply: number;
  rewardPool: number;
  totalVideos: number;
  activeNodes: number;
  dailyBurned: number;
  weeklyGrowth: number;
}

const mockStats: TokenStats = {
  totalSupply: 1000000000,
  rewardPool: 15420000,
  totalVideos: 12847,
  activeNodes: 234,
  dailyBurned: 89750,
  weeklyGrowth: 12.4
};

export const TokenEconomy = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Tokenomics & Recommendation-Driven Economy
        </h2>
        <p className="text-muted-foreground">
          AI-powered recommendation system with performance-linked token rewards
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Reward Pool</p>
              <p className="text-2xl font-bold text-neon-green">
                {(mockStats.rewardPool / 1000000).toFixed(1)}M
              </p>
            </div>
            <Coins className="h-8 w-8 text-neon-green" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Video NFTs</p>
              <p className="text-2xl font-bold text-foreground">
                {mockStats.totalVideos.toLocaleString()}
              </p>
            </div>
            <Video className="h-8 w-8 text-neon-green" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Transcoding Nodes</p>
              <p className="text-2xl font-bold text-foreground">
                {mockStats.activeNodes}
              </p>
            </div>
            <Server className="h-8 w-8 text-neon-green" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Daily Burned</p>
              <p className="text-2xl font-bold text-orange-500">
                {(mockStats.dailyBurned / 1000).toFixed(0)}K
              </p>
            </div>
            <Flame className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Token Consumption Model */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <h3 className="text-xl font-semibold mb-4 text-foreground">Token Consumption Model</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-secondary/20 to-transparent rounded-lg border border-border/30">
            <Heart className="h-8 w-8 text-neon-green mx-auto mb-2" />
            <h4 className="font-semibold text-foreground">Like</h4>
            <p className="text-2xl font-bold text-neon-green">5 Tokens</p>
            <p className="text-sm text-muted-foreground mt-1">Lightweight endorsement</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-secondary/20 to-transparent rounded-lg border border-border/30">
            <Bookmark className="h-8 w-8 text-neon-green mx-auto mb-2" />
            <h4 className="font-semibold text-foreground">Save</h4>
            <p className="text-2xl font-bold text-neon-green">8 Tokens</p>
            <p className="text-sm text-muted-foreground mt-1">Stronger engagement intent</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-secondary/20 to-transparent rounded-lg border border-border/30">
            <Share2 className="h-8 w-8 text-neon-green mx-auto mb-2" />
            <h4 className="font-semibold text-foreground">Share</h4>
            <p className="text-2xl font-bold text-neon-green">10 Tokens</p>
            <p className="text-sm text-muted-foreground mt-1">Viral dissemination mechanism</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance-Linked Rewards */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Performance-Linked Rewards</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If video NFT sees ≥10% view increase within 1 hour, actions are rewarded:
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-neon-green" />
                <span className="text-foreground">Like Reward</span>
              </div>
              <Badge className="bg-neon-green/20 text-neon-green border-neon-green/50">10%</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
              <div className="flex items-center gap-3">
                <Bookmark className="h-5 w-5 text-neon-green" />
                <span className="text-foreground">Save Reward</span>
              </div>
              <Badge className="bg-neon-green/20 text-neon-green border-neon-green/50">15%</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
              <div className="flex items-center gap-3">
                <Share2 className="h-5 w-5 text-neon-green" />
                <span className="text-foreground">Share Reward</span>
              </div>
              <Badge className="bg-neon-green/20 text-neon-green border-neon-green/50">20%</Badge>
            </div>
          </div>
        </Card>

        {/* Reward Pool Allocation */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Reward Pool Allocation</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">User Incentives</span>
                <span className="text-foreground">50%</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Node Rewards</span>
                <span className="text-foreground">30%</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Token Burn (Deflation)</span>
                <span className="text-foreground">20%</span>
              </div>
              <Progress value={20} className="h-2" />
            </div>
          </div>
        </Card>
      </div>

      {/* AI Recommendation Score */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <h3 className="text-xl font-semibold mb-4 text-foreground">AI-Powered Recommendation System</h3>
        <div className="bg-secondary/20 rounded-lg p-4 mb-4">
          <code className="text-sm text-neon-green">
            NFT Score = a × Likes + b × Saves + c × Shares + d × View Growth Rate + e × User Similarity
          </code>
        </div>
        <p className="text-sm text-muted-foreground">
          Weights (a-e) are optimized via reinforcement learning. Higher scores receive increased visibility and token reward potential.
        </p>
      </Card>

      {/* Recent Performance */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <h3 className="text-xl font-semibold mb-4 text-foreground">Recent Performance Rewards</h3>
        <div className="space-y-3">
          {[
            { video: "Epic Gaming Montage", action: "Share", growth: 15.2, reward: 304, cost: 10 },
            { video: "Crypto Analysis", action: "Save", growth: 12.7, reward: 190, cost: 8 },
            { video: "Tech Review", action: "Like", growth: 22.1, reward: 221, cost: 5 },
            { video: "Music Video", action: "Share", growth: 8.3, reward: 0, cost: 10 }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
              <div>
                <p className="font-medium text-foreground">{item.video}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-muted text-muted-foreground">
                    {item.action} (-{item.cost}T)
                  </Badge>
                  <Badge 
                    variant={item.growth >= 10 ? "default" : "secondary"}
                    className={item.growth >= 10 ? "bg-neon-green/20 text-neon-green border-neon-green/50" : ""}
                  >
                    {item.growth >= 10 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    +{item.growth}%
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">
                  {item.reward > 0 ? `+${item.reward}` : '0'}
                </p>
                <p className="text-xs text-muted-foreground">REWARD</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};