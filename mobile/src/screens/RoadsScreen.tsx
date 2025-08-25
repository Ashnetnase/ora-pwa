import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MapPin, Clock, Triangle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { DataService, RoadData } from '../services/mockData';

// Design System Colors (matching MapScreen)
const COLORS = {
  primary: '#2563EB',
  accent: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  background: '#F9FAFB',
  white: '#FFFFFF',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  }
};

// Road Details Modal Component using Portal
const RoadDetailsModal = ({ road, onClose, getRoadStatusDetails, COLORS }: {
  road: RoadData;
  onClose: () => void;
  getRoadStatusDetails: (severity: string) => any;
  COLORS: any;
}) => {
  const modalContent = (
    <div 
      className="fixed inset-0 flex items-center justify-center"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="relative w-full max-w-md mx-4 rounded-lg shadow-xl border"
        style={{ 
          backgroundColor: COLORS.white,
          borderColor: COLORS.gray[200],
          maxHeight: 'calc(100vh - 100px)',
          zIndex: 999999
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: COLORS.gray[200] }}
        >
          <div className="flex items-center gap-2">
            <Triangle className="w-5 h-5 fill-current" style={{ color: COLORS.warning }} />
            <h2 className="text-lg font-semibold" style={{ color: COLORS.gray[900] }}>
              Road Condition Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
            style={{ color: COLORS.gray[500] }}
          >
            <span className="text-xl font-bold">×</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {(() => {
            const statusDetails = getRoadStatusDetails(road.status || '');
            return (
              <div className="space-y-4">
                {/* Road Name */}
                <div>
                  <h3 className="text-lg font-semibold mb-1" style={{ color: COLORS.gray[900] }}>
                    {road.name}
                  </h3>
                  <p className="text-sm" style={{ color: COLORS.gray[600] }}>
                    📍 {road.city}
                  </p>
                </div>

                {/* Status Badge */}
                <div 
                  className="p-3 rounded-lg border-l-4"
                  style={{ 
                    backgroundColor: statusDetails.bgColor,
                    borderColor: statusDetails.color
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="font-semibold text-sm"
                      style={{ color: statusDetails.color }}
                    >
                      {statusDetails.status}
                    </span>
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: statusDetails.color,
                        color: COLORS.white
                      }}
                    >
                      {statusDetails.impact} Impact
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: COLORS.gray[700] }}>
                    {statusDetails.description}
                  </p>
                </div>

                {/* Current Description */}
                <div>
                  <h4 className="font-medium mb-2" style={{ color: COLORS.gray[900] }}>
                    Current Situation
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: COLORS.gray[600] }}>
                    {road.description}
                  </p>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 gap-3">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: COLORS.gray[50] }}
                  >
                    <h5 className="font-medium text-sm mb-1" style={{ color: COLORS.gray[900] }}>
                      Expected Duration
                    </h5>
                    <p className="text-sm" style={{ color: COLORS.gray[600] }}>
                      {road.estimatedDuration || statusDetails.expectedDuration}
                    </p>
                  </div>

                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: COLORS.gray[50] }}
                  >
                    <h5 className="font-medium text-sm mb-1" style={{ color: COLORS.gray[900] }}>
                      Travel Advice
                    </h5>
                    <p className="text-sm" style={{ color: COLORS.gray[600] }}>
                      {statusDetails.advice}
                    </p>
                  </div>
                </div>

                {/* Location Information */}
                <div 
                  className="p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: '#f0f9ff',
                    borderColor: COLORS.primary
                  }}
                >
                  <h5 className="font-medium text-sm mb-2" style={{ color: COLORS.primary }}>
                    Location Details
                  </h5>
                  <div className="space-y-1 text-sm" style={{ color: COLORS.gray[600] }}>
                    <p>📍 City: {road.city}</p>
                    <p>🗺️ Location: {road.location}</p>
                    <p>🌍 Coordinates: {road.latitude.toFixed(4)}, {road.longitude.toFixed(4)}</p>
                    <p>⏰ Last Updated: {road.lastUpdated}</p>
                  </div>
                </div>

                {/* Emergency Contacts */}
                <div 
                  className="p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: '#fef2f2',
                    borderColor: COLORS.error
                  }}
                >
                  <h5 className="font-medium text-sm mb-2" style={{ color: COLORS.error }}>
                    Emergency Information
                  </h5>
                  <div className="space-y-1 text-sm" style={{ color: COLORS.gray[600] }}>
                    <p>🚨 Emergency: 111</p>
                    <p>🛣️ Road Info: *555 (*ROA)</p>
                    <p>ℹ️ NZTA: 0800 4 HIGHWAYS</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Modal Footer */}
        <div 
          className="flex justify-end gap-2 p-4 border-t"
          style={{ borderColor: COLORS.gray[200] }}
        >
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="px-4 py-2 text-sm"
          >
            Close
          </Button>
          <Button
            size="sm"
            className="px-4 py-2 text-sm text-white"
            style={{ backgroundColor: COLORS.primary }}
            onClick={onClose}
          >
            Get Directions
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

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
  const [detailedRoadView, setDetailedRoadView] = useState<RoadData | null>(null);

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

  // Function to get detailed road status information (matching MapScreen)
  const getRoadStatusDetails = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'closed':
        return {
          status: 'Road Closed',
          color: COLORS.error,
          bgColor: '#fee2e2',
          description: 'This road is currently closed to all traffic. Alternative routes should be used.',
          impact: 'High',
          expectedDuration: 'Unknown',
          advice: 'Use alternative routes. Check for updates regularly.'
        };
      case 'planned':
        return {
          status: 'Planned Work',
          color: COLORS.warning,
          bgColor: '#fef3c7',
          description: 'Scheduled maintenance or construction work is planned for this road.',
          impact: 'Medium',
          expectedDuration: 'Varies',
          advice: 'Plan for delays. Consider alternative routes during work hours.'
        };
      case 'clear':
        return {
          status: 'Road Clear',
          color: COLORS.accent,
          bgColor: '#d1fae5',
          description: 'This road is currently clear with normal traffic conditions.',
          impact: 'Low',
          expectedDuration: 'N/A',
          advice: 'Normal driving conditions. Stay alert for changing conditions.'
        };
      default:
        return {
          status: 'Unknown Status',
          color: COLORS.gray[500],
          bgColor: COLORS.gray[100],
          description: 'Road condition information is not available at this time.',
          impact: 'Unknown',
          expectedDuration: 'Unknown',
          advice: 'Exercise caution and check for updates.'
        };
    }
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
                <RoadCard key={road.id} road={road} getStatusBadge={getStatusBadge} onClick={() => setDetailedRoadView(road)} />
              ))
            )}
          </TabsContent>

          <TabsContent value="closed" className="space-y-3">
            {filterRoads('closed').length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No closed roads</div>
            ) : (
              filterRoads('closed').map(road => (
                <RoadCard key={road.id} road={road} getStatusBadge={getStatusBadge} onClick={() => setDetailedRoadView(road)} />
              ))
            )}
          </TabsContent>

          <TabsContent value="planned" className="space-y-3">
            {filterRoads('planned').length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No planned closures</div>
            ) : (
              filterRoads('planned').map(road => (
                <RoadCard key={road.id} road={road} getStatusBadge={getStatusBadge} onClick={() => setDetailedRoadView(road)} />
              ))
            )}
          </TabsContent>

          <TabsContent value="clear" className="space-y-3">
            {filterRoads('clear').length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No clear roads</div>
            ) : (
              filterRoads('clear').map(road => (
                <RoadCard key={road.id} road={road} getStatusBadge={getStatusBadge} onClick={() => setDetailedRoadView(road)} />
              ))
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Detailed Road Condition Modal using Portal */}
      {detailedRoadView && (
        <RoadDetailsModal
          road={detailedRoadView}
          onClose={() => setDetailedRoadView(null)}
          getRoadStatusDetails={getRoadStatusDetails}
          COLORS={COLORS}
        />
      )}
    </div>
  );
}

interface RoadCardProps {
  road: RoadData;
  getStatusBadge: (status: RoadData['status']) => React.ReactNode;
  onClick: () => void;
}

function RoadCard({ road, getStatusBadge, onClick }: RoadCardProps) {
  return (
    <Card className="shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
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