import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { theme } from '../theme/theme';

// Import mock data
import roadsData from '../mock/roads.json';

// Types for the data
interface RoadData {
  id: string;
  roadName: string;
  status: string;
  description: string;
  updatedISO: string;
  lat: number;
  lon: number;
}

// Filter types
type FilterType = 'all' | 'closed' | 'planned' | 'clear';

export default function Roads() {
  const [selectedTab, setSelectedTab] = useState<FilterType>('all');
  const [roads, setRoads] = useState<RoadData[]>([]);

  // Load road data
  useEffect(() => {
    setRoads(roadsData);
  }, []);

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'closed':
        return '#EF4444'; // Red
      case 'planned':
        return '#F59E0B'; // Orange
      case 'clear':
        return '#10B981'; // Green
      default:
        return '#6B7280'; // Gray
    }
  };

  // Filter roads based on selected tab
  const filteredRoads = selectedTab === 'all' 
    ? roads 
    : roads.filter(road => road.status.toLowerCase() === selectedTab);

  // Get status counts
  const getStatusCounts = () => {
    return {
      all: roads.length,
      closed: roads.filter(r => r.status.toLowerCase() === 'closed').length,
      planned: roads.filter(r => r.status.toLowerCase() === 'planned').length,
      clear: roads.filter(r => r.status.toLowerCase() === 'clear').length,
    };
  };

  const counts = getStatusCounts();

  // Format time for display
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-NZ', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Render road card
  const renderRoadCard = ({ item }: { item: RoadData }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.roadName}>{item.roadName}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(item.status) }
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <Text style={styles.description}>{item.description}</Text>
      
      <View style={styles.cardFooter}>
        <Text style={styles.updatedTime}>
          Updated: {formatTime(item.updatedISO)}
        </Text>
      </View>
    </View>
  );

  // Render tab button
  const renderTabButton = (tab: FilterType, label: string) => (
    <TouchableOpacity
      key={tab}
      style={[
        styles.tabButton,
        selectedTab === tab && styles.tabButtonActive,
      ]}
      onPress={() => setSelectedTab(tab)}
    >
      <Text style={[
        styles.tabButtonText,
        selectedTab === tab && styles.tabButtonTextActive,
      ]}>
        {label}
      </Text>
      <View style={[
        styles.tabCount,
        selectedTab === tab && styles.tabCountActive,
      ]}>
        <Text style={[
          styles.tabCountText,
          selectedTab === tab && styles.tabCountTextActive,
        ]}>
          {counts[tab]}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Road Conditions</Text>
        <Text style={styles.subtitle}>Real-time updates on NZ roads</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderTabButton('all', 'All')}
          {renderTabButton('closed', 'Closed')}
          {renderTabButton('planned', 'Planned')}
          {renderTabButton('clear', 'Clear')}
        </ScrollView>
      </View>

      {/* Road Cards */}
      <FlatList
        data={filteredRoads}
        renderItem={renderRoadCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cardsContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No roads found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your filters or check back later
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: theme.radius,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  tabButtonActive: {
    backgroundColor: theme.colors.blue,
    borderColor: theme.colors.blue,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginRight: 6,
  },
  tabButtonTextActive: {
    color: 'white',
  },
  tabCount: {
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  tabCountActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabCountTextActive: {
    color: 'white',
  },
  cardsContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: theme.radius,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  roadName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  updatedTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
