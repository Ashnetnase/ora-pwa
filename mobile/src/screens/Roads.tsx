import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { AlertTriangle, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

interface RoadData {
  id: string;
  city: string;
  name: string;
  status: 'closed' | 'planned' | 'clear';
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  lastUpdated: string;
  estimatedDuration?: string;
}

// Mock data matching your original structure
const mockRoads: RoadData[] = [
  {
    id: 'r1',
    city: 'Auckland',
    name: 'SH1 - Desert Rd',
    status: 'closed',
    description: 'Snow/ice conditions',
    location: 'Desert Road',
    latitude: -39.336,
    longitude: 175.751,
    lastUpdated: '2024-01-15T08:40:00Z',
    estimatedDuration: '2-3 hours',
  },
  {
    id: 'r2',
    city: 'Wellington',
    name: 'SH2 - Wairarapa',
    status: 'planned',
    description: 'Maintenance work',
    location: 'Wairarapa',
    latitude: -41.12,
    longitude: 175.53,
    lastUpdated: '2024-01-15T07:10:00Z',
    estimatedDuration: '4-6 hours',
  },
  {
    id: 'r3',
    city: 'Christchurch',
    name: 'SH73 - Porters Pass',
    status: 'closed',
    description: 'Avalanche risk',
    location: 'Porters Pass',
    latitude: -43.3,
    longitude: 171.7,
    lastUpdated: '2024-01-15T06:30:00Z',
    estimatedDuration: '6-8 hours',
  },
  {
    id: 'r4',
    city: 'Hamilton',
    name: 'SH1 - Waikato Expressway',
    status: 'clear',
    description: 'All lanes open',
    location: 'Waikato Expressway',
    latitude: -37.787,
    longitude: 175.279,
    lastUpdated: '2024-01-15T09:00:00Z',
  },
  {
    id: 'r5',
    city: 'Tauranga',
    name: 'SH2 - Kaimai Ranges',
    status: 'planned',
    description: 'Resurfacing work',
    location: 'Kaimai Ranges',
    latitude: -37.688,
    longitude: 176.165,
    lastUpdated: '2024-01-15T05:15:00Z',
    estimatedDuration: '3-4 hours',
  },
];

export default function Roads() {
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setIsError] = useState(false);

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const getStatusBadge = (status: RoadData['status']) => {
    switch (status) {
      case 'closed':
        return <Badge style={styles.closedBadge}>Closed</Badge>;
      case 'planned':
        return <Badge style={styles.plannedBadge}>Planned</Badge>;
      case 'clear':
        return <Badge style={styles.clearBadge}>Clear</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: RoadData['status']) => {
    switch (status) {
      case 'closed':
        return <XCircle size={20} color="#EF4444" />;
      case 'planned':
        return <Clock size={20} color="#F59E0B" />;
      case 'clear':
        return <CheckCircle size={20} color="#10B981" />;
      default:
        return <AlertTriangle size={20} color="#6B7280" />;
    }
  };

  const getFilteredRoads = () => {
    if (activeTab === 'all') return mockRoads;
    return mockRoads.filter(road => road.status === activeTab);
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-NZ', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const RoadCard = ({ road }: { road: RoadData }) => (
    <Card key={road.id} style={styles.roadCard}>
      <CardContent style={styles.roadCardContent}>
        <View style={styles.roadHeader}>
          <View style={styles.roadInfo}>
            <Text style={styles.roadName}>{road.name}</Text>
            <Text style={styles.roadLocation}>{road.location}</Text>
          </View>
          <View style={styles.statusContainer}>
            {getStatusIcon(road.status)}
            {getStatusBadge(road.status)}
          </View>
        </View>
        
        <Text style={styles.roadDescription}>{road.description}</Text>
        
        <View style={styles.roadFooter}>
          <View style={styles.timeInfo}>
            <Clock size={16} color="#6B7280" />
            <Text style={styles.timeText}>
              Updated {formatTime(road.lastUpdated)}
            </Text>
          </View>
          
          {road.estimatedDuration && (
            <View style={styles.durationInfo}>
              <AlertTriangle size={16} color="#F59E0B" />
              <Text style={styles.durationText}>
                Est. {road.estimatedDuration}
              </Text>
            </View>
          )}
        </View>
      </CardContent>
    </Card>
  );

  const RoadsList = ({ roads }: { roads: RoadData[] }) => (
    <View style={styles.roadsList}>
      {roads.map(road => (
        <RoadCard key={road.id} road={road} />
      ))}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading road conditions...</Text>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load road conditions</Text>
        <Text style={styles.errorSubtext}>Please try again later</Text>
      </View>
    );
  }

  const filteredRoads = getFilteredRoads();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Road Conditions</Text>
        <Text style={styles.subtitle}>
          Real-time updates on New Zealand highways and major roads
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList style={styles.tabsList}>
            <TabsTrigger value="all" style={styles.tabTrigger}>
              All ({mockRoads.length})
            </TabsTrigger>
            <TabsTrigger value="closed" style={styles.tabTrigger}>
              Closed ({mockRoads.filter(r => r.status === 'closed').length})
            </TabsTrigger>
            <TabsTrigger value="planned" style={styles.tabTrigger}>
              Planned ({mockRoads.filter(r => r.status === 'planned').length})
            </TabsTrigger>
            <TabsTrigger value="clear" style={styles.tabTrigger}>
              Clear ({mockRoads.filter(r => r.status === 'clear').length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </View>

      {/* Content */}
      <View style={styles.tabContent}>
        {filteredRoads.length === 0 ? (
          <Card style={styles.emptyCard}>
            <CardContent style={styles.emptyCardContent}>
              <AlertTriangle size={48} color="#6B7280" style={styles.emptyIcon} />
              <Text style={styles.emptyTitle}>No roads found</Text>
              <Text style={styles.emptySubtitle}>
                No roads match the selected filter
              </Text>
            </CardContent>
          </Card>
        ) : (
          <RoadsList roads={filteredRoads} />
        )}
      </View>

      {/* Summary Stats */}
      <View style={styles.summaryContainer}>
        <Card style={styles.summaryCard}>
          <CardContent style={styles.summaryContent}>
            <Text style={styles.summaryTitle}>Road Status Summary</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>
                  {mockRoads.filter(r => r.status === 'closed').length}
                </Text>
                <Text style={styles.summaryLabel}>Closed</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>
                  {mockRoads.filter(r => r.status === 'planned').length}
                </Text>
                <Text style={styles.summaryLabel}>Planned</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>
                  {mockRoads.filter(r => r.status === 'clear').length}
                </Text>
                <Text style={styles.summaryLabel}>Clear</Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  tabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tabsList: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 4,
  },
  tabTrigger: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  tabContent: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  roadsList: {
    gap: 12,
  },
  roadCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  roadCardContent: {
    padding: 16,
  },
  roadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  roadInfo: {
    flex: 1,
    marginRight: 12,
  },
  roadName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  roadLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusContainer: {
    alignItems: 'center',
    gap: 8,
  },
  roadDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  roadFooter: {
    gap: 8,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#6B7280',
  },
  durationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  durationText: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '500',
  },
  emptyCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  emptyCardContent: {
    padding: 24,
    alignItems: 'center',
  },
  emptyIcon: {
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  summaryContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  summaryContent: {
    padding: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  closedBadge: {
    backgroundColor: '#EF4444',
    color: '#ffffff',
  },
  plannedBadge: {
    backgroundColor: '#F59E0B',
    color: '#ffffff',
  },
  clearBadge: {
    backgroundColor: '#10B981',
    color: '#ffffff',
  },
});
