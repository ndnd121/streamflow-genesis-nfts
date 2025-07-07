import { useState } from "react";
import { Hero } from "@/components/Hero";
import { VideoNFT } from "@/components/VideoNFT";
import { TokenEconomy } from "@/components/TokenEconomy";
import { NodeNetwork } from "@/components/NodeNetwork";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Wallet, 
  Settings, 
  User,
  Bell,
  Menu
} from "lucide-react";

// Mock data for video NFTs
const mockVideoNFTs = [
  {
    id: '1',
    title: 'Epic Gaming Montage',
    creator: 'ProGamer_X',
    thumbnail: 'https://picsum.photos/400/300?random=1',
    price: 150,
    likes: 1247,
    shares: 234,
    views: 15420,
    growthRate: 12.5,
    tokenReward: 125
  },
  {
    id: '2',
    title: 'Crypto Market Analysis',
    creator: 'CryptoAnalyst',
    thumbnail: 'https://picsum.photos/400/300?random=2',
    price: 200,
    likes: 892,
    shares: 156,
    views: 8760,
    growthRate: 8.7,
    tokenReward: 87
  },
  {
    id: '3',
    title: 'Tech Review: Latest AI',
    creator: 'TechReviewer',
    thumbnail: 'https://picsum.photos/400/300?random=3',
    price: 180,
    likes: 2156,
    shares: 445,
    views: 23890,
    growthRate: 22.1,
    tokenReward: 221
  },
  {
    id: '4',
    title: 'Music Video Drop',
    creator: 'ArtistName',
    thumbnail: 'https://picsum.photos/400/300?random=4',
    price: 300,
    likes: 5670,
    shares: 890,
    views: 45230,
    growthRate: -3.2,
    tokenReward: 0
  },
  {
    id: '5',
    title: 'Cooking Tutorial',
    creator: 'ChefMaster',
    thumbnail: 'https://picsum.photos/400/300?random=5',
    price: 120,
    likes: 678,
    shares: 123,
    views: 5670,
    growthRate: 15.8,
    tokenReward: 158
  },
  {
    id: '6',
    title: 'Travel Vlog Adventure',
    creator: 'Wanderlust',
    thumbnail: 'https://picsum.photos/400/300?random=6',
    price: 250,
    likes: 3456,
    shares: 567,
    views: 28900,
    growthRate: 18.3,
    tokenReward: 183
  }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg" />
                <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  VideoToken
                </span>
              </div>
              <Badge variant="outline" className="border-neon-green text-neon-green">
                BETA
              </Badge>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Button
                variant={activeTab === 'marketplace' ? 'gradient' : 'ghost'}
                onClick={() => setActiveTab('marketplace')}
              >
                Marketplace
              </Button>
              <Button
                variant={activeTab === 'economy' ? 'gradient' : 'ghost'}
                onClick={() => setActiveTab('economy')}
              >
                Token Economy
              </Button>
              <Button
                variant={activeTab === 'nodes' ? 'gradient' : 'ghost'}
                onClick={() => setActiveTab('nodes')}
              >
                Node Network
              </Button>
            </nav>

            <div className="flex items-center gap-3">
              <Button size="icon" variant="ghost">
                <Bell className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost">
                <Settings className="h-4 w-4" />
              </Button>
              <Button className="bg-gradient-secondary">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
              <Button size="icon" variant="ghost" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Only show on initial load */}
      {activeTab === 'marketplace' && (
        <Hero />
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'marketplace' && (
          <div className="space-y-8">
            {/* Search and Filters */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search video NFTs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background/50"
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Video NFTs Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Trending Video NFTs</h2>
                <Badge className="bg-gradient-accent text-background">
                  {mockVideoNFTs.length} NFTs Available
                </Badge>
              </div>
              
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {mockVideoNFTs
                  .filter(nft => 
                    nft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    nft.creator.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((nft) => (
                    <VideoNFT key={nft.id} {...nft} />
                  ))
                }
              </div>
            </div>
          </div>
        )}

        {activeTab === 'economy' && <TokenEconomy />}
        {activeTab === 'nodes' && <NodeNetwork />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <div className="w-6 h-6 bg-gradient-primary rounded" />
              <span className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
                VideoToken Platform
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Decentralized video data tokenization platform powered by AI recommendations 
              and distributed node computing.
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span>© 2024 VideoToken</span>
              <span>•</span>
              <span>Privacy</span>
              <span>•</span>
              <span>Terms</span>
              <span>•</span>
              <span>Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;