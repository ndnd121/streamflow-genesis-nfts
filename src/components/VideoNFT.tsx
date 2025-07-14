import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, Star, TrendingUp, Play } from "lucide-react";

interface VideoNFTProps {
  id: string;
  title: string;
  creator: string;
  thumbnail: string;
  price: number;
  likes: number;
  shares: number;
  views: number;
  growthRate: number;
  tokenReward: number;
}

export const VideoNFT = ({ 
  id, 
  title, 
  creator, 
  thumbnail, 
  price, 
  likes, 
  shares, 
  views, 
  growthRate, 
  tokenReward 
}: VideoNFTProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isCollected, setIsCollected] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    // Consume tokens and trigger growth calculation
  };

  const handleShare = () => {
    // Share functionality with token consumption
  };

  const handleCollect = () => {
    setIsCollected(!isCollected);
    // Collection logic with token economics
  };

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm hover:shadow-glow-primary transition-all duration-300 group">
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={thumbnail} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{creator}</p>
        </div>
        <Button 
          size="icon" 
          variant="secondary"
          className="absolute top-4 right-4 bg-background/20 backdrop-blur-sm border-0"
        >
          <Play className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground">
              {price} BTKs
            </Badge>
            {growthRate > 0 && (
              <Badge variant="outline" className="border-neon-green text-neon-green">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{growthRate}%
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
          <div className="text-center">
            <div className="font-semibold text-foreground">{views.toLocaleString()}</div>
            <div>Views</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground">{likes.toLocaleString()}</div>
            <div>Likes</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-foreground">{shares.toLocaleString()}</div>
            <div>Shares</div>
          </div>
        </div>

        <div className="bg-gradient-accent rounded-lg p-3 text-center">
          <div className="text-sm text-foreground font-medium">Potential Reward</div>
          <div className="text-lg font-bold text-background">+{tokenReward > 0 ? tokenReward : 25} BTKs</div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant={isLiked ? "default" : "outline"}
            onClick={handleLike}
            className={`flex-1 min-w-0 ${isLiked ? "bg-gradient-secondary text-secondary-foreground" : "border-primary/30 hover:bg-primary/10"}`}
          >
            <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-xs">10</span>
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleShare}
            className="flex-1 min-w-0 border-primary/30 hover:bg-primary/10"
          >
            <Share2 className="h-4 w-4 mr-1" />
            <span className="text-xs">5</span>
          </Button>
          <Button
            size="sm"
            variant={isCollected ? "default" : "secondary"}
            onClick={handleCollect}
            className={`flex-1 min-w-0 ${isCollected ? "bg-gradient-primary text-primary-foreground" : "bg-secondary/50 hover:bg-secondary"}`}
          >
            <Star className={`h-4 w-4 mr-1 ${isCollected ? 'fill-current' : ''}`} />
            <span className="text-xs">{isCollected ? '✓' : '50'}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};