import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, Star, TrendingUp, Play } from "lucide-react";
import { VideoHoverTooltip } from "./VideoHoverTooltip";

interface VideoNFTProps {
  id: string;
  title: string;
  creator: string;
  thumbnail: string;
  videoUrl: string;
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
  videoUrl,
  price, 
  likes, 
  shares, 
  views, 
  growthRate, 
  tokenReward 
}: VideoNFTProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isCollected, setIsCollected] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  const handlePlay = () => {
    window.open(videoUrl, '_blank');
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    setShowTooltip(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Mock data for tooltip stats - in real app this would come from props or API
  const tooltipStats = {
    platformViews: Math.floor(views * 1.5) || 156000,
    platformLikes: Math.floor(likes * 1.2) || 12500,
    platformShares: Math.floor(shares * 1.1) || 2800,
    bittokLikes: likes || 10,
    bittokShares: shares || 5,
    bittokCollects: Math.floor(likes * 0.3) || 50,
    potentialTokens: tokenReward || 25,
    growthRate: growthRate || 15.7
  };

  return (
    <>
      <Card 
        className="bg-gradient-to-br from-background/90 to-primary/5 border border-border/30 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Video Thumbnail Background */}
        <div className="relative h-64 overflow-hidden">
          <img 
            src={thumbnail} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Play Button */}
          <Button 
            size="icon" 
            variant="secondary"
            onClick={handlePlay}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm border-0 w-16 h-16 rounded-full hover:bg-white/30"
          >
            <Play className="h-8 w-8 text-white" />
          </Button>
          
          {/* Title and Creator overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h3 className="text-lg font-bold text-white mb-1 line-clamp-2">{title}</h3>
            <p className="text-sm text-white/80">{creator}</p>
          </div>
        </div>
        
        {/* Card Content */}
        <div className="p-4 space-y-4">
          {/* BTK Rewards and Growth */}
          <div className="flex items-center justify-between">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-sm font-bold">
              {tokenReward || 25} BTKs
            </Badge>
            {growthRate > 0 && (
              <Badge className="bg-green-500 text-white px-2 py-1 text-sm">
                📈 +{growthRate}%
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-bold text-foreground text-base">{views.toLocaleString()}</div>
              <div className="text-muted-foreground">Views</div>
            </div>
            <div>
              <div className="font-bold text-foreground text-base">{likes.toLocaleString()}</div>
              <div className="text-muted-foreground">Likes</div>
            </div>
            <div>
              <div className="font-bold text-foreground text-base">{shares.toLocaleString()}</div>
              <div className="text-muted-foreground">Shares</div>
            </div>
          </div>

          {/* Potential Reward */}
          <div className="bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg p-4 text-center">
            <div className="text-white text-sm font-medium mb-1">Potential Reward</div>
            <div className="text-white text-xl font-bold">+{Math.floor((tokenReward || 25) * 2.5)} BTKs</div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleLike}
              className="flex-1 border-border/50 hover:bg-primary/10 text-xs"
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current text-red-500' : ''}`} />
              10
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleShare}
              className="flex-1 border-border/50 hover:bg-primary/10 text-xs"
            >
              <Share2 className="h-4 w-4 mr-1" />
              5
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCollect}
              className="flex-1 border-border/50 hover:bg-primary/10 text-xs"
            >
              <Star className={`h-4 w-4 mr-1 ${isCollected ? 'fill-current text-yellow-500' : ''}`} />
              50
            </Button>
          </div>
        </div>
      </Card>
    
    <VideoHoverTooltip
      title={title}
      creator={creator}
      description={`A ${creator} video with ${views.toLocaleString()} views and growing engagement`}
      stats={tooltipStats}
      isVisible={showTooltip}
      position={mousePosition}
    />
    </>
  );
};