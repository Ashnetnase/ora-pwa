import { useState, useEffect, Component } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, Circle, Triangle, Cloud } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { DataService, QuakeData, RoadData, CommunityReport, NZ_CITY_COORDS, WeatherWarning } from '../services/mockData';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';
import '../styles/leaflet.css';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Design System Colors
const COLORS = {
  primary: '#2563EB',    // Primary blue for active filters
  accent: '#10B981',     // Green for community
  warning: '#F59E0B',    // Orange for roads
  error: '#EF4444',      // Red for high-magnitude earthquakes
  background: '#F9FAFB', // Light gray background
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

// Enhanced custom marker icons with exact design system colors
const createCustomIcon = (type: 'quake' | 'roading' | 'community' | 'weather', magnitude?: number, color?: string) => {
  const getMarkerConfig = () => {
    switch (type) {
      case 'quake':
        return {
          color: magnitude && magnitude >= 4 ? COLORS.error : COLORS.primary,
          border: magnitude && magnitude >= 4 ? '#DC2626' : '#1D4ED8',
          symbol: '●',
          size: magnitude && magnitude >= 4 ? 32 : 28
        };
      case 'roading':
        return {
          color: COLORS.warning,
          border: '#D97706',
          symbol: '▲',
          size: 28
        };
      case 'community':
        return {
          color: COLORS.accent,
          border: '#059669',
          symbol: '📍',
          size: 28
        };
      case 'weather':
        return {
          color: color || '#6366F1', // Indigo for weather
          border: color ? `${color}CC` : '#4F46E5',
          symbol: '🌧️',
          size: 30
        };
      default:
        return {
          color: COLORS.gray[500],
          border: COLORS.gray[600],
          symbol: '●',
          size: 28
        };
    }
  };

  const config = getMarkerConfig();

  return L.divIcon({
    html: `<div style="
      background: ${config.color};
      border: 3px solid ${config.border};
      border-radius: 50%;
      width: ${config.size}px;
      height: ${config.size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: ${config.size === 32 ? '16px' : '14px'};
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3), 0 2px 4px rgba(0,0,0,0.2);
      transform: scale(1);
      transition: all 0.2s ease;
      cursor: pointer;
    " class="custom-marker">${config.symbol}</div>`,
    className: `custom-marker-${type}`,
    iconSize: [config.size, config.size],
    iconAnchor: [config.size / 2, config.size / 2],
  });
};

// Enhanced Error Boundary
class ErrorBoundary extends Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Map Error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="h-full flex items-center justify-center"
          style={{ backgroundColor: COLORS.background }}
        >
          <div className="text-center p-6 max-w-sm mx-auto">
            <Circle className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.error }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.gray[900] }}>
              Map Loading Error
            </h3>
            <p className="text-sm" style={{ color: COLORS.gray[600] }}>
              Unable to load the interactive map. Please refresh the page.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Modal Component using Portal for proper z-index handling
const RoadDetailsModal = ({ marker, onClose, getRoadStatusDetails, COLORS }: {
  marker: MapMarker;
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
            const statusDetails = getRoadStatusDetails(marker.severity || '');
            return (
              <div className="space-y-4">
                {/* Road Name */}
                <div>
                  <h3 className="text-lg font-semibold mb-1" style={{ color: COLORS.gray[900] }}>
                    {marker.title}
                  </h3>
                  <p className="text-sm" style={{ color: COLORS.gray[600] }}>
                    📍 {marker.city}
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
                    {marker.description}
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
                      {statusDetails.expectedDuration}
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
                    <p>📍 City: {marker.city}</p>
                    <p>🗺️ Coordinates: {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}</p>
                    <p>⏰ Last Updated: {new Date().toLocaleString()}</p>
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

// Earthquake Details Modal Component using Portal
const EarthquakeDetailsModal = ({ marker, onClose, getEarthquakeDetails, COLORS }: {
  marker: MapMarker;
  onClose: () => void;
  getEarthquakeDetails: (magnitude: number) => any;
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
            <Circle className="w-5 h-5 fill-current" style={{ 
              color: marker.magnitude && marker.magnitude >= 4 ? COLORS.error : COLORS.primary 
            }} />
            <h2 className="text-lg font-semibold" style={{ color: COLORS.gray[900] }}>
              Earthquake Details
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
            const earthquakeDetails = getEarthquakeDetails(marker.magnitude || 0);
            return (
              <div className="space-y-4">
                {/* Earthquake Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-1" style={{ color: COLORS.gray[900] }}>
                    {marker.title}
                  </h3>
                  <p className="text-sm" style={{ color: COLORS.gray[600] }}>
                    📍 {marker.city}
                  </p>
                </div>

                {/* Magnitude Badge */}
                <div 
                  className="p-3 rounded-lg border-l-4"
                  style={{ 
                    backgroundColor: earthquakeDetails.bgColor,
                    borderColor: earthquakeDetails.color
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="font-semibold text-sm"
                      style={{ color: earthquakeDetails.color }}
                    >
                      Magnitude {marker.magnitude}
                    </span>
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{ 
                        backgroundColor: earthquakeDetails.color,
                        color: COLORS.white
                      }}
                    >
                      {earthquakeDetails.intensity}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: COLORS.gray[700] }}>
                    {earthquakeDetails.description}
                  </p>
                </div>

                {/* Current Description */}
                <div>
                  <h4 className="font-medium mb-2" style={{ color: COLORS.gray[900] }}>
                    Event Details
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: COLORS.gray[600] }}>
                    {marker.description}
                  </p>
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 gap-3">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: COLORS.gray[50] }}
                  >
                    <h5 className="font-medium text-sm mb-1" style={{ color: COLORS.gray[900] }}>
                      Felt Intensity
                    </h5>
                    <p className="text-sm" style={{ color: COLORS.gray[600] }}>
                      {earthquakeDetails.feltIntensity}
                    </p>
                  </div>

                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: COLORS.gray[50] }}
                  >
                    <h5 className="font-medium text-sm mb-1" style={{ color: COLORS.gray[900] }}>
                      Potential Impact
                    </h5>
                    <p className="text-sm" style={{ color: COLORS.gray[600] }}>
                      {earthquakeDetails.impact}
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
                    Location & Technical Data
                  </h5>
                  <div className="space-y-1 text-sm" style={{ color: COLORS.gray[600] }}>
                    <p>📍 Location: {marker.city}</p>
                    <p>🌍 Coordinates: {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}</p>
                    <p>📊 Data Source: GeoNet New Zealand</p>
                    <p>⏰ Detected: {new Date().toLocaleString()}</p>
                  </div>
                </div>

                {/* Safety Information */}
                <div 
                  className="p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: earthquakeDetails.magnitude >= 4 ? '#fef2f2' : '#f0f9ff',
                    borderColor: earthquakeDetails.magnitude >= 4 ? COLORS.error : COLORS.primary
                  }}
                >
                  <h5 className="font-medium text-sm mb-2" style={{ 
                    color: earthquakeDetails.magnitude >= 4 ? COLORS.error : COLORS.primary 
                  }}>
                    Safety Information
                  </h5>
                  <div className="space-y-1 text-sm" style={{ color: COLORS.gray[600] }}>
                    <p>🚨 Emergency: 111</p>
                    <p>🌍 GeoNet Info: www.geonet.org.nz</p>
                    <p>📱 Follow @geonet for updates</p>
                    <p>⚠️ {earthquakeDetails.safetyAdvice}</p>
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
            onClick={() => window.open('https://www.geonet.org.nz', '_blank')}
          >
            View on GeoNet
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

interface MapScreenProps {
  subscriptions: Array<{
    id: string;
    name: string;
    type: 'city' | 'region';
    region?: string;
    quakes: boolean;
    roading: boolean;
    community: boolean;
  }>;
}

interface MapMarker {
  id: string;
  type: 'quake' | 'roading' | 'community' | 'weather';
  lat: number;
  lng: number;
  title: string;
  description: string;
  magnitude?: number;
  severity?: string;
  city: string;
  regions?: string[];
  weatherType?: WeatherWarning['type'];
  color?: string;
}

export function MapScreen({ subscriptions }: MapScreenProps) {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(['quakes', 'roading', 'community', 'weather'])
  );
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [detailedRoadView, setDetailedRoadView] = useState<MapMarker | null>(null);
  const [detailedEarthquakeView, setDetailedEarthquakeView] = useState<MapMarker | null>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  // Load data for subscribed cities
  useEffect(() => {
    const loadMapData = async () => {
      setIsLoading(true);
      try {
        // Get subscribed cities and their enabled alert types (expand regions)
        const subscribedCities = DataService.expandSubscriptions(subscriptions);
        const enabledAlerts = {
          quakes: subscriptions.some(sub => sub.quakes),
          roading: subscriptions.some(sub => sub.roading),
          community: subscriptions.some(sub => sub.community),
        };

        const [quakeData, roadData, communityData, weatherData] = await Promise.all([
          enabledAlerts.quakes ? DataService.getEarthquakeData(subscribedCities) : Promise.resolve([]),
          enabledAlerts.roading ? DataService.getRoadData(subscribedCities) : Promise.resolve([]),
          enabledAlerts.community ? DataService.getCommunityData(subscribedCities) : Promise.resolve([]),
          DataService.getWeatherWarnings(subscribedCities),
        ]);

        const allMarkers: MapMarker[] = [
          ...quakeData.map((quake: QuakeData) => ({
            id: quake.id,
            type: 'quake' as const,
            lat: quake.latitude,
            lng: quake.longitude,
            title: `M${quake.magnitude} Earthquake`,
            description: `${quake.intensity} earthquake near ${quake.city}`,
            magnitude: quake.magnitude,
            city: quake.city,
          })),
          ...roadData.map((road: RoadData) => ({
            id: road.id,
            type: 'roading' as const,
            lat: road.latitude,
            lng: road.longitude,
            title: road.name,
            description: road.description,
            severity: road.status,
            city: road.city,
          })),
          ...communityData.map((report: CommunityReport) => ({
            id: report.id,
            type: 'community' as const,
            lat: report.latitude,
            lng: report.longitude,
            title: report.title,
            description: report.description,
            severity: report.severity,
            city: report.category,
          })),
          ...weatherData.map((warning: WeatherWarning) => ({
            id: warning.id,
            type: 'weather' as const,
            lat: warning.coordinates?.lat || -41.0,
            lng: warning.coordinates?.lng || 174.0,
            title: warning.title,
            description: warning.description,
            severity: warning.severity,
            city: warning.regions[0] || 'New Zealand',
            regions: warning.regions,
            weatherType: warning.type,
            color: warning.color,
          })),
        ];

        setMarkers(allMarkers);
      } catch (error) {
        console.error('Failed to load map data:', error);
        setMapError('Failed to load alert data');
      } finally {
        setIsLoading(false);
      }
    };

    const subscribedCities = subscriptions.map(sub => sub.name);
    if (subscribedCities.length > 0) {
      loadMapData();
    } else {
      setMarkers([]);
      setIsLoading(false);
    }
  }, [subscriptions]);

  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);
      if (newFilters.has(filter)) {
        newFilters.delete(filter);
      } else {
        newFilters.add(filter);
      }
      return newFilters;
    });
  };

  const filteredMarkers = markers.filter(marker => 
    activeFilters.has(marker.type === 'quake' ? 'quakes' : marker.type)
  );

  // Helper function for marker icons in popups and legends
  const getMarkerIcon = (type: string, color?: string) => {
    switch (type) {
      case 'quake':
        return <Circle className="w-4 h-4 fill-current" style={{ color: COLORS.primary }} />;
      case 'roading':
        return <Triangle className="w-4 h-4 fill-current" style={{ color: COLORS.warning }} />;
      case 'community':
        return <MapPin className="w-4 h-4 fill-current" style={{ color: COLORS.accent }} />;
      case 'weather':
        return <Cloud className="w-4 h-4 fill-current" style={{ color: color || '#6366F1' }} />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  // Function to handle View Details button for different marker types
  const handleViewDetails = (marker: MapMarker) => {
    if (marker.type === 'roading') {
      setDetailedRoadView(marker);
      setSelectedMarker(null); // Close the popup
    } else if (marker.type === 'quake') {
      setDetailedEarthquakeView(marker);
      setSelectedMarker(null); // Close the popup
    }
  };

  // Function to get detailed road status information
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

  // Function to get detailed earthquake information
  const getEarthquakeDetails = (magnitude: number) => {
    if (magnitude >= 7.0) {
      return {
        intensity: 'Major',
        color: COLORS.error,
        bgColor: '#fee2e2',
        description: 'Major earthquake with potential for serious damage. Buildings may be damaged, infrastructure affected.',
        feltIntensity: 'Felt over very wide area. Strong to violent shaking.',
        impact: 'Significant structural damage possible. Check for injuries and building damage.',
        safetyAdvice: 'Check for injuries. Drop, Cover, Hold during aftershocks. Evacuate damaged buildings.',
        magnitude: magnitude
      };
    } else if (magnitude >= 6.0) {
      return {
        intensity: 'Strong',
        color: COLORS.error,
        bgColor: '#fee2e2',
        description: 'Strong earthquake that can cause significant damage, especially to poorly constructed buildings.',
        feltIntensity: 'Felt by everyone. Strong shaking, difficulty standing.',
        impact: 'Damage to some buildings. Heavy furniture may move. Some walls may crack.',
        safetyAdvice: 'Stay alert for aftershocks. Check for damage. Be prepared for potential evacuations.',
        magnitude: magnitude
      };
    } else if (magnitude >= 5.0) {
      return {
        intensity: 'Moderate',
        color: COLORS.warning,
        bgColor: '#fef3c7',
        description: 'Moderate earthquake felt by most people, especially in buildings. Some dishes and windows may break.',
        feltIntensity: 'Felt by most people indoors. Some people awakened.',
        impact: 'Minor damage to well-built structures. Some furniture moves.',
        safetyAdvice: 'Monitor for aftershocks. Check for any damage to property.',
        magnitude: magnitude
      };
    } else if (magnitude >= 4.0) {
      return {
        intensity: 'Light',
        color: COLORS.primary,
        bgColor: '#dbeafe',
        description: 'Light earthquake felt by many people indoors. Vibrations like a truck passing.',
        feltIntensity: 'Felt by many people indoors, few outdoors.',
        impact: 'Minimal damage. Hanging objects may swing.',
        safetyAdvice: 'Normal precautions. Monitor for potential aftershocks.',
        magnitude: magnitude
      };
    } else if (magnitude >= 3.0) {
      return {
        intensity: 'Weak',
        color: COLORS.primary,
        bgColor: '#f0f9ff',
        description: 'Weak earthquake often felt, but generally causes no damage.',
        feltIntensity: 'Felt by some people indoors, especially upper floors.',
        impact: 'Generally not felt. No damage expected.',
        safetyAdvice: 'No action required. Standard earthquake preparedness recommended.',
        magnitude: magnitude
      };
    } else {
      return {
        intensity: 'Minor',
        color: COLORS.gray[500],
        bgColor: COLORS.gray[50],
        description: 'Minor earthquake, usually not felt but recorded by seismographs.',
        feltIntensity: 'Generally not felt by people.',
        impact: 'No damage. Detected by sensitive equipment.',
        safetyAdvice: 'No action required. Continue normal activities.',
        magnitude: magnitude
      };
    }
  };

  // Calculate map bounds based on subscribed cities
  const getMapCenter = () => {
    const subscribedCities = DataService.expandSubscriptions(subscriptions);
    if (subscribedCities.length === 0) {
      return { lat: -41.0, lng: 174.0 }; // Default NZ center
    }
    
    const cityCoords = subscribedCities
      .map(city => NZ_CITY_COORDS[city])
      .filter(Boolean);
    
    if (cityCoords.length === 0) return { lat: -41.0, lng: 174.0 };
    
    const avgLat = cityCoords.reduce((sum, coord) => sum + coord.lat, 0) / cityCoords.length;
    const avgLng = cityCoords.reduce((sum, coord) => sum + coord.lng, 0) / cityCoords.length;
    
    return { lat: avgLat, lng: avgLng };
  };

  const mapCenter = getMapCenter();
  const subscribedCities = DataService.expandSubscriptions(subscriptions);

  if (subscribedCities.length === 0) {
    return (
      <div 
        className="flex items-center justify-center px-4"
        style={{ backgroundColor: COLORS.background, height: 'calc(100vh - 120px)' }}
      >
        <div className="text-center p-6 max-w-sm mx-auto">
          <MapPin className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.gray[400] }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.gray[900] }}>
            No Cities Selected
          </h3>
          <p className="text-sm" style={{ color: COLORS.gray[600] }}>
            Add cities from your dashboard to see alerts on the map
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Top Notification Area for Toast Messages */}
      <div className="absolute top-4 left-4 right-4 z-[1001] pointer-events-none">
        {/* Toast notifications will appear here */}
      </div>

      {/* Filter Chips at Top */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex gap-2 flex-wrap justify-center">
        <Badge
          variant={activeFilters.has('quakes') ? 'default' : 'secondary'}
          className={`cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md text-xs px-3 py-1.5 border-2 ${
            activeFilters.has('quakes') 
              ? 'text-white' 
              : 'bg-white hover:bg-gray-50 text-gray-700'
          }`}
          style={{
            backgroundColor: activeFilters.has('quakes') ? COLORS.primary : COLORS.white,
            borderColor: activeFilters.has('quakes') ? COLORS.primary : COLORS.gray[300],
            color: activeFilters.has('quakes') ? COLORS.white : COLORS.gray[700]
          }}
          onClick={() => toggleFilter('quakes')}
        >
          <Circle className="w-3 h-3 mr-1 fill-current" />
          Quakes ({markers.filter(m => m.type === 'quake').length})
        </Badge>
        
        <Badge
          variant={activeFilters.has('roading') ? 'default' : 'secondary'}
          className={`cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md text-xs px-3 py-1.5 border-2 ${
            activeFilters.has('roading') 
              ? 'text-white' 
              : 'bg-white hover:bg-gray-50 text-gray-700'
          }`}
          style={{
            backgroundColor: activeFilters.has('roading') ? COLORS.primary : COLORS.white,
            borderColor: activeFilters.has('roading') ? COLORS.primary : COLORS.gray[300],
            color: activeFilters.has('roading') ? COLORS.white : COLORS.gray[700]
          }}
          onClick={() => toggleFilter('roading')}
        >
          <Triangle className="w-3 h-3 mr-1 fill-current" />
          Roads ({markers.filter(m => m.type === 'roading').length})
        </Badge>
        
        <Badge
          variant={activeFilters.has('community') ? 'default' : 'secondary'}
          className={`cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md text-xs px-3 py-1.5 border-2 ${
            activeFilters.has('community') 
              ? 'text-white' 
              : 'bg-white hover:bg-gray-50 text-gray-700'
          }`}
          style={{
            backgroundColor: activeFilters.has('community') ? COLORS.primary : COLORS.white,
            borderColor: activeFilters.has('community') ? COLORS.primary : COLORS.gray[300],
            color: activeFilters.has('community') ? COLORS.white : COLORS.gray[700]
          }}
          onClick={() => toggleFilter('community')}
        >
          <MapPin className="w-3 h-3 mr-1 fill-current" />
          Community ({markers.filter(m => m.type === 'community').length})
        </Badge>
        
        <Badge
          variant={activeFilters.has('weather') ? 'default' : 'secondary'}
          className={`cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md text-xs px-3 py-1.5 border-2 ${
            activeFilters.has('weather') 
              ? 'text-white' 
              : 'bg-white hover:bg-gray-50 text-gray-700'
          }`}
          style={{
            backgroundColor: activeFilters.has('weather') ? COLORS.primary : COLORS.white,
            borderColor: activeFilters.has('weather') ? COLORS.primary : COLORS.gray[300],
            color: activeFilters.has('weather') ? COLORS.white : COLORS.gray[700]
          }}
          onClick={() => toggleFilter('weather')}
        >
          <Cloud className="w-3 h-3 mr-1 fill-current" />
          Weather ({markers.filter(m => m.type === 'weather').length})
        </Badge>
      </div>

      {/* Map Container - Contained within app layout */}
      <div className="h-full relative">
        {isLoading && (
          <div 
            className="absolute inset-0 flex items-center justify-center z-[1000]"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
          >
            <div className="text-center">
              <div 
                className="animate-spin w-8 h-8 border-2 border-t-transparent rounded-full mx-auto mb-2"
                style={{ borderColor: COLORS.primary, borderTopColor: 'transparent' }}
              />
              <p className="text-sm font-medium" style={{ color: COLORS.primary }}>
                Loading alerts...
              </p>
            </div>
          </div>
        )}

        {!isLoading && markers.length === 0 ? (
          <div 
            className="flex items-center justify-center px-4"
            style={{ backgroundColor: COLORS.background, height: 'calc(100vh - 120px)' }}
          >
            <div className="text-center p-6 max-w-sm mx-auto">
              <Circle className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.gray[400] }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.gray[900] }}>
                No Alerts Found
              </h3>
              <p className="text-sm" style={{ color: COLORS.gray[600] }}>
                No current alerts for your selected cities
              </p>
            </div>
          </div>
        ) : mapError ? (
          <div 
            className="flex items-center justify-center px-4"
            style={{ backgroundColor: COLORS.background, height: 'calc(100vh - 120px)' }}
          >
            <div className="text-center p-6 max-w-sm mx-auto">
              <Circle className="w-12 h-12 mx-auto mb-4" style={{ color: COLORS.error }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.gray[900] }}>
                Map Error
              </h3>
              <p className="text-sm mb-4" style={{ color: COLORS.gray[600] }}>
                {mapError}
              </p>
              <Button 
                onClick={() => setMapError(null)} 
                className="px-4 py-2 text-sm font-medium text-white rounded-md transition-colors"
                style={{ backgroundColor: COLORS.primary }}
              >
                Try Again
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full relative">
            <ErrorBoundary onError={(error) => setMapError(error.message)}>
              <MapContainer
                center={[mapCenter.lat, mapCenter.lng]}
                zoom={6}
                style={{ height: 'calc(100vh - 120px)', width: '100%' }}
                className="z-0"
                scrollWheelZoom={true}
                touchZoom={true}
                dragging={true}
                tap={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Render only filtered markers based on active filters */}
                {filteredMarkers.map(marker => (
                  <Marker
                    key={marker.id}
                    position={[marker.lat, marker.lng]}
                    icon={createCustomIcon(marker.type, marker.magnitude, marker.color)}
                    eventHandlers={{
                      click: () => {
                        setSelectedMarker(marker);
                      },
                    }}
                  >
                    <Popup className="custom-popup">
                      <div className="min-w-[200px] max-w-[280px] p-3">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm" style={{ color: COLORS.gray[900] }}>
                            {marker.title}
                          </h4>
                          {getMarkerIcon(marker.type, marker.color)}
                        </div>
                        <p className="text-sm mb-3" style={{ color: COLORS.gray[600] }}>
                          {marker.description}
                        </p>
                        <div className="text-xs mb-3" style={{ color: COLORS.gray[500] }}>
                          📍 {marker.city}
                          {marker.magnitude && (
                            <span className="ml-2 font-medium" style={{ color: COLORS.primary }}>
                              Magnitude: {marker.magnitude}
                            </span>
                          )}
                        </div>
                        {marker.type === 'quake' && (
                          <div className="text-xs mb-2 px-2 py-1 rounded" style={{ 
                            backgroundColor: marker.magnitude && marker.magnitude >= 4 ? '#fee2e2' : '#eff6ff',
                            color: marker.magnitude && marker.magnitude >= 4 ? COLORS.error : COLORS.primary
                          }}>
                            🌍 Real-time GeoNet data
                          </div>
                        )}
                        {marker.type === 'weather' && (
                          <div className="text-xs mb-2 px-2 py-1 rounded" style={{ 
                            backgroundColor: '#f0f9ff',
                            color: '#6366F1'
                          }}>
                            🌤️ MetService weather warning
                          </div>
                        )}
                        <Button 
                          size="sm" 
                          className="w-full text-sm font-medium text-white rounded-md transition-colors"
                          style={{ backgroundColor: COLORS.primary }}
                          onClick={() => handleViewDetails(marker)}
                        >
                          View Details
                        </Button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </ErrorBoundary>
          </div>
        )}

        {/* Selected Marker Info Panel */}
        {selectedMarker && (
          <div 
            className="absolute top-20 left-4 right-4 p-4 rounded-lg shadow-xl border z-[1001]"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              borderColor: COLORS.gray[200],
              backdropFilter: 'blur(8px)'
            }}
          >
            <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
              {getMarkerIcon(selectedMarker.type, selectedMarker.color)}
                <h4 className="font-semibold text-sm" style={{ color: COLORS.gray[900] }}>
                  {selectedMarker.title}
                </h4>
              </div>
              <button
                onClick={() => setSelectedMarker(null)}
                className="text-lg leading-none p-1 rounded hover:bg-gray-100 transition-colors"
                style={{ color: COLORS.gray[500] }}
              >
                ×
              </button>
            </div>
            <p className="text-xs mb-2" style={{ color: COLORS.gray[600] }}>
              {selectedMarker.description}
            </p>
            <div className="text-xs mb-3" style={{ color: COLORS.gray[500] }}>
              📍 {selectedMarker.city}
              {selectedMarker.magnitude && (
                <span className="ml-2 font-medium" style={{ color: COLORS.primary }}>
                  Magnitude: {selectedMarker.magnitude}
                </span>
              )}
            </div>
            <Button 
              size="sm" 
              className="w-full text-xs py-2 font-medium text-white rounded-md transition-colors"
              style={{ backgroundColor: COLORS.primary }}
              onClick={() => handleViewDetails(selectedMarker)}
            >
              View Details
            </Button>
          </div>
        )}

        {/* Legend Overlay - Bottom Left */}
        <div 
          className="absolute bottom-4 left-4 p-3 rounded-lg shadow-lg border z-[1000]"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: COLORS.gray[200],
            backdropFilter: 'blur(8px)',
            minWidth: '140px'
          }}
        >
          <h4 className="text-sm font-semibold mb-2 pb-1 border-b" style={{ 
            color: COLORS.gray[900],
            borderColor: COLORS.gray[200]
          }}>
            Legend
          </h4>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <Circle className="w-3 h-3 fill-current" style={{ color: COLORS.primary }} />
              <span style={{ color: COLORS.gray[700] }}>Earthquake</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Triangle className="w-3 h-3 fill-current" style={{ color: COLORS.warning }} />
              <span style={{ color: COLORS.gray[700] }}>Road Issue</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="w-3 h-3 fill-current" style={{ color: COLORS.accent }} />
              <span style={{ color: COLORS.gray[700] }}>Community</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Cloud className="w-3 h-3 fill-current" style={{ color: '#6366F1' }} />
              <span style={{ color: COLORS.gray[700] }}>Weather</span>
            </div>
          </div>
        </div>

        {/* Status Panel - Top Right */}
        <div 
          className="absolute top-20 right-4 p-2 rounded-lg shadow-lg text-xs z-[1000] border"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: COLORS.gray[200],
            backdropFilter: 'blur(8px)',
            maxWidth: '120px'
          }}
        >
          <div className="font-medium mb-1" style={{ color: COLORS.primary }}>
            Status
          </div>
          <div style={{ color: COLORS.gray[600] }}>
            <div>Showing: {filteredMarkers.length}</div>
            <div>Total: {markers.length}</div>
            <div>Cities: {subscribedCities.length}</div>
          </div>
        </div>
      </div>

      {/* Detailed Road Condition Modal using Portal */}
      {detailedRoadView && (
        <RoadDetailsModal
          marker={detailedRoadView}
          onClose={() => setDetailedRoadView(null)}
          getRoadStatusDetails={getRoadStatusDetails}
          COLORS={COLORS}
        />
      )}

      {/* Detailed Earthquake Modal using Portal */}
      {detailedEarthquakeView && (
        <EarthquakeDetailsModal
          marker={detailedEarthquakeView}
          onClose={() => setDetailedEarthquakeView(null)}
          getEarthquakeDetails={getEarthquakeDetails}
          COLORS={COLORS}
        />
      )}
    </div>
  );
}