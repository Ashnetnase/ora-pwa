// Mock data service - structured for easy API integration later
// Replace these with real API calls to GeoNet, NZTA, etc.

export interface QuakeData {
  id: string;
  city: string;
  latitude: number;
  longitude: number;
  magnitude: number;
  depth: number;
  time: string;
  intensity: string;
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

// NZ City coordinates for mapping
export const NZ_CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  'Auckland': { lat: -36.8485, lng: 174.7633 },
  'Wellington': { lat: -41.2865, lng: 174.7762 },
  'Christchurch': { lat: -43.5321, lng: 172.6362 },
  'Hamilton': { lat: -37.7870, lng: 175.2793 },
  'Tauranga': { lat: -37.6878, lng: 176.1651 },
  'Dunedin': { lat: -45.8788, lng: 170.5028 },
  'Palmerston North': { lat: -40.3523, lng: 175.6082 },
  'Napier': { lat: -39.4928, lng: 176.9120 },
  'Nelson': { lat: -41.2706, lng: 173.2840 },
  'Rotorua': { lat: -38.1368, lng: 176.2497 },
};

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

// API service functions (currently returning mock data)
export class DataService {
  // Future: Replace with actual GeoNet API call
  static async getEarthquakeData(cities?: string[]): Promise<QuakeData[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (cities && cities.length > 0) {
      return MOCK_QUAKES.filter(quake => cities.includes(quake.city));
    }
    return MOCK_QUAKES;
  }

  // Future: Replace with actual NZTA API call
  static async getRoadData(cities?: string[]): Promise<RoadData[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (cities && cities.length > 0) {
      return MOCK_ROADS.filter(road => cities.includes(road.city));
    }
    return MOCK_ROADS;
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