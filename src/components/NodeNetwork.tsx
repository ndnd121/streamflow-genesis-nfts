import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Server, Cpu, HardDrive, Zap, CheckCircle, AlertCircle, Clock, ShoppingCart } from "lucide-react";
import { NodePurchaseSection } from "@/components/NodePurchaseSection";

interface Node {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'offline';
  computePower: number;
  storage: number;
  tasksCompleted: number;
  earnings: number;
  location: string;
}

const mockNodes: Node[] = [
  {
    id: '1',
    name: 'Node-Alpha-7',
    status: 'active',
    computePower: 85,
    storage: 67,
    tasksCompleted: 1247,
    earnings: 15420,
    location: 'US-East'
  },
  {
    id: '2',
    name: 'Node-Beta-3',
    status: 'active',
    computePower: 92,
    storage: 45,
    tasksCompleted: 2156,
    earnings: 28750,
    location: 'EU-West'
  },
  {
    id: '3',
    name: 'Node-Gamma-1',
    status: 'pending',
    computePower: 0,
    storage: 0,
    tasksCompleted: 0,
    earnings: 0,
    location: 'Asia-Pacific'
  }
];

export const NodeNetwork = () => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-neon-green" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-neon-cyan" />;
      case 'offline':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-neon-green/20 text-neon-green border-neon-green/50">Active</Badge>;
      case 'pending':
        return <Badge className="bg-neon-cyan/20 text-neon-cyan border-neon-cyan/50">Pending</Badge>;
      case 'offline':
        return <Badge variant="destructive">Offline</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-secondary bg-clip-text text-transparent">
          Node Network
        </h2>
        <p className="text-muted-foreground">
          Decentralized computing nodes for video transcoding and data extraction
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Nodes</p>
              <p className="text-2xl font-bold text-foreground">234</p>
            </div>
            <Server className="h-8 w-8 text-neon-purple" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Compute</p>
              <p className="text-2xl font-bold text-foreground">15.7 PH/s</p>
            </div>
            <Cpu className="h-8 w-8 text-neon-cyan" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-card to-secondary/20 border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Videos Processed</p>
              <p className="text-2xl font-bold text-foreground">47.2K</p>
            </div>
            <Zap className="h-8 w-8 text-neon-green" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-foreground">My Nodes</h3>
            <Button className="bg-gradient-primary">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Purchase Node
            </Button>
          </div>
          
          <div className="space-y-4">
            {mockNodes.map((node) => (
              <Card key={node.id} className="p-4 bg-secondary/20 border-border/30">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(node.status)}
                    <h4 className="font-semibold text-foreground">{node.name}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(node.status)}
                    <Badge variant="outline" className="text-xs">
                      {node.location}
                    </Badge>
                  </div>
                </div>

                {node.status === 'active' && (
                  <>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Cpu className="h-3 w-3 text-neon-cyan" />
                          <span className="text-xs text-muted-foreground">Compute</span>
                        </div>
                        <Progress value={node.computePower} className="h-1.5" />
                        <span className="text-xs text-foreground">{node.computePower}%</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <HardDrive className="h-3 w-3 text-neon-purple" />
                          <span className="text-xs text-muted-foreground">Storage</span>
                        </div>
                        <Progress value={node.storage} className="h-1.5" />
                        <span className="text-xs text-foreground">{node.storage}%</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="text-muted-foreground">Tasks: </span>
                        <span className="text-foreground font-medium">{node.tasksCompleted}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Earned: </span>
                        <span className="text-neon-green font-medium">{node.earnings} TOKENS</span>
                      </div>
                    </div>
                  </>
                )}

                {node.status === 'pending' && (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-2">Node deployment in progress...</p>
                    <Progress value={65} className="h-2" />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
          <h3 className="text-xl font-semibold mb-4 text-foreground">Network Stats</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-foreground mb-3">Geographic Distribution</h4>
              <div className="space-y-2">
                {[
                  { region: 'North America', nodes: 89, percentage: 38 },
                  { region: 'Europe', nodes: 76, percentage: 32 },
                  { region: 'Asia Pacific', nodes: 52, percentage: 22 },
                  { region: 'Others', nodes: 17, percentage: 8 }
                ].map((region) => (
                  <div key={region.region} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{region.region}</span>
                    <div className="flex items-center gap-3">
                      <Progress value={region.percentage} className="w-20 h-2" />
                      <span className="text-sm text-foreground w-8">{region.nodes}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-3">Recent Activity</h4>
              <div className="space-y-2">
                {[
                  { action: 'Video transcoded', node: 'Node-Alpha-7', time: '2m ago' },
                  { action: 'Data extracted', node: 'Node-Beta-3', time: '5m ago' },
                  { action: 'NFT minted', node: 'Node-Gamma-2', time: '8m ago' },
                  { action: 'Reward distributed', node: 'Node-Delta-1', time: '12m ago' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded bg-secondary/10">
                    <div>
                      <p className="text-sm text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.node}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 节点购买区域 */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="text-center mb-4">
          <h3 className="text-2xl font-semibold bg-gradient-secondary bg-clip-text text-transparent">
            Purchase Computing Nodes
          </h3>
          <p className="text-muted-foreground mt-2">
            Join the decentralized network and earn rewards
          </p>
        </div>
        <NodePurchaseSection />
      </Card>
    </div>
  );
};