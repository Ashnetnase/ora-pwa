import { useState, useEffect } from 'react';
import { Cloud, AlertTriangle, Thermometer, Wind, Droplets, Eye, Calendar, MapPin, Clock, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { DataService, WeatherWarning, WeatherForecast } from '../services/mockData';
import { MetServiceAPI } from '../services/metserviceApi';

interface WeatherScreenProps {
  subscriptions: Array<{
    id: string;
    name: string;
    type: 'city' | 'region';
    quakes: boolean;
    roading: boolean;
    community: boolean;
    weather: boolean;
  }>;
}

interface WeatherData {
  warnings: WeatherWarning[];
  forecasts: WeatherForecast[];
}

export function WeatherScreen({ subscriptions }: WeatherScreenProps) {
  const [weatherData, setWeatherData] = useState<WeatherData>({ warnings: [], forecasts: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadWeatherData = async () => {
    setIsLoading(true);
    try {
      // Only load data if weather alerts are enabled for at least one subscription
      const hasWeatherEnabled = subscriptions.some(sub => sub.weather);
      if (hasWeatherEnabled) {
        const data = await DataService.getWeatherDataForSubscriptions(subscriptions);
        setWeatherData(data);
      } else {
        setWeatherData({ warnings: [], forecasts: [] });
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load weather data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (subscriptions.length > 0) {
      loadWeatherData();
    } else {
      setWeatherData({ warnings: [], forecasts: [] });
      setIsLoading(false);
    }
  }, [subscriptions]);

  const getSeverityBadgeVariant = (severity: WeatherWarning['severity']) => {
    switch (severity) {
      case 'watch': return 'secondary';
      case 'warning': return 'destructive';
      case 'severe': return 'destructive';
      default: return 'secondary';
    }
  };

  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    if (lower.includes('rain') || lower.includes('shower')) return <Droplets className="w-5 h-5" />;
    if (lower.includes('cloud')) return <Cloud className="w-5 h-5" />;
    if (lower.includes('wind')) return <Wind className="w-5 h-5" />;
    if (lower.includes('sun')) return <Thermometer className="w-5 h-5" />;
    return <Cloud className="w-5 h-5" />;
  };

  const getWarningIcon = (type: WeatherWarning['type']) => {
    switch (type) {
      case 'heavy-rain': return <Droplets className="w-5 h-5" />;
      case 'strong-wind': return <Wind className="w-5 h-5" />;
      case 'thunderstorm': return <AlertTriangle className="w-5 h-5" />;
      case 'snow': return <Cloud className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('en-NZ', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const subscribedCities = subscriptions.map(sub => sub.name);

  if (subscribedCities.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-muted">
        <div className="text-center p-6">
          <Cloud className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Cities Selected</h3>
          <p className="text-muted-foreground">
            Add cities from your dashboard to see weather alerts and forecasts
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-1">
            Weather Alerts
          </h2>
          <p className="text-muted-foreground text-sm">
            MetService warnings and forecasts for your locations
          </p>
        </div>
        <Button
          onClick={loadWeatherData}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {lastUpdated && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Last updated: {lastUpdated.toLocaleTimeString('en-NZ')}
        </p>
      )}

      {/* Active Weather Warnings */}
      {weatherData.warnings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Active Weather Warnings ({weatherData.warnings.length})
          </h3>
          
          <div className="grid gap-4">
            {weatherData.warnings.map(warning => (
              <Alert key={warning.id} className="border-l-4" style={{ borderLeftColor: warning.color }}>
                <div className="flex items-start gap-3">
                  <div className="text-muted-foreground mt-0.5" style={{ color: warning.color }}>
                    {getWarningIcon(warning.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-foreground">{warning.title}</h4>
                      <Badge 
                        variant={getSeverityBadgeVariant(warning.severity)}
                        className="text-xs"
                      >
                        {warning.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <AlertDescription className="text-sm text-muted-foreground mb-3">
                      {warning.description}
                    </AlertDescription>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {warning.regions.join(', ')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(warning.startTime)}
                        {warning.endTime && ` - ${formatTime(warning.endTime)}`}
                      </div>
                    </div>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </div>
      )}

      {/* Weather Forecasts */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Current Forecasts ({weatherData.forecasts.length})
        </h3>
        
        {weatherData.forecasts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Cloud className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No forecast data available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {weatherData.forecasts.map((forecast, index) => (
              <Card key={`${forecast.city}-${index}`} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{forecast.city}</span>
                    </div>
                    {getWeatherIcon(forecast.condition)}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{forecast.region}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground mb-1">
                      {forecast.condition}
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl font-bold text-foreground">
                        {forecast.temperature.high}°
                      </span>
                      <span className="text-lg text-muted-foreground">
                        / {forecast.temperature.low}°C
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-blue-500" />
                      <span>{forecast.precipitation}mm</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Wind className="w-3 h-3 text-gray-500" />
                      <span>{forecast.windSpeed}km/h {forecast.windDirection}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-blue-400" />
                      <span>{forecast.humidity}% humidity</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-green-500" />
                      <span>Today</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* No Warnings Message */}
      {weatherData.warnings.length === 0 && !isLoading && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-700">
              <Cloud className="w-5 h-5" />
              <span className="font-medium">No Active Weather Warnings</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              All clear! No severe weather warnings for your selected locations.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading weather data...</p>
          </div>
        </div>
      )}

      {/* Data Source Attribution */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Cloud className="w-4 h-4" />
            <span className="font-medium text-sm">MetService New Zealand</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Official weather warnings and forecasts from New Zealand's national weather service. 
            Data is updated every 5 minutes from MetService public feeds.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
