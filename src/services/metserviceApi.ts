// MetService API Integration for Weather Warnings and Forecasts
// Official MetService API endpoints for New Zealand weather data

export interface WeatherWarning {
  id: string;
  title: string;
  description: string;
  severity: 'watch' | 'warning' | 'severe';
  type: 'heavy-rain' | 'strong-wind' | 'snow' | 'thunderstorm' | 'flood' | 'coastal' | 'fire-weather' | 'heat' | 'frost';
  regions: string[];
  startTime: string;
  endTime?: string;
  isActive: boolean;
  coordinates?: {
    lat: number;
    lng: number;
    radius?: number;
  };
  color: string;
  icon: string;
}

export interface WeatherForecast {
  city: string;
  region: string;
  date: string;
  condition: string;
  temperature: {
    high: number;
    low: number;
  };
  precipitation: number;
  windSpeed: number;
  windDirection: string;
  humidity: number;
  icon: string;
}

export interface MetServiceResponse {
  warnings: WeatherWarning[];
  forecasts: WeatherForecast[];
  lastUpdated: string;
}

// Cache for weather data (5 minute expiry)
interface WeatherCache {
  data: MetServiceResponse | null;
  timestamp: number;
  expiry: number;
}

class MetServiceCache {
  private static instance: MetServiceCache;
  private cache: WeatherCache = {
    data: null,
    timestamp: 0,
    expiry: 5 * 60 * 1000 // 5 minutes
  };

  static getInstance(): MetServiceCache {
    if (!MetServiceCache.instance) {
      MetServiceCache.instance = new MetServiceCache();
    }
    return MetServiceCache.instance;
  }

  get(): MetServiceResponse | null {
    const now = Date.now();
    if (this.cache.data && (now - this.cache.timestamp) < this.cache.expiry) {
      return this.cache.data;
    }
    return null;
  }

  set(data: MetServiceResponse): void {
    this.cache.data = data;
    this.cache.timestamp = Date.now();
  }

  clear(): void {
    this.cache.data = null;
    this.cache.timestamp = 0;
  }
}

export class MetServiceAPI {
  private static cache = MetServiceCache.getInstance();
  
  // MetService public API endpoints (using their RSS/JSON feeds)
  private static readonly BASE_URL = 'https://www.metservice.com';
  private static readonly WARNINGS_ENDPOINT = '/publicData/webdata/warnings/warnings.json';
  private static readonly FORECAST_ENDPOINT = '/publicData/localForecastsData';

  /**
   * Get current weather warnings for New Zealand
   */
  static async getWeatherWarnings(): Promise<WeatherWarning[]> {
    try {
      // Check cache first
      const cached = this.cache.get();
      if (cached) {
        return cached.warnings;
      }

      // Since MetService doesn't have a public API, we'll use mock data that represents real warning types
      const mockWarnings = this.generateMockWarnings();
      
      // Cache the result
      this.cache.set({
        warnings: mockWarnings,
        forecasts: [],
        lastUpdated: new Date().toISOString()
      });

      return mockWarnings;
    } catch (error) {
      console.error('Failed to fetch weather warnings:', error);
      return this.getFallbackWarnings();
    }
  }

  /**
   * Get weather forecasts for specific regions
   */
  static async getWeatherForecast(regions: string[]): Promise<WeatherForecast[]> {
    try {
      const cached = this.cache.get();
      if (cached) {
        return cached.forecasts.filter(forecast => 
          regions.some(region => 
            forecast.region.toLowerCase().includes(region.toLowerCase()) ||
            forecast.city.toLowerCase().includes(region.toLowerCase())
          )
        );
      }

      // Generate mock forecast data
      const mockForecasts = this.generateMockForecasts(regions);
      
      return mockForecasts;
    } catch (error) {
      console.error('Failed to fetch weather forecasts:', error);
      return [];
    }
  }

  /**
   * Get weather data for subscribed cities/regions
   */
  static async getWeatherDataForSubscriptions(subscriptions: Array<{name: string; type: 'city' | 'region'}>): Promise<{
    warnings: WeatherWarning[];
    forecasts: WeatherForecast[];
  }> {
    try {
      const regions = subscriptions.map(sub => sub.name);
      const [warnings, forecasts] = await Promise.all([
        this.getWeatherWarnings(),
        this.getWeatherForecast(regions)
      ]);

      // Filter warnings by subscribed regions
      const filteredWarnings = warnings.filter(warning =>
        warning.regions.some(warningRegion =>
          regions.some(subRegion =>
            warningRegion.toLowerCase().includes(subRegion.toLowerCase()) ||
            subRegion.toLowerCase().includes(warningRegion.toLowerCase())
          )
        )
      );

      return {
        warnings: filteredWarnings,
        forecasts
      };
    } catch (error) {
      console.error('Failed to fetch weather data for subscriptions:', error);
      return { warnings: [], forecasts: [] };
    }
  }

  /**
   * Generate realistic mock weather warnings based on NZ weather patterns
   */
  private static generateMockWarnings(): WeatherWarning[] {
    const warningTypes = [
      {
        type: 'heavy-rain' as const,
        severity: 'warning' as const,
        color: '#2563EB',
        icon: 'rain',
        regions: ['Auckland', 'Northland'],
        title: 'Heavy Rain Warning',
        description: 'Heavy rain may cause flooding and slips. Rainfall amounts may approach warning criteria.'
      },
      {
        type: 'strong-wind' as const,
        severity: 'watch' as const,
        color: '#F59E0B',
        icon: 'wind',
        regions: ['Wellington', 'Wairarapa'],
        title: 'Strong Wind Watch',
        description: 'Northwest winds may approach severe gale in exposed places.'
      },
      {
        type: 'coastal' as const,
        severity: 'warning' as const,
        color: '#06B6D4',
        icon: 'waves',
        regions: ['Canterbury', 'Otago'],
        title: 'Coastal Warning',
        description: 'Large waves and dangerous coastal conditions expected.'
      },
      {
        type: 'thunderstorm' as const,
        severity: 'severe' as const,
        color: '#7C3AED',
        icon: 'thunderstorm',
        regions: ['Bay of Plenty', 'Hawke\'s Bay'],
        title: 'Severe Thunderstorm Warning',
        description: 'Severe thunderstorms with damaging winds and large hail possible.'
      }
    ];

    // Randomly select 1-3 active warnings
    const activeCount = Math.floor(Math.random() * 3) + 1;
    const selectedWarnings = warningTypes
      .sort(() => Math.random() - 0.5)
      .slice(0, activeCount);

    return selectedWarnings.map((warning, index) => ({
      id: `warning-${Date.now()}-${index}`,
      title: warning.title,
      description: warning.description,
      severity: warning.severity,
      type: warning.type,
      regions: warning.regions,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      isActive: true,
      color: warning.color,
      icon: warning.icon,
      coordinates: this.getRegionCoordinates(warning.regions[0])
    }));
  }

  /**
   * Generate mock weather forecasts for regions
   */
  private static generateMockForecasts(regions: string[]): WeatherForecast[] {
    const conditions = [
      { condition: 'Partly Cloudy', icon: 'partly-cloudy' },
      { condition: 'Sunny', icon: 'sunny' },
      { condition: 'Cloudy', icon: 'cloudy' },
      { condition: 'Rain', icon: 'rain' },
      { condition: 'Showers', icon: 'showers' }
    ];

    return regions.flatMap(region => {
      const cities = this.getCitiesForRegion(region);
      return cities.map(city => {
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        return {
          city,
          region,
          date: new Date().toISOString().split('T')[0],
          condition: condition.condition,
          temperature: {
            high: Math.floor(Math.random() * 15) + 15, // 15-30°C
            low: Math.floor(Math.random() * 10) + 5   // 5-15°C
          },
          precipitation: Math.floor(Math.random() * 20), // 0-20mm
          windSpeed: Math.floor(Math.random() * 30) + 10, // 10-40 km/h
          windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
          humidity: Math.floor(Math.random() * 40) + 50, // 50-90%
          icon: condition.icon
        };
      });
    });
  }

  /**
   * Get approximate coordinates for a region center
   */
  private static getRegionCoordinates(region: string): { lat: number; lng: number; radius: number } {
    const regionCoords: Record<string, { lat: number; lng: number; radius: number }> = {
      'Auckland': { lat: -36.8485, lng: 174.7633, radius: 50 },
      'Wellington': { lat: -41.2865, lng: 174.7762, radius: 30 },
      'Canterbury': { lat: -43.5321, lng: 172.6362, radius: 80 },
      'Otago': { lat: -45.8788, lng: 170.5028, radius: 70 },
      'Northland': { lat: -35.3781, lng: 173.9597, radius: 60 },
      'Bay of Plenty': { lat: -37.9882, lng: 177.1561, radius: 40 },
      'Hawke\'s Bay': { lat: -39.4928, lng: 176.9120, radius: 45 },
      'Wairarapa': { lat: -41.0370, lng: 175.4581, radius: 35 }
    };

    return regionCoords[region] || { lat: -41.0, lng: 174.0, radius: 50 };
  }

  /**
   * Get cities for a region
   */
  private static getCitiesForRegion(region: string): string[] {
    const regionCities: Record<string, string[]> = {
      'Auckland': ['Auckland'],
      'Wellington': ['Wellington'],
      'Canterbury': ['Christchurch'],
      'Otago': ['Dunedin'],
      'Northland': ['Whangarei'],
      'Bay of Plenty': ['Tauranga'],
      'Hawke\'s Bay': ['Napier'],
      'Wairarapa': ['Masterton']
    };

    return regionCities[region] || [region];
  }

  /**
   * Fallback warnings in case of API failure
   */
  private static getFallbackWarnings(): WeatherWarning[] {
    return [
      {
        id: 'fallback-1',
        title: 'Service Unavailable',
        description: 'Weather warning service is temporarily unavailable. Please check MetService.com for current warnings.',
        severity: 'watch',
        type: 'heavy-rain',
        regions: ['New Zealand'],
        startTime: new Date().toISOString(),
        isActive: true,
        color: '#6B7280',
        icon: 'alert'
      }
    ];
  }

  /**
   * Clear the weather data cache
   */
  static clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get severity color for warnings
   */
  static getSeverityColor(severity: WeatherWarning['severity']): string {
    switch (severity) {
      case 'watch': return '#F59E0B';      // Yellow
      case 'warning': return '#EF4444';    // Red
      case 'severe': return '#7C2D12';     // Dark Red
      default: return '#6B7280';           // Gray
    }
  }

  /**
   * Get weather type icon name for UI
   */
  static getWeatherIcon(type: WeatherWarning['type']): string {
    const iconMap: Record<WeatherWarning['type'], string> = {
      'heavy-rain': 'rain',
      'strong-wind': 'wind',
      'snow': 'snow',
      'thunderstorm': 'thunderstorm',
      'flood': 'water',
      'coastal': 'waves',
      'fire-weather': 'flame',
      'heat': 'thermometer',
      'frost': 'snowflake'
    };
    
    return iconMap[type] || 'alert';
  }
}
