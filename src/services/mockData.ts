// Mock data service - structured for easy API integration later
// Replace these with real API calls to GeoNet, NZTA, etc.

import { NZTAService } from './nztaApi';
import { GeoNetService, GeoNetQuake } from './geonetApi';
import { NZRegionService } from './nzRegions';

export interface QuakeData {
  id: string;
  city: string;
  latitude: number;
  longitude: number;
  magnitude: number;
  depth: number;
  time: string;
  intensity: string;
  location?: string;
  isReal?: boolean;
  // Future: Can map to GeoNet API response
}

export interface RoadData {
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
  // Future: Can map to NZTA API response
}

export interface CommunityReport {
  id: string;
  city: string;
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  // Future: Can map to local emergency services API
}

// NZ City coordinates for mapping - now using comprehensive regional data
export const NZ_CITY_COORDS: Record<string, { lat: number; lng: number }> = {};

// Initialize coordinates from regional data
NZRegionService.getAllCities().forEach(city => {
  NZ_CITY_COORDS[city.name] = { lat: city.lat, lng: city.lng };
});

// Mock earthquake data - replace with GeoNet API
export const MOCK_QUAKES: QuakeData[] = [
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
  {
    id: 'q4',
    city: 'Hamilton',
    latitude: -37.7870,
    longitude: 175.2793,
    magnitude: 3.5,
    depth: 12,
    time: '2024-01-14T22:20:00Z',
    intensity: 'Light',
  },
];

// Mock road data - replace with NZTA API
export const MOCK_ROADS: RoadData[] = [
  {
    id: 'r1',
    city: 'Auckland',
    name: 'Harbour Bridge',
    status: 'planned',
    description: 'Lane restrictions during peak hours for maintenance',
    location: 'State Highway 1, Auckland',
    latitude: -36.8485,
    longitude: 174.7633,
    lastUpdated: '4 hours ago',
    estimatedDuration: '3 days',
  },
  {
    id: 'r2',
    city: 'Wellington',
    name: 'State Highway 1',
    status: 'closed',
    description: 'Road closure due to flooding near Kapiti Coast',
    location: 'SH1, Kapiti Coast',
    latitude: -41.2865,
    longitude: 174.7762,
    lastUpdated: '2 hours ago',
    estimatedDuration: 'Unknown',
  },
  {
    id: 'r3',
    city: 'Christchurch',
    name: 'State Highway 73',
    status: 'clear',
    description: 'Good driving conditions across Arthur\'s Pass',
    location: 'Arthur\'s Pass, Canterbury',
    latitude: -43.5321,
    longitude: 172.6362,
    lastUpdated: '15 minutes ago',
  },
  {
    id: 'r4',
    city: 'Hamilton',
    name: 'State Highway 3',
    status: 'clear',
    description: 'All lanes open, normal traffic flow',
    location: 'Hamilton to New Plymouth',
    latitude: -37.7870,
    longitude: 175.2793,
    lastUpdated: '1 hour ago',
  },
  {
    id: 'r5',
    city: 'Tauranga',
    name: 'State Highway 2',
    status: 'planned',
    description: 'Bridge maintenance scheduled for weekend',
    location: 'Tauranga Harbour Bridge',
    latitude: -37.6878,
    longitude: 176.1651,
    lastUpdated: '6 hours ago',
    estimatedDuration: '2 days',
  },
  {
    id: 'r6',
    city: 'Wellington',
    name: 'Desert Road',
    status: 'closed',
    description: 'Severe weather conditions - snow and ice',
    location: 'Central North Island, SH1',
    latitude: -39.0000,
    longitude: 175.9000,
    lastUpdated: '1 hour ago',
    estimatedDuration: '12 hours',
  },
];

// Mock community reports - replace with local emergency services API
export const MOCK_COMMUNITY: CommunityReport[] = [
  {
    id: 'c1',
    city: 'Auckland',
    title: 'Community Emergency Shelter',
    description: 'Emergency shelter opened at Auckland Community Centre',
    category: 'Shelter',
    latitude: -36.8485,
    longitude: 174.7633,
    timestamp: '2024-01-15T12:00:00Z',
    severity: 'medium',
  },
  {
    id: 'c2',
    city: 'Wellington',
    title: 'Flood Warning - Hutt Valley',
    description: 'Residents advised to avoid low-lying areas',
    category: 'Flood',
    latitude: -41.2100,
    longitude: 174.9000,
    timestamp: '2024-01-15T09:30:00Z',
    severity: 'high',
  },
  {
    id: 'c3',
    city: 'Christchurch',
    title: 'Power Outage Restoration',
    description: 'Power restored to most areas after storm damage',
    category: 'Utilities',
    latitude: -43.5321,
    longitude: 172.6362,
    timestamp: '2024-01-14T16:45:00Z',
    severity: 'low',
  },
];

// API service functions (now integrated with real NZTA API)
export class DataService {
  /**
   * Clear all cached data and force refresh from APIs
   */
  static clearCache(): void {
    console.log('Clearing API cache...');
    NZTAService.clearCache();
    GeoNetService.clearCache();
  }

  /**
   * Find the nearest city to given coordinates from the list of subscribed cities
   */
  private static getNearestCity(lat: number, lng: number, cities: string[]): string {
    if (cities.length === 0) {
      // If no specific cities, try to match with all known cities
      const allCities = Object.keys(NZ_CITY_COORDS);
      return this.findClosestCity(lat, lng, allCities);
    }
    
    return this.findClosestCity(lat, lng, cities);
  }

  /**
   * Calculate distance and find closest city
   */
  private static findClosestCity(lat: number, lng: number, cities: string[]): string {
    let closestCity = cities[0] || 'Unknown';
    let minDistance = Infinity;
    
    cities.forEach(city => {
      const cityCoords = NZ_CITY_COORDS[city];
      if (cityCoords) {
        const distance = this.calculateDistance(lat, lng, cityCoords.lat, cityCoords.lng);
        if (distance < minDistance) {
          minDistance = distance;
          closestCity = city;
        }
      }
    });
    
    return closestCity;
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Convert degrees to radians
   */
  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get real-time incidents from NZTA for debugging
   */
  static async getNZTAIncidents() {
    return NZTAService.getIncidents();
  }
  /**
   * Expand subscriptions to include all cities in subscribed regions
   */
  static expandSubscriptions(subscriptions: Array<{name: string; type: 'city' | 'region'}>): string[] {
    const allCities: string[] = [];
    
    subscriptions.forEach(subscription => {
      if (subscription.type === 'region') {
        // Add all cities in the region
        const citiesInRegion = NZRegionService.getCitiesInRegion(subscription.name);
        citiesInRegion.forEach(city => {
          if (!allCities.includes(city.name)) {
            allCities.push(city.name);
          }
        });
      } else {
        // Add individual city
        if (!allCities.includes(subscription.name)) {
          allCities.push(subscription.name);
        }
      }
    });
    
    return allCities;
  }

  // Real GeoNet API integration with fallback to mock data
  static async getEarthquakeData(cities?: string[]): Promise<QuakeData[]> {
    try {
      console.log('Fetching earthquake data from GeoNet API...');
      
      // Use real GeoNet API
      const geonetQuakes = await GeoNetService.getEarthquakesByRegion(cities || []);
      
      if (geonetQuakes.length > 0) {
        console.log(`Retrieved ${geonetQuakes.length} earthquakes from GeoNet`);
        
        // Transform GeoNet data to our QuakeData format
        return geonetQuakes.map((quake: GeoNetQuake) => ({
          id: quake.publicID,
          city: this.getNearestCity(quake.latitude, quake.longitude, cities || []),
          latitude: quake.latitude,
          longitude: quake.longitude,
          magnitude: quake.magnitude,
          depth: quake.depth,
          time: quake.time,
          intensity: GeoNetService.getIntensityDescription(quake.magnitude),
          location: quake.locality,
          isReal: true // Flag to indicate real data
        }));
      }
      
      console.log('No GeoNet earthquakes found, using mock data');
      throw new Error('No GeoNet data');
      
    } catch (error) {
      console.warn('GeoNet API failed, using mock data:', error);
      
      // Fallback to mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (cities && cities.length > 0) {
        return MOCK_QUAKES.filter(quake => cities.includes(quake.city))
          .map(quake => ({ ...quake, isReal: false }));
      }
      return MOCK_QUAKES.map(quake => ({ ...quake, isReal: false }));
    }
  }

  // Real NZTA API integration with fallback to mock data
  static async getRoadData(cities?: string[]): Promise<RoadData[]> {
    try {
      console.log('Fetching road data from NZTA API...');
      
      // Use real NZTA API
      const nztaRoadData = await NZTAService.getRoadDataFromNZTA(cities);
      
      if (nztaRoadData.length > 0) {
        console.log(`Retrieved ${nztaRoadData.length} road incidents from NZTA`);
        return nztaRoadData;
      }
      
      // If no NZTA data, fall back to mock data
      console.log('No NZTA data available, using mock data');
      throw new Error('No NZTA data');
      
    } catch (error) {
      console.warn('NZTA API failed, using mock data:', error);
      
      // Fallback to mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (cities && cities.length > 0) {
        return MOCK_ROADS.filter(road => cities.includes(road.city));
      }
      return MOCK_ROADS;
    }
  }

  // Future: Replace with local emergency services API call
  static async getCommunityData(cities?: string[]): Promise<CommunityReport[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (cities && cities.length > 0) {
      return MOCK_COMMUNITY.filter(report => cities.includes(report.city));
    }
    return MOCK_COMMUNITY;
  }
}