import { useState, useEffect } from 'react';
import { MapPin, Circle, Triangle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { DataService, QuakeData, RoadData, CommunityReport, NZ_CITY_COORDS } from '../services/mockData';

interface MapScreenProps {
  subscriptions: Array<{
    id: string;
    name: string;
    quakes: boolean;
    roading: boolean;
    community: boolean;
  }>;
}

interface MapMarker {
  id: string;
  type: 'quake' | 'roading' | 'community';
  lat: number;
  lng: number;
  title: string;
  description: string;
  magnitude?: number;
  severity?: string;
  city: string;
}

export function MapScreen({ subscriptions }: MapScreenProps) {
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(['quakes', 'roading', 'community'])
  );
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data for subscribed cities
  useEffect(() => {
    const loadMapData = async () => {
      setIsLoading(true);
      try {
        // Get subscribed cities and their enabled alert types
        const subscribedCities = subscriptions.map(sub => sub.name);
        const enabledAlerts = {
          quakes: subscriptions.some(sub => sub.quakes),
          roading: subscriptions.some(sub => sub.roading),
          community: subscriptions.some(sub => sub.community),
        };

        const [quakeData, roadData, communityData] = await Promise.all([
          enabledAlerts.quakes ? DataService.getEarthquakeData(subscribedCities) : Promise.resolve([]),
          enabledAlerts.roading ? DataService.getRoadData(subscribedCities) : Promise.resolve([]),
          enabledAlerts.community ? DataService.getCommunityData(subscribedCities) : Promise.resolve([]),
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
        ];

        setMarkers(allMarkers);
      } catch (error) {
        console.error('Failed to load map data:', error);
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

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'quake':
        return <Circle className="w-4 h-4 text-primary fill-current" />;
      case 'roading':
        return <Triangle className="w-4 h-4 text-warning fill-current" />;
      case 'community':
        return <MapPin className="w-4 h-4 text-accent fill-current" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  // Calculate map bounds based on subscribed cities
  const getMapCenter = () => {
    const subscribedCities = subscriptions.map(sub => sub.name);
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
  const subscribedCities = subscriptions.map(sub => sub.name);

  if (subscribedCities.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-muted">
        <div className="text-center p-6">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Cities Selected</h3>
          <p className="text-muted-foreground">
            Add cities from your dashboard to see alerts on the map
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Filter Chips */}
      <div className="absolute top-4 left-4 right-4 z-10 flex gap-2 flex-wrap">
        <Badge
          variant={activeFilters.has('quakes') ? 'default' : 'secondary'}
          className={`cursor-pointer ${
            activeFilters.has('quakes') 
              ? 'bg-primary hover:bg-primary/90' 
              : 'hover:bg-secondary/80'
          }`}
          onClick={() => toggleFilter('quakes')}
        >
          <Circle className="w-3 h-3 mr-1 fill-current" />
          Earthquakes ({markers.filter(m => m.type === 'quake').length})
        </Badge>
        <Badge
          variant={activeFilters.has('roading') ? 'default' : 'secondary'}
          className={`cursor-pointer ${
            activeFilters.has('roading') 
              ? 'bg-warning hover:bg-warning/90 text-warning-foreground' 
              : 'hover:bg-secondary/80'
          }`}
          onClick={() => toggleFilter('roading')}
        >
          <Triangle className="w-3 h-3 mr-1 fill-current" />
          Roads ({markers.filter(m => m.type === 'roading').length})
        </Badge>
        <Badge
          variant={activeFilters.has('community') ? 'default' : 'secondary'}
          className={`cursor-pointer ${
            activeFilters.has('community') 
              ? 'bg-accent hover:bg-accent/90' 
              : 'hover:bg-secondary/80'
          }`}
          onClick={() => toggleFilter('community')}
        >
          <MapPin className="w-3 h-3 mr-1 fill-current" />
          Community ({markers.filter(m => m.type === 'community').length})
        </Badge>
      </div>

      {/* Mock Map Container */}
      <div className="h-full bg-slate-100 relative overflow-hidden">
        {/* Map background with NZ outline */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="absolute inset-0 opacity-20">
            <svg viewBox="0 0 400 600" className="w-full h-full">
              {/* Simplified NZ outline */}
              <path
                d="M 200 100 C 220 120 240 140 250 180 C 260 220 250 260 240 300 C 230 340 220 380 210 420 C 200 440 190 460 180 480 L 170 500 L 160 520 L 150 540 L 140 520 L 130 500 L 120 480 C 110 460 100 440 90 420 C 80 380 70 340 60 300 C 50 260 40 220 50 180 C 60 140 80 120 100 100 C 120 80 140 70 160 70 C 180 70 190 80 200 100 Z"
                fill="#10B981"
                opacity="0.3"
              />
            </svg>
          </div>
          
          {/* City labels */}
          {subscribedCities.map(cityName => {
            const coords = NZ_CITY_COORDS[cityName];
            if (!coords) return null;
            
            const x = ((coords.lng + 180) / 360) * 100;
            const y = ((90 - coords.lat) / 180) * 100;
            
            return (
              <div
                key={cityName}
                className="absolute text-xs font-medium text-muted-foreground bg-white/80 px-2 py-1 rounded"
                style={{
                  left: `${x}%`,
                  top: `${y - 5}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                {cityName}
              </div>
            );
          })}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading alerts...</p>
            </div>
          </div>
        )}

        {/* Markers */}
        {!isLoading && filteredMarkers.map(marker => {
          const x = ((marker.lng + 180) / 360) * 100;
          const y = ((90 - marker.lat) / 180) * 100;
          
          return (
            <button
              key={marker.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow z-10"
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
              onClick={() => setSelectedMarker(marker)}
            >
              {getMarkerIcon(marker.type)}
              {marker.magnitude && (
                <span className="absolute -top-1 -right-1 text-xs bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center">
                  {marker.magnitude}
                </span>
              )}
            </button>
          );
        })}

        {/* Legend */}
        <div className="absolute bottom-20 left-4 bg-white rounded-lg shadow-lg p-3 space-y-2">
          <h4 className="text-sm font-medium text-foreground">Legend</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs">
              <Circle className="w-3 h-3 text-primary fill-current" />
              <span>Earthquake</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Triangle className="w-3 h-3 text-warning fill-current" />
              <span>Road Issue</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="w-3 h-3 text-accent fill-current" />
              <span>Community Alert</span>
            </div>
          </div>
        </div>

        {/* Selected Marker Info */}
        {selectedMarker && (
          <div className="absolute bottom-20 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-foreground">{selectedMarker.title}</h4>
              <button
                onClick={() => setSelectedMarker(null)}
                className="text-muted-foreground hover:text-foreground ml-2"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {selectedMarker.description}
            </p>
            <div className="text-xs text-muted-foreground mb-3">
              📍 {selectedMarker.city}
            </div>
            <Button size="sm" className="w-full">
              View Details
            </Button>
          </div>
        )}

        {/* No data message */}
        {!isLoading && markers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6">
              <Circle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Alerts Found</h3>
              <p className="text-muted-foreground">
                No current alerts for your selected cities
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}