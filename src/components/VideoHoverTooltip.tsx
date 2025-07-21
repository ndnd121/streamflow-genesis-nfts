import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Heart, Share2, Star, BarChart3 } from "lucide-react";

interface VideoStats {
  platformViews: number;
  platformLikes: number;
  platformShares: number;
  bittokLikes: number;
  bittokShares: number;
  bittokCollects: number;
  potentialTokens: number;
  growthRate: number;
}

interface VideoHoverTooltipProps {
  title: string;
  creator: string;
  description?: string;
  stats: VideoStats;
  isVisible: boolean;
  position: { x: number; y: number };
}

export const VideoHoverTooltip = ({ 
  title, 
  creator, 
  description, 
  stats, 
  isVisible, 
  position 
}: VideoHoverTooltipProps) => {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed z-50 w-80 pointer-events-none animate-fade-in"
      style={{ 
        left: position.x + 20, 
        top: position.y - 20,
        transform: position.x > window.innerWidth / 2 ? 'translateX(-100%)' : 'translateX(0)'
      }}
    >
      <Card className="bg-background/95 backdrop-blur-sm border-border shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          <p className="text-xs text-muted-foreground">by {creator}</p>
          {description && (
            <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Platform Stats */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium">Original Platform Data</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-muted/50 rounded">
                <div className="font-semibold">{stats.platformViews.toLocaleString()}</div>
                <div className="text-muted-foreground">Views</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded">
                <div className="font-semibold">{stats.platformLikes.toLocaleString()}</div>
                <div className="text-muted-foreground">Likes</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded">
                <div className="font-semibold">{stats.platformShares.toLocaleString()}</div>
                <div className="text-muted-foreground">Shares</div>
              </div>
            </div>
          </div>

          {/* BitTok Platform Stats */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-3 w-3 text-secondary" />
              <span className="text-xs font-medium">BitTok Platform</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-secondary/10 rounded">
                <div className="font-semibold flex items-center justify-center gap-1">
                  <Heart className="h-3 w-3" />
                  {stats.bittokLikes}
                </div>
                <div className="text-muted-foreground">Likes</div>
              </div>
              <div className="text-center p-2 bg-secondary/10 rounded">
                <div className="font-semibold flex items-center justify-center gap-1">
                  <Share2 className="h-3 w-3" />
                  {stats.bittokShares}
                </div>
                <div className="text-muted-foreground">Shares</div>
              </div>
              <div className="text-center p-2 bg-secondary/10 rounded">
                <div className="font-semibold flex items-center justify-center gap-1">
                  <Star className="h-3 w-3" />
                  {stats.bittokCollects}
                </div>
                <div className="text-muted-foreground">Collects</div>
              </div>
            </div>
          </div>

          {/* Growth & Rewards */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-xs font-medium">Growth Rate</span>
              </div>
              <Badge variant="outline" className="border-green-500 text-green-500 text-xs">
                +{stats.growthRate}%
              </Badge>
            </div>
            
            <div className="bg-gradient-accent/20 rounded-lg p-2 text-center">
              <div className="text-xs text-muted-foreground">Potential Token Reward</div>
              <div className="text-sm font-bold text-primary">+{stats.potentialTokens} BTKs</div>
            </div>
          </div>

          {/* Simple Growth Chart Visualization */}
          <div className="space-y-2">
            <div className="text-xs font-medium">7-Day Growth Trend</div>
            <div className="flex items-end gap-1 h-8">
              {[65, 78, 82, 95, 88, 92, 100].map((height, index) => (
                <div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-primary/60 to-primary/20 rounded-sm"
                  style={{ height: `${(height / 100) * 32}px` }}
                />
              ))}
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Engagement trending upward 📈
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};