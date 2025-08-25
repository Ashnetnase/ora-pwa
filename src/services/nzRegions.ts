// New Zealand Regional Structure with Cities
// Based on official NZ regional council boundaries and major population centers

export interface NZCity {
  name: string;
  lat: number;
  lng: number;
  population?: number;
  isMain?: boolean; // Major city in the region
}

export interface NZRegion {
  name: string;
  shortName: string;
  cities: NZCity[];
  centerLat: number;
  centerLng: number;
  description: string;
}

export const NZ_REGIONS: NZRegion[] = [
  {
    name: "Northland",
    shortName: "NTL",
    description: "Far North to Kaipara",
    centerLat: -35.7278,
    centerLng: 174.3239,
    cities: [
      { name: "Whangarei", lat: -35.7253, lng: 174.3230, population: 59800, isMain: true },
      { name: "Kerikeri", lat: -35.2268, lng: 173.9470, population: 7700 },
      { name: "Kaitaia", lat: -35.1150, lng: 173.2630, population: 5100 },
      { name: "Dargaville", lat: -35.9323, lng: 173.8770, population: 4800 },
      { name: "Paihia", lat: -35.2792, lng: 174.0886, population: 1800 },
      { name: "Russell", lat: -35.2627, lng: 174.1197, population: 800 }
    ]
  },
  {
    name: "Auckland",
    shortName: "AUK",
    description: "Greater Auckland metropolitan area",
    centerLat: -36.8485,
    centerLng: 174.7633,
    cities: [
      { name: "Auckland CBD", lat: -36.8485, lng: 174.7633, population: 1695200, isMain: true },
      { name: "North Shore", lat: -36.8000, lng: 174.7500, population: 250000 },
      { name: "Manukau", lat: -36.9939, lng: 174.8797, population: 380000 },
      { name: "Waitakere", lat: -36.8500, lng: 174.5500, population: 210000 },
      { name: "Papakura", lat: -37.0595, lng: 174.9416, population: 56000 },
      { name: "Franklin", lat: -37.2200, lng: 175.1000, population: 75000 }
    ]
  },
  {
    name: "Waikato",
    shortName: "WKO",
    description: "Central North Island including Hamilton",
    centerLat: -37.7870,
    centerLng: 175.2793,
    cities: [
      { name: "Hamilton", lat: -37.7870, lng: 175.2793, population: 179000, isMain: true },
      { name: "Tauranga", lat: -37.6878, lng: 176.1651, population: 158300, isMain: true },
      { name: "Rotorua", lat: -38.1368, lng: 176.2497, population: 71900 },
      { name: "Taupo", lat: -38.6857, lng: 176.0702, population: 25000 },
      { name: "Te Awamutu", lat: -38.0133, lng: 175.3227, population: 13800 },
      { name: "Cambridge", lat: -37.8886, lng: 175.4678, population: 19000 },
      { name: "Morrinsville", lat: -37.6563, lng: 175.5285, population: 7600 },
      { name: "Mount Maunganui", lat: -37.6364, lng: 176.1845, population: 23000 }
    ]
  },
  {
    name: "Bay of Plenty",
    shortName: "BOP",
    description: "Eastern coastal region",
    centerLat: -37.7500,
    centerLng: 176.8500,
    cities: [
      { name: "Tauranga", lat: -37.6878, lng: 176.1651, population: 158300, isMain: true },
      { name: "Rotorua", lat: -38.1368, lng: 176.2497, population: 71900, isMain: true },
      { name: "Whakatane", lat: -37.9519, lng: 176.9619, population: 21400 },
      { name: "Te Puke", lat: -37.7840, lng: 176.3269, population: 8900 },
      { name: "Kawerau", lat: -38.0982, lng: 176.7022, population: 6800 },
      { name: "Opotiki", lat: -38.0093, lng: 177.2873, population: 4200 }
    ]
  },
  {
    name: "Gisborne",
    shortName: "GIS",
    description: "East Coast region",
    centerLat: -38.6627,
    centerLng: 178.0176,
    cities: [
      { name: "Gisborne", lat: -38.6627, lng: 178.0176, population: 38800, isMain: true },
      { name: "Ruatoria", lat: -37.5893, lng: 178.3281, population: 900 },
      { name: "Te Araroa", lat: -37.6139, lng: 178.3556, population: 200 }
    ]
  },
  {
    name: "Hawke's Bay",
    shortName: "HKB",
    description: "Central East Coast",
    centerLat: -39.4928,
    centerLng: 176.9120,
    cities: [
      { name: "Napier", lat: -39.4928, lng: 176.9120, population: 67500, isMain: true },
      { name: "Hastings", lat: -39.6381, lng: 176.8413, population: 52200, isMain: true },
      { name: "Havelock North", lat: -39.6677, lng: 176.8770, population: 14200 },
      { name: "Waipawa", lat: -39.9350, lng: 176.5531, population: 2400 },
      { name: "Waipukurau", lat: -40.0114, lng: 176.5522, population: 4100 },
      { name: "Wairoa", lat: -39.0353, lng: 177.4103, population: 4500 }
    ]
  },
  {
    name: "Taranaki",
    shortName: "TKI",
    description: "Western North Island",
    centerLat: -39.0556,
    centerLng: 174.0752,
    cities: [
      { name: "New Plymouth", lat: -39.0556, lng: 174.0752, population: 87000, isMain: true },
      { name: "Hawera", lat: -39.5928, lng: 174.2819, population: 11200 },
      { name: "Stratford", lat: -39.3361, lng: 174.2833, population: 5600 },
      { name: "Opunake", lat: -39.4561, lng: 173.8597, population: 1400 },
      { name: "Inglewood", lat: -39.2803, lng: 174.0789, population: 3400 }
    ]
  },
  {
    name: "Manawatu-Wanganui",
    shortName: "MWT",
    description: "Central North Island",
    centerLat: -40.3523,
    centerLng: 175.6082,
    cities: [
      { name: "Palmerston North", lat: -40.3523, lng: 175.6082, population: 91000, isMain: true },
      { name: "Wanganui", lat: -39.9275, lng: 175.0550, population: 43400, isMain: true },
      { name: "Levin", lat: -40.6214, lng: 175.2714, population: 21000 },
      { name: "Fielding", lat: -40.2272, lng: 175.5675, population: 16200 },
      { name: "Feilding", lat: -40.2272, lng: 175.5675, population: 16200 },
      { name: "Dannevirke", lat: -40.2022, lng: 176.1069, population: 5500 }
    ]
  },
  {
    name: "Wellington",
    shortName: "WGN",
    description: "Capital region and surroundings",
    centerLat: -41.2865,
    centerLng: 174.7762,
    cities: [
      { name: "Wellington", lat: -41.2865, lng: 174.7762, population: 215900, isMain: true },
      { name: "Lower Hutt", lat: -41.2089, lng: 174.9080, population: 108000 },
      { name: "Upper Hutt", lat: -41.1244, lng: 175.0707, population: 44000 },
      { name: "Porirua", lat: -41.1347, lng: 174.8403, population: 59200 },
      { name: "Kapiti Coast", lat: -40.9000, lng: 175.0000, population: 56000 },
      { name: "Masterton", lat: -40.9503, lng: 175.6578, population: 25000 }
    ]
  },
  {
    name: "Tasman",
    shortName: "TAS",
    description: "Top of the South Island",
    centerLat: -41.2706,
    centerLng: 173.2840,
    cities: [
      { name: "Nelson", lat: -41.2706, lng: 173.2840, population: 52000, isMain: true },
      { name: "Richmond", lat: -41.3272, lng: 173.1881, population: 18000 },
      { name: "Motueka", lat: -41.1219, lng: 172.9869, population: 8000 },
      { name: "Takaka", lat: -40.8550, lng: 172.8089, population: 1300 }
    ]
  },
  {
    name: "Marlborough",
    shortName: "MBH",
    description: "Northeast South Island",
    centerLat: -41.5096,
    centerLng: 174.2379,
    cities: [
      { name: "Blenheim", lat: -41.5096, lng: 173.9520, population: 31000, isMain: true },
      { name: "Picton", lat: -41.2906, lng: 174.0075, population: 4300 },
      { name: "Havelock", lat: -41.2647, lng: 173.7769, population: 500 }
    ]
  },
  {
    name: "West Coast",
    shortName: "WTC",
    description: "Western South Island",
    centerLat: -42.4500,
    centerLng: 171.2100,
    cities: [
      { name: "Greymouth", lat: -42.4500, lng: 171.2100, population: 13100, isMain: true },
      { name: "Westport", lat: -41.7506, lng: 171.6050, population: 4600 },
      { name: "Hokitika", lat: -42.7167, lng: 170.9667, population: 3000 },
      { name: "Franz Josef", lat: -43.3881, lng: 170.1881, population: 350 },
      { name: "Fox Glacier", lat: -43.4642, lng: 170.0181, population: 300 }
    ]
  },
  {
    name: "Canterbury",
    shortName: "CAN",
    description: "Central South Island",
    centerLat: -43.5321,
    centerLng: 172.6362,
    cities: [
      { name: "Christchurch", lat: -43.5321, lng: 172.6362, population: 383200, isMain: true },
      { name: "Timaru", lat: -44.3906, lng: 171.2373, population: 30000 },
      { name: "Ashburton", lat: -43.9081, lng: 171.7500, population: 20000 },
      { name: "Rangiora", lat: -43.3047, lng: 172.5947, population: 18000 },
      { name: "Kaikoura", lat: -42.4000, lng: 173.6819, population: 2200 },
      { name: "Rolleston", lat: -43.5886, lng: 172.3869, population: 22000 }
    ]
  },
  {
    name: "Otago",
    shortName: "OTA",
    description: "Central-southern South Island",
    centerLat: -45.8788,
    centerLng: 170.5028,
    cities: [
      { name: "Dunedin", lat: -45.8788, lng: 170.5028, population: 133400, isMain: true },
      { name: "Queenstown", lat: -45.0312, lng: 168.6626, population: 18000, isMain: true },
      { name: "Wanaka", lat: -44.7000, lng: 169.1500, population: 9000 },
      { name: "Oamaru", lat: -45.0964, lng: 170.9703, population: 13900 },
      { name: "Cromwell", lat: -45.0386, lng: 169.1986, population: 5900 },
      { name: "Balclutha", lat: -46.2333, lng: 169.7500, population: 4000 }
    ]
  },
  {
    name: "Southland",
    shortName: "STL",
    description: "Southernmost region",
    centerLat: -46.4132,
    centerLng: 168.3538,
    cities: [
      { name: "Invercargill", lat: -46.4132, lng: 168.3538, population: 51200, isMain: true },
      { name: "Gore", lat: -46.1031, lng: 168.9422, population: 12300 },
      { name: "Te Anau", lat: -45.4147, lng: 167.7178, population: 2000 },
      { name: "Winton", lat: -46.1467, lng: 168.3269, population: 2300 },
      { name: "Bluff", lat: -46.6000, lng: 168.3333, population: 1800 }
    ]
  }
];

// Helper functions for working with regions
export class NZRegionService {
  /**
   * Get all regions
   */
  static getAllRegions(): NZRegion[] {
    return NZ_REGIONS;
  }

  /**
   * Get a specific region by name
   */
  static getRegion(regionName: string): NZRegion | undefined {
    return NZ_REGIONS.find(region => 
      region.name.toLowerCase() === regionName.toLowerCase() ||
      region.shortName.toLowerCase() === regionName.toLowerCase()
    );
  }

  /**
   * Get all cities in a region
   */
  static getCitiesInRegion(regionName: string): NZCity[] {
    const region = this.getRegion(regionName);
    return region ? region.cities : [];
  }

  /**
   * Get main cities only (major population centers)
   */
  static getMainCities(): NZCity[] {
    return NZ_REGIONS.flatMap(region => 
      region.cities.filter(city => city.isMain)
    );
  }

  /**
   * Find which region a city belongs to
   */
  static findRegionForCity(cityName: string): NZRegion | undefined {
    return NZ_REGIONS.find(region =>
      region.cities.some(city => 
        city.name.toLowerCase() === cityName.toLowerCase()
      )
    );
  }

  /**
   * Get all cities across all regions
   */
  static getAllCities(): NZCity[] {
    return NZ_REGIONS.flatMap(region => region.cities);
  }

  /**
   * Search cities by name (partial match)
   */
  static searchCities(searchTerm: string): { city: NZCity; region: NZRegion }[] {
    const results: { city: NZCity; region: NZRegion }[] = [];
    
    NZ_REGIONS.forEach(region => {
      region.cities.forEach(city => {
        if (city.name.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push({ city, region });
        }
      });
    });
    
    return results.sort((a, b) => {
      // Sort by population (descending), then alphabetically
      const popDiff = (b.city.population || 0) - (a.city.population || 0);
      return popDiff !== 0 ? popDiff : a.city.name.localeCompare(b.city.name);
    });
  }

  /**
   * Get coordinates for a city or region center
   */
  static getCoordinates(name: string): { lat: number; lng: number } | undefined {
    // Try to find as city first
    const allCities = this.getAllCities();
    const city = allCities.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (city) {
      return { lat: city.lat, lng: city.lng };
    }

    // Try to find as region
    const region = this.getRegion(name);
    if (region) {
      return { lat: region.centerLat, lng: region.centerLng };
    }

    return undefined;
  }

  /**
   * Calculate the center point of multiple cities
   */
  static calculateCenterPoint(cities: string[]): { lat: number; lng: number } {
    const validCoords = cities
      .map(city => this.getCoordinates(city))
      .filter(coord => coord !== undefined) as { lat: number; lng: number }[];

    if (validCoords.length === 0) {
      // Default to geographic center of NZ
      return { lat: -40.9006, lng: 174.8860 };
    }

    const avgLat = validCoords.reduce((sum, coord) => sum + coord.lat, 0) / validCoords.length;
    const avgLng = validCoords.reduce((sum, coord) => sum + coord.lng, 0) / validCoords.length;

    return { lat: avgLat, lng: avgLng };
  }
}
