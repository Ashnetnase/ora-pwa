import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import MapView, { Marker, Callout, Region } from 'react-native-maps';
import { theme } from '../theme/theme';

// Import mock data
import quakesData from '../mock/quakes.json';
import roadsData from '../mock/roads.json';
import reportsData from '../mock/reports.json';

// Types for the data
interface QuakeData {
  id: string;
  magnitude: number;
  depthKm: number;
  timeISO: string;
  place: string;
  lat: number;
  lon: number;
}

interface RoadData {
  id: string;
  roadName: string;
  status: string;
  description: string;
  updatedISO: string;
  lat: number;
  lon: number;
}

interface ReportData {
  id: string;
  title: string;
  description: string;
  category: string;
  createdISO: string;
  lat: number;
  lon: number;
}

// Filter types
type FilterType = 'quakes' | 'roading' | 'community';

export default function Map() {
  const [activeFilters, setActiveFilters] = useState<Set<FilterType>>(
    new Set(['quakes', 'roading', 'community'])
  );

  // NZ center coordinates
  const initialRegion: Region = {
    latitude: -41,
    longitude: 174,
    latitudeDelta: 8,
    longitudeDelta: 8,
  };

  // Toggle filter function
  const toggleFilter = (filter: FilterType) => {
    const newFilters = new Set(activeFilters);
    if (newFilters.has(filter)) {
      newFilters.delete(filter);
    } else {
      newFilters.add(filter);
    }
    setActiveFilters(newFilters);
  };

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

  // Filter data based on active filters
  const filteredQuakes = activeFilters.has('quakes') ? quakesData : [];
  const filteredRoads = activeFilters.has('roading') ? roadsData : [];
  const filteredReports = activeFilters.has('community') ? reportsData : [];

  return (
    <View style={styles.container}>
      {/* Filter Toggle Chips */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              activeFilters.has('quakes') && styles.filterChipActive,
            ]}
            onPress={() => toggleFilter('quakes')}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilters.has('quakes') && styles.filterChipTextActive,
              ]}
            >
              Quakes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              activeFilters.has('roading') && styles.filterChipActive,
            ]}
            onPress={() => toggleFilter('roading')}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilters.has('roading') && styles.filterChipTextActive,
              ]}
            >
              Roading
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              activeFilters.has('community') && styles.filterChipActive,
            ]}
            onPress={() => toggleFilter('community')}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilters.has('community') && styles.filterChipTextActive,
              ]}
            >
              Community
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {/* Quake Markers */}
        {filteredQuakes.map((quake: QuakeData) => (
          <Marker
            key={quake.id}
            coordinate={{ latitude: quake.lat, longitude: quake.lon }}
            pinColor="blue"
          >
            <View style={styles.quakeMarker}>
              <Text style={styles.quakeMagnitude}>{quake.magnitude}</Text>
            </View>
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>M{quake.magnitude} Earthquake</Text>
                <Text style={styles.calloutDescription}>{quake.place}</Text>
                <Text style={styles.calloutTime}>{formatTime(quake.timeISO)}</Text>
                <Text style={styles.calloutDetail}>Depth: {quake.depthKm}km</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Road Markers */}
        {filteredRoads.map((road: RoadData) => (
          <Marker
            key={road.id}
            coordinate={{ latitude: road.lat, longitude: road.lon }}
          >
            <View style={styles.roadMarker}>
              <Text style={styles.roadMarkerText}>!</Text>
            </View>
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{road.roadName}</Text>
                <Text style={styles.calloutDescription}>{road.description}</Text>
                <Text style={styles.calloutTime}>{formatTime(road.updatedISO)}</Text>
                <Text style={styles.calloutDetail}>Status: {road.status}</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Community Report Markers */}
        {filteredReports.map((report: ReportData) => (
          <Marker
            key={report.id}
            coordinate={{ latitude: report.lat, longitude: report.lon }}
            pinColor="green"
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{report.title}</Text>
                <Text style={styles.calloutDescription}>{report.description}</Text>
                <Text style={styles.calloutTime}>{formatTime(report.createdISO)}</Text>
                <Text style={styles.calloutDetail}>Category: {report.category}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Floating Legend */}
      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={styles.legendDot} />
            <Text style={styles.legendText}>Quakes</Text>
          </View>
        </View>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={styles.legendTriangle} />
            <Text style={styles.legendText}>Roading</Text>
          </View>
        </View>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={styles.legendPin} />
            <Text style={styles.legendText}>Community</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: theme.radius,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  filterChipActive: {
    backgroundColor: theme.colors.blue,
    borderColor: theme.colors.blue,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  filterChipTextActive: {
    color: 'white',
  },
  map: {
    flex: 1,
  },
  quakeMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  quakeMagnitude: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  roadMarker: {
    width: 20,
    height: 20,
    backgroundColor: theme.colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
  },
  roadMarkerText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    transform: [{ rotate: '-45deg' }],
  },
  callout: {
    width: 200,
    padding: 12,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  calloutDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  calloutTime: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  calloutDetail: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  legend: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    backgroundColor: 'white',
    borderRadius: theme.radius,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendRow: {
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.blue,
    marginRight: 8,
  },
  legendTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: theme.colors.orange,
    marginRight: 8,
  },
  legendPin: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.green,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: theme.colors.text,
  },
});
