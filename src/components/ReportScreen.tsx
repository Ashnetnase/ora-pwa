import { useState } from 'react';
import { MapPin, Camera, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';

interface HazardReport {
  id: string;
  title: string;
  description: string;
  category: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  } | null;
  photo: string | null;
  timestamp: string;
}

export function ReportScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const characterLimit = 280;
  const remainingChars = characterLimit - description.length;

  const getLocation = async () => {
    setIsGettingLocation(true);
    
    try {
      // Mock location service - in real app would use navigator.geolocation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockLocation = {
        lat: -36.8485 + (Math.random() - 0.5) * 0.1,
        lng: 174.7633 + (Math.random() - 0.5) * 0.1,
        address: 'Auckland, New Zealand',
      };
      
      setLocation(mockLocation);
      toast.success('Location captured successfully');
    } catch (error) {
      toast.error('Failed to get location');
    } finally {
      setIsGettingLocation(false);
    }
  };

  const handlePhotoUpload = () => {
    // Mock photo upload
    setPhoto('mock-photo-url');
    toast.success('Photo added successfully');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const report: HazardReport = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        category,
        location,
        photo,
        timestamp: new Date().toISOString(),
      };

      // Store report locally (in real app would send to backend)
      const existingReports = JSON.parse(localStorage.getItem('alartd_reports') || '[]');
      existingReports.push(report);
      localStorage.setItem('alartd_reports', JSON.stringify(existingReports));

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setLocation(null);
      setPhoto(null);

      toast.success('Report saved locally ✅');
    } catch (error) {
      toast.error('Failed to save report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Report Hazard
        </h2>
        <p className="text-muted-foreground">
          Help keep your community safe by reporting hazards
        </p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Hazard Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief description of the hazard"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select hazard type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flood">Flood</SelectItem>
                  <SelectItem value="slip">Landslip</SelectItem>
                  <SelectItem value="road">Road Hazard</SelectItem>
                  <SelectItem value="fire">Fire</SelectItem>
                  <SelectItem value="storm">Storm Damage</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Description * 
                <span className={`text-xs ml-2 ${remainingChars < 20 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {remainingChars} characters remaining
                </span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, characterLimit))}
                placeholder="Provide details about the hazard, including severity and any immediate dangers"
                rows={4}
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label>Location</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={getLocation}
                  disabled={isGettingLocation}
                  className="flex-1"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {isGettingLocation ? 'Getting location...' : 'Use my location'}
                </Button>
              </div>
              {location && (
                <p className="text-sm text-muted-foreground">
                  📍 {location.address}
                </p>
              )}
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label>Photo (Optional)</Label>
              <Button
                type="button"
                variant="outline"
                onClick={handlePhotoUpload}
                className="w-full"
              >
                <Camera className="w-4 h-4 mr-2" />
                {photo ? 'Photo added ✓' : 'Add photo'}
              </Button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim() || !description.trim() || !category}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Saving Report...' : 'Save Report'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Info Note */}
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Note:</strong> In emergency situations, call 111 immediately. 
          This form is for non-urgent hazard reporting only.
        </p>
      </div>
    </div>
  );
}