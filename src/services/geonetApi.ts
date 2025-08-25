// GeoNet API Service for New Zealand Earthquake Data
// API Documentation: https://api.geonet.org.nz/

export interface GeoNetQuake {
  publicID: string;
  time: string;
  depth: number;
  magnitude: number;
  latitude: number;
  longitude: number;
  locality: string;
  mmi?: number;
  quality: string;
}

export interface GeoNetFeature {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number, number]; // [longitude, latitude, depth]
  };
  properties: {
    publicID: string;
    time: string;
    depth: number;
    magnitude: number;
    locality: string;
    mmi?: number;
    quality: string;
  };
}

export interface GeoNetResponse {
  type: string;
  features: GeoNetFeature[];
}

export class GeoNetService {
  private static readonly BASE_URL = 'https://api.geonet.org.nz';
  private static cache: { data: GeoNetQuake[]; timestamp: number } | null = null;
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Fetch recent earthquakes from GeoNet API
   * @param minMagnitude Minimum magnitude (default: 3.0)
   * @param maxResults Maximum number of results (default: 100)
   * @returns Promise<GeoNetQuake[]>
   */
  static async getEarthquakes(
    minMagnitude: number = 3.0,
    maxResults: number = 100
  ): Promise<GeoNetQuake[]> {
    try {
      // Check cache first
      if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_DURATION) {
        console.log('Using cached GeoNet earthquake data');
        return this.cache.data;
      }

      console.log('Fetching fresh earthquake data from GeoNet...');
      
      // Construct API URL
      const url = new URL(`${this.BASE_URL}/quake`);
      url.searchParams.append('MMI', '2'); // Minimum MMI (Modified Mercalli Intensity)
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'OraPWA/1.0 (Disaster Response App)'
        }
      });

      if (!response.ok) {
        throw new Error(`GeoNet API error: ${response.status} ${response.statusText}`);
      }

      const data: GeoNetResponse = await response.json();
      
      // Transform GeoNet data to our format
      const earthquakes: GeoNetQuake[] = data.features
        .map(feature => ({
          publicID: feature.properties.publicID,
          time: feature.properties.time,
          depth: feature.properties.depth,
          magnitude: feature.properties.magnitude,
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0],
          locality: feature.properties.locality,
          mmi: feature.properties.mmi,
          quality: feature.properties.quality
        }))
        .filter(quake => quake.magnitude >= minMagnitude)
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, maxResults);

      // Cache the results
      this.cache = {
        data: earthquakes,
        timestamp: Date.now()
      };

      console.log(`Fetched ${earthquakes.length} earthquakes from GeoNet`);
      return earthquakes;

    } catch (error) {
      console.error('Failed to fetch earthquake data from GeoNet:', error);
      throw error;
    }
  }

  /**
   * Get earthquakes filtered by region/city proximity
   * @param cities Array of city names to filter by
   * @param radiusKm Radius in kilometers to search around cities (default: 100km)
   * @returns Promise<GeoNetQuake[]>
   */
  static async getEarthquakesByRegion(
    cities: string[],
    radiusKm: number = 100
  ): Promise<GeoNetQuake[]> {
    try {
      const allQuakes = await this.getEarthquakes();
      
      // Filter earthquakes by proximity to cities or by locality name
      return allQuakes.filter(quake => {
        // Check if locality contains any of the city names
        const localityMatch = cities.some(city => 
          quake.locality.toLowerCase().includes(city.toLowerCase())
        );
        
        if (localityMatch) return true;

        // Additional filtering by geographic proximity could be added here
        // For now, we'll use locality-based filtering
        return false;
      });

    } catch (error) {
      console.error('Failed to filter earthquakes by region:', error);
      throw error;
    }
  }

  /**
   * Clear the earthquake data cache
   */
  static clearCache(): void {
    this.cache = null;
    console.log('GeoNet earthquake cache cleared');
  }

  /**
   * Get the age of cached data in minutes
   * @returns number of minutes since cache was last updated, or null if no cache
   */
  static getCacheAge(): number | null {
    if (!this.cache) return null;
    return Math.floor((Date.now() - this.cache.timestamp) / (1000 * 60));
  }

  /**
   * Get earthquake intensity description
   * @param magnitude Earthquake magnitude
   * @returns Intensity description string
   */
  static getIntensityDescription(magnitude: number): string {
    if (magnitude < 2.0) return 'Not felt';
    if (magnitude < 3.0) return 'Weak';
    if (magnitude < 4.0) return 'Light';
    if (magnitude < 5.0) return 'Moderate';
    if (magnitude < 6.0) return 'Strong';
    if (magnitude < 7.0) return 'Very Strong';
    if (magnitude < 8.0) return 'Severe';
    return 'Extreme';
  }

  /**
   * Format earthquake time for display
   * @param timeString ISO time string from GeoNet
   * @returns Formatted time string
   */
  static formatEarthquakeTime(timeString: string): string {
    const date = new Date(timeString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-NZ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
}
