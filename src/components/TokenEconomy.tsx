import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Coins, Users, Video, Zap } from "lucide-react";

interface TokenStats {
  totalSupply: number;
  circulatingSupply: number;
  totalVideos: number;
  activeNodes: number;
  totalRewards: number;
  weeklyGrowth: number;
}

const mockStats: TokenStats = {
  totalSupply: 1000000000,
  circulatingSupply: 450000000,
  totalVideos: 12847,
  activeNodes: 234,
  totalRewards: 2847596,
  weeklyGrowth: 12.4
};

export const TokenEconomy = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Token Economy
        </h2>
        <p className="text-muted-foreground">
          Real-time economics driven by video performance and AI recommendations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Supply</p>
              <p className="text-2xl font-bold text-foreground">
                {(mockStats.totalSupply / 1000000).toFixed(0)}M
              </p>
            </div>
            <Coins className="h-8 w-8 text-neon-purple" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Videos</p>
              <p className="text-2xl font-bold text-foreground">
                {mockStats.totalVideos.toLocaleString()}
              </p>
            </div>
            <Video className="h-8 w-8 text-neon-cyan" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Nodes</p>
              <p className="text-2xl font-bold text-foreground">
                {mockStats.activeNodes}
              </p>
            </div>
            <Zap className="h-8 w-8 text-neon-green" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Weekly Growth</p>
              <div className="flex items-center gap-1">
                <p className="text-2xl font-bold text-neon-green">
                  +{mockStats.weeklyGrowth}%
                </p>
                <TrendingUp className="h-5 w-5 text-neon-green" />
              </div>
            </div>
            <Users className="h-8 w-8 text-neon-pink" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Token Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Circulating Supply</span>
                <span className="text-foreground">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Node Rewards</span>
                <span className="text-foreground">25%</span>
              </div>
              <Progress value={25} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Creator Pool</span>
                <span className="text-foreground">20%</span>
              </div>
              <Progress value={20} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Platform Reserve</span>
                <span className="text-foreground">10%</span>
              </div>
              <Progress value={10} className="h-2" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Recent Rewards</h3>
          <div className="space-y-3">
            {[
              { video: "Epic Gaming Montage", growth: 15.2, reward: 1250 },
              { video: "Crypto Analysis", growth: 8.7, reward: 890 },
              { video: "Tech Review", growth: 22.1, reward: 2100 },
              { video: "Music Video", growth: -3.2, reward: 0 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary/20">
                <div>
                  <p className="font-medium text-foreground">{item.video}</p>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={item.growth > 0 ? "default" : "destructive"}
                      className={item.growth > 0 ? "bg-neon-green/20 text-neon-green border-neon-green/50" : ""}
                    >
                      {item.growth > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {item.growth > 0 ? '+' : ''}{item.growth}%
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">+{item.reward}</p>
                  <p className="text-xs text-muted-foreground">TOKENS</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};