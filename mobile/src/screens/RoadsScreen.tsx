import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { DataService, RoadData } from '../services/mockData';

interface RoadsScreenProps {
  subscriptions: Array<{
    id: string;
    name: string;
    quakes: boolean;
    roading: boolean;
    community: boolean;
  }>;
}

export function RoadsScreen({ subscriptions }: RoadsScreenProps) {
  const [selectedTab, setSelectedTab] = useState('all');
  const [roads, setRoads] = useState<RoadData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load road data for subscribed cities
  useEffect(() => {
    const loadRoadData = async () => {
      setIsLoading(true);
      try {
        // Get cities with roading alerts enabled
        const subscribedCities = subscriptions
          .filter(sub => sub.roading)
          .map(sub => sub.name);

        const roadData = subscribedCities.length > 0 
          ? await DataService.getRoadData(subscribedCities)
          : [];
        setRoads(roadData);
      } catch (error) {
        console.error('Failed to load road data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRoadData();
  }, [subscriptions]); // Changed dependency to subscriptions instead of subscribedCities

  const getStatusBadge = (status: RoadData['status']) => {
    switch (status) {
      case 'closed':
        return (
          <Badge variant="destructive" className="bg-destructive text-destructive-foreground">
            Closed
          </Badge>
        );
      case 'planned':
        return (
          <Badge className="bg-warning text-warning-foreground">
            Planned
          </Badge>
        );
      case 'clear':
        return (
          <Badge className="bg-accent text-accent-foreground">
            Clear
          </Badge>
        );
      default:
        return null;
    }
  };

  const filterRoads = (status?: string) => {
    if (!status || status === 'all') return roads;
    return roads.filter(road => road.status === status);
  };

  const getStatusCounts = () => {
    return {
      all: roads.length,
      closed: roads.filter(r => r.status === 'closed').length,
      planned: roads.filter(r => r.status === 'planned').length,
      clear: roads.filter(r => r.status === 'clear').length,
    };
  };

  const counts = getStatusCounts();
  
  // Get subscribed cities for display (recalculate only when needed)
  const subscribedCities = subscriptions
    .filter(sub => sub.roading)
    .map(sub => sub.name);

  if (subscribedCities.length === 0) {
    return (
      <View style={{ padding: 16, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ alignItems: 'center' }}>
          <Ionicons name="location" size={48} color="#6B7280" style={{ marginBottom: 16 }} />
          <Text style={{ fontSize: 18, fontWeight: '500', color: '#111827', marginBottom: 8 }}>No Road Alerts Enabled</Text>
          <Text style={{ color: '#6B7280', textAlign: 'center', maxWidth: 300 }}>
            Enable road alerts for your cities in the dashboard to see road conditions here
          </Text>
        </View>
      </View>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Road Conditions
        </h2>
        <p className="text-muted-foreground">
          Roads for {subscribedCities.join(', ')} • {roads.length} roads found
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading road conditions...</p>
          </div>
        </div>
      ) : roads.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Road Data</h3>
            <p className="text-muted-foreground">
              No road conditions available for your selected cities
            </p>
          </div>
        </div>
      ) : (
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="text-xs">
              All ({counts.all})
            </TabsTrigger>
            <TabsTrigger value="closed" className="text-xs">
              Closed ({counts.closed})
            </TabsTrigger>
            <TabsTrigger value="planned" className="text-xs">
              Planned ({counts.planned})
            </TabsTrigger>
            <TabsTrigger value="clear" className="text-xs">
              Clear ({counts.clear})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {filterRoads('all').length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No roads in this category</div>
            ) : (
              filterRoads('all').map(road => (
                <RoadCard key={road.id} road={road} getStatusBadge={getStatusBadge} />
              ))
            )}
          </TabsContent>

          <TabsContent value="closed" className="space-y-3">
            {filterRoads('closed').length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No closed roads</div>
            ) : (
              filterRoads('closed').map(road => (
                <RoadCard key={road.id} road={road} getStatusBadge={getStatusBadge} />
              ))
            )}
          </TabsContent>

          <TabsContent value="planned" className="space-y-3">
            {filterRoads('planned').length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No planned closures</div>
            ) : (
              filterRoads('planned').map(road => (
                <RoadCard key={road.id} road={road} getStatusBadge={getStatusBadge} />
              ))
            )}
          </TabsContent>

          <TabsContent value="clear" className="space-y-3">
            {filterRoads('clear').length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No clear roads</div>
            ) : (
              filterRoads('clear').map(road => (
                <RoadCard key={road.id} road={road} getStatusBadge={getStatusBadge} />
              ))
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

interface RoadCardProps {
  road: RoadData;
  getStatusBadge: (status: RoadData['status']) => React.ReactNode;
}

function RoadCard({ road, getStatusBadge }: RoadCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-foreground">{road.name}</h3>
          {getStatusBadge(road.status)}
        </div>
        
        <p className="text-sm text-muted-foreground mb-3">
          {road.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{road.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{road.lastUpdated}</span>
          </div>
        </div>
        
        {road.estimatedDuration && (
          <div className="mt-2 text-xs text-muted-foreground">
            <span className="font-medium">Duration:</span> {road.estimatedDuration}
          </div>
        )}
      </CardContent>
    </Card>
  );
}