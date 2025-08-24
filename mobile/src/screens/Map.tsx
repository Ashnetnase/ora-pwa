import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MapPin, AlertTriangle, Activity, Circle, Triangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

interface QuakeData {
  id: string;
  city: string;
  latitude: number;
  longitude: number;
  magnitude: number;
  depth: number;
  time: string;
  intensity: string;
}

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

interface CommunityReport {
  id: string;
  city: string;
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

// Mock data matching your original structure
const mockQuakes: QuakeData[] = [
  {
    id: 'q1',
    city: 'Auckland',
    latitude: -36.8485,
    longitude: 174.7633,
    magnitude: 3.2,
    depth: 15,
    time: '2024-01-15T14:30:00Z',
    intensity: 'Light',
  },
  {
    id: 'q2',
    city: 'Wellington',
    latitude: -41.2865,
    longitude: 174.7762,
    magnitude: 4.1,
    depth: 22,
    time: '2024-01-15T08:15:00Z',
    intensity: 'Moderate',
  },
  {
    id: 'q3',
    city: 'Christchurch',
    latitude: -43.5321,
    longitude: 172.6362,
    magnitude: 2.8,
    depth: 8,
    time: '2024-01-14T19:45:00Z',
    intensity: 'Light',
  },
];

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
];

const mockReports: CommunityReport[] = [
  {
    id: 'c1',
    city: 'Auckland',
    title: 'Surface flooding',
    description: 'Water over road',
    category: 'Flood',
    latitude: -36.85,
    longitude: 174.76,
    timestamp: '2024-01-15T08:20:00Z',
    severity: 'medium',
  },
  {
    id: 'c2',
    city: 'Wellington',
    title: 'Small slip',
    description: 'Debris on shoulder',
    category: 'Slip',
    latitude: -41.29,
    longitude: 174.78,
    timestamp: '2024-01-15T06:55:00Z',
    severity: 'low',
  },
];

export default function Map() {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(['quakes', 'roading', 'community'])
  );
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  const toggleFilter = (filter: string) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(filter)) {
      newFilters.delete(filter);
    } else {
      newFilters.add(filter);
    }
    setActiveFilters(newFilters);
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('en-NZ', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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

  const getSeverityBadge = (severity: CommunityReport['severity']) => {
    switch (severity) {
      case 'high':
        return <Badge style={styles.highSeverityBadge}>High</Badge>;
      case 'medium':
        return <Badge style={styles.mediumSeverityBadge}>Medium</Badge>;
      case 'low':
        return <Badge style={styles.lowSeverityBadge}>Low</Badge>;
      default:
        return null;
    }
  };

  const getSelectedMarkerData = () => {
    if (!selectedMarker) return null;
    
    const quake = mockQuakes.find(q => q.id === selectedMarker);
    if (quake) return { type: 'quake' as const, data: quake };
    
    const road = mockRoads.find(r => r.id === selectedMarker);
    if (road) return { type: 'road' as const, data: road };
    
    const report = mockReports.find(r => r.id === selectedMarker);
    if (report) return { type: 'report' as const, data: report };
    
    return null;
  };

  const selectedData = getSelectedMarkerData();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Map</Text>
        <Text style={styles.subtitle}>
          Real-time alerts and incidents across New Zealand
        </Text>
      </View>

      {/* Filter Toggles */}
      <View style={styles.filterContainer}>
        <Button
          variant={activeFilters.has('quakes') ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleFilter('quakes')}
          style={activeFilters.has('quakes') ? styles.filterButtonActive : styles.filterButton}
        >
          <Circle size={16} />
          <Text style={[styles.filterButtonText, activeFilters.has('quakes') && styles.filterButtonTextActive]}>
            Quakes ({mockQuakes.length})
          </Text>
        </Button>
        
        <Button
          variant={activeFilters.has('roading') ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleFilter('roading')}
          style={activeFilters.has('roading') ? styles.filterButtonActive : styles.filterButton}
        >
          <Triangle size={16} />
          <Text style={[styles.filterButtonText, activeFilters.has('roading') && styles.filterButtonTextActive]}>
            Roading ({mockRoads.length})
          </Text>
        </Button>
        
        <Button
          variant={activeFilters.has('community') ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleFilter('community')}
          style={activeFilters.has('community') ? styles.filterButtonActive : styles.filterButton}
        >
          <MapPin size={16} />
          <Text style={[styles.filterButtonText, activeFilters.has('community') && styles.filterButtonTextActive]}>
            Community ({mockReports.length})
          </Text>
        </Button>
      </View>

      {/* Map Container */}
      <Card style={styles.mapCard}>
        <CardContent style={styles.mapContent}>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>Interactive Map</Text>
            <Text style={styles.mapPlaceholderSubtext}>Centered on New Zealand</Text>
            
            {/* Mock Markers */}
            {activeFilters.has('quakes') && mockQuakes.map((quake) => (
              <View
                key={quake.id}
                style={[styles.marker, styles.quakeMarker, { left: '60%', top: '40%' }]}
                onTouchEnd={() => setSelectedMarker(quake.id)}
              >
                <View style={styles.quakeDot} />
                <Text style={styles.markerLabel}>M{quake.magnitude}</Text>
              </View>
            ))}
            
            {activeFilters.has('roading') && mockRoads.map((road) => (
              <View
                key={road.id}
                style={[styles.marker, styles.roadMarker, { left: '45%', top: '35%' }]}
                onTouchEnd={() => setSelectedMarker(road.id)}
              >
                <Triangle size={16} color="#F59E0B" />
              </View>
            ))}
            
            {activeFilters.has('community') && mockReports.map((report) => (
              <View
                key={report.id}
                style={[styles.marker, styles.communityMarker, { left: '70%', top: '50%' }]}
                onTouchEnd={() => setSelectedMarker(report.id)}
              >
                <MapPin size={16} color="#10B981" />
              </View>
            ))}
            
            {/* Floating Legend */}
            <View style={styles.legend}>
              <Text style={styles.legendTitle}>Legend</Text>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={styles.legendDot} />
                  <Text style={styles.legendText}>Quakes (magnitude)</Text>
                </View>
                <View style={styles.legendItem}>
                  <Triangle size={12} color="#F59E0B" />
                  <Text style={styles.legendText}>Road closures</Text>
                </View>
                <View style={styles.legendItem}>
                  <MapPin size={12} color="#10B981" />
                  <Text style={styles.legendText}>Community reports</Text>
                </View>
              </View>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* Data Summary */}
      <View style={styles.summaryContainer}>
        <Card style={styles.summaryCard}>
          <CardContent style={styles.summaryContent}>
            <Text style={styles.summaryTitle}>Active Alerts</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{mockQuakes.length}</Text>
                <Text style={styles.summaryLabel}>Earthquakes</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{mockRoads.length}</Text>
                <Text style={styles.summaryLabel}>Road Issues</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryNumber}>{mockReports.length}</Text>
                <Text style={styles.summaryLabel}>Reports</Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* Selected Marker Info */}
      {selectedMarker && selectedData && (
        <Card style={styles.infoCard}>
          <CardHeader>
            <CardTitle style={styles.infoCardTitle}>
              {selectedData.type === 'quake' && 'Earthquake Alert'}
              {selectedData.type === 'road' && 'Road Condition'}
              {selectedData.type === 'report' && 'Community Report'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedData.type === 'quake' && (
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>{selectedData.data.city}</Text>
                <Text style={styles.infoDescription}>
                  Magnitude {selectedData.data.magnitude} • Depth {selectedData.data.depth}km • {selectedData.data.intensity}
                </Text>
                <Text style={styles.infoTime}>
                  {formatTime(selectedData.data.time)}
                </Text>
              </View>
            )}
            
            {selectedData.type === 'road' && (
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>{selectedData.data.name}</Text>
                <Text style={styles.infoDescription}>{selectedData.data.description}</Text>
                <View style={styles.infoStatus}>
                  {getStatusBadge(selectedData.data.status)}
                  <Text style={styles.infoTime}>
                    Updated {formatTime(selectedData.data.lastUpdated)}
                  </Text>
                </View>
                {selectedData.data.estimatedDuration && (
                  <Text style={styles.infoDuration}>
                    Est. Duration: {selectedData.data.estimatedDuration}
                  </Text>
                )}
              </View>
            )}
            
            {selectedData.type === 'report' && (
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>{selectedData.data.title}</Text>
                <Text style={styles.infoDescription}>{selectedData.data.description}</Text>
                <View style={styles.infoStatus}>
                  {getSeverityBadge(selectedData.data.severity)}
                  <Text style={styles.infoCategory}>Category: {selectedData.data.category}</Text>
                </View>
                <Text style={styles.infoTime}>
                  Reported {formatTime(selectedData.data.timestamp)}
                </Text>
              </View>
            )}
          </CardContent>
        </Card>
      )}
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
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#ffffff',
  },
  filterButtonActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  mapCard: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  mapContent: {
    padding: 0,
  },
  mapPlaceholder: {
    height: 384,
    backgroundColor: '#F0F9FF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mapPlaceholderText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 8,
  },
  mapPlaceholderSubtext: {
    fontSize: 16,
    color: '#6B7280',
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quakeMarker: {
    width: 32,
    height: 32,
  },
  quakeDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    marginBottom: 4,
  },
  roadMarker: {
    width: 32,
    height: 32,
  },
  communityMarker: {
    width: 32,
    height: 32,
  },
  markerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  legend: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: 200,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  legendRow: {
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
  legendText: {
    fontSize: 12,
    color: '#374151',
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
  infoCard: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  infoContent: {
    gap: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  infoDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  infoStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  infoCategory: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  infoTime: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoDuration: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
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
  highSeverityBadge: {
    backgroundColor: '#EF4444',
    color: '#ffffff',
  },
  mediumSeverityBadge: {
    backgroundColor: '#F59E0B',
    color: '#ffffff',
  },
  lowSeverityBadge: {
    backgroundColor: '#10B981',
    color: '#ffffff',
  },
});
