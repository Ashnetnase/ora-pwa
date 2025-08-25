import { ChevronDown, ChevronRight, Droplets, Zap, Wind, CheckCircle, Phone, ExternalLink, Shield, Globe, Cloud, Activity, Home, Package, Battery, Radio, Flashlight, Heart, Users, MapPin, AlertTriangle, Thermometer } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface SafetyItem {
  id: string;
  text: string;
  icon: React.ReactNode;
  category?: string;
}

interface SafetyChecklist {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  items: SafetyItem[];
}

const safetyChecklists: SafetyChecklist[] = [
  {
    id: 'earthquake-prep',
    title: 'Earthquake Preparedness',
    subtitle: 'Complete preparation guide for earthquake events',
    icon: <Zap className="w-5 h-5" />,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50 border-orange-200',
    items: [
      // Emergency Kit Items
      {
        id: 'eq1',
        text: 'Water: 3 litres per person per day for 3 days minimum',
        icon: <Droplets className="w-4 h-4 text-blue-600" />,
        category: 'Emergency Kit'
      },
      {
        id: 'eq2',
        text: 'Non-perishable food for 3+ days (canned goods, energy bars)',
        icon: <Package className="w-4 h-4 text-green-600" />,
        category: 'Emergency Kit'
      },
      {
        id: 'eq3',
        text: 'Battery-powered or hand-crank radio and weather radio',
        icon: <Radio className="w-4 h-4 text-purple-600" />,
        category: 'Emergency Kit'
      },
      {
        id: 'eq4',
        text: 'Flashlight and extra batteries for each family member',
        icon: <Flashlight className="w-4 h-4 text-yellow-600" />,
        category: 'Emergency Kit'
      },
      {
        id: 'eq5',
        text: 'First aid kit with medications and prescription drugs',
        icon: <Heart className="w-4 h-4 text-red-600" />,
        category: 'Emergency Kit'
      },
      // Home Preparation
      {
        id: 'eq6',
        text: 'Secure heavy furniture and appliances to walls',
        icon: <Home className="w-4 h-4 text-brown-600" />,
        category: 'Home Safety'
      },
      {
        id: 'eq7',
        text: 'Install latches on cabinet doors to prevent contents from falling',
        icon: <AlertTriangle className="w-4 h-4 text-orange-600" />,
        category: 'Home Safety'
      },
      {
        id: 'eq8',
        text: 'Locate safe spots in each room (under sturdy tables, away from glass)',
        icon: <Shield className="w-4 h-4 text-blue-600" />,
        category: 'Home Safety'
      },
      // Family Planning
      {
        id: 'eq9',
        text: 'Create family emergency plan with meeting points and contacts',
        icon: <Users className="w-4 h-4 text-green-600" />,
        category: 'Family Plan'
      },
      {
        id: 'eq10',
        text: 'Identify out-of-state contact person for family coordination',
        icon: <Phone className="w-4 h-4 text-blue-600" />,
        category: 'Family Plan'
      },
      {
        id: 'eq11',
        text: 'Practice Drop, Cover, and Hold On drills regularly',
        icon: <CheckCircle className="w-4 h-4 text-green-600" />,
        category: 'Family Plan'
      },
      // During Earthquake Actions
      {
        id: 'eq12',
        text: 'DROP immediately onto hands and knees',
        icon: <AlertTriangle className="w-4 h-4 text-red-600" />,
        category: 'During Event'
      },
      {
        id: 'eq13',
        text: 'COVER head and neck under sturdy table or against interior wall',
        icon: <Shield className="w-4 h-4 text-blue-600" />,
        category: 'During Event'
      },
      {
        id: 'eq14',
        text: 'HOLD ON to shelter and be prepared to move with it',
        icon: <Users className="w-4 h-4 text-orange-600" />,
        category: 'During Event'
      }
    ],
  },
  {
    id: 'flood-prep',
    title: 'Flood Preparedness',
    subtitle: 'Comprehensive flood safety and preparation guide',
    icon: <Droplets className="w-5 h-5" />,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
    items: [
      // Pre-Flood Preparation
      {
        id: 'fl1',
        text: 'Know your flood risk zone and evacuation routes',
        icon: <MapPin className="w-4 h-4 text-blue-600" />,
        category: 'Preparation'
      },
      {
        id: 'fl2',
        text: 'Keep sandbags, plastic sheeting, and lumber for emergency protection',
        icon: <Package className="w-4 h-4 text-brown-600" />,
        category: 'Preparation'
      },
      {
        id: 'fl3',
        text: 'Install sump pump and backup power source',
        icon: <Battery className="w-4 h-4 text-green-600" />,
        category: 'Preparation'
      },
      {
        id: 'fl4',
        text: 'Keep important documents in waterproof container',
        icon: <Shield className="w-4 h-4 text-blue-600" />,
        category: 'Preparation'
      },
      // During Flood
      {
        id: 'fl5',
        text: 'Move to higher ground immediately when warned',
        icon: <AlertTriangle className="w-4 h-4 text-red-600" />,
        category: 'During Flood'
      },
      {
        id: 'fl6',
        text: 'Never walk, swim, or drive through flood waters',
        icon: <Wind className="w-4 h-4 text-red-600" />,
        category: 'During Flood'
      },
      {
        id: 'fl7',
        text: 'Turn off utilities at main switches if time permits',
        icon: <Zap className="w-4 h-4 text-yellow-600" />,
        category: 'During Flood'
      },
      {
        id: 'fl8',
        text: 'Stay away from downed power lines and electrical wires',
        icon: <AlertTriangle className="w-4 h-4 text-orange-600" />,
        category: 'During Flood'
      },
      // Post-Flood Safety
      {
        id: 'fl9',
        text: 'Wait for authorities to declare area safe before returning',
        icon: <Shield className="w-4 h-4 text-green-600" />,
        category: 'After Flood'
      },
      {
        id: 'fl10',
        text: 'Avoid flood water - it may contain sewage, chemicals, or debris',
        icon: <Droplets className="w-4 h-4 text-brown-600" />,
        category: 'After Flood'
      },
      {
        id: 'fl11',
        text: 'Photograph damage for insurance claims before cleaning',
        icon: <CheckCircle className="w-4 h-4 text-blue-600" />,
        category: 'After Flood'
      },
      {
        id: 'fl12',
        text: 'Clean and disinfect everything that got wet',
        icon: <Heart className="w-4 h-4 text-purple-600" />,
        category: 'After Flood'
      }
    ],
  },
  {
    id: 'storm-kit',
    title: 'Storm Emergency Kit',
    subtitle: 'Essential supplies and preparation for severe weather',
    icon: <Wind className="w-5 h-5" />,
    color: 'text-gray-700',
    bgColor: 'bg-gray-50 border-gray-200',
    items: [
      // Communication & Information
      {
        id: 'st1',
        text: 'Battery-powered weather radio (NOAA Weather Radio)',
        icon: <Radio className="w-4 h-4 text-blue-600" />,
        category: 'Communication'
      },
      {
        id: 'st2',
        text: 'Cell phone with chargers and backup battery/solar charger',
        icon: <Battery className="w-4 h-4 text-green-600" />,
        category: 'Communication'
      },
      {
        id: 'st3',
        text: 'Two-way radios for family communication',
        icon: <Radio className="w-4 h-4 text-purple-600" />,
        category: 'Communication'
      },
      // Lighting & Power
      {
        id: 'st4',
        text: 'LED flashlights (one per person) with extra batteries',
        icon: <Flashlight className="w-4 h-4 text-yellow-600" />,
        category: 'Power & Light'
      },
      {
        id: 'st5',
        text: 'Battery-powered lanterns for area lighting',
        icon: <Flashlight className="w-4 h-4 text-orange-600" />,
        category: 'Power & Light'
      },
      {
        id: 'st6',
        text: 'Generator with fuel (operated outdoors only)',
        icon: <Zap className="w-4 h-4 text-red-600" />,
        category: 'Power & Light'
      },
      // Food & Water
      {
        id: 'st7',
        text: 'One gallon of water per person per day (3-day minimum)',
        icon: <Droplets className="w-4 h-4 text-blue-600" />,
        category: 'Food & Water'
      },
      {
        id: 'st8',
        text: 'Non-perishable food (canned goods, protein bars, dried fruits)',
        icon: <Package className="w-4 h-4 text-green-600" />,
        category: 'Food & Water'
      },
      {
        id: 'st9',
        text: 'Manual can opener, disposable plates, cups, and utensils',
        icon: <Package className="w-4 h-4 text-brown-600" />,
        category: 'Food & Water'
      },
      // Safety & Tools
      {
        id: 'st10',
        text: 'First aid kit with bandages, antiseptic, and medications',
        icon: <Heart className="w-4 h-4 text-red-600" />,
        category: 'Safety & Tools'
      },
      {
        id: 'st11',
        text: 'Multi-tool or Swiss Army knife with multiple functions',
        icon: <AlertTriangle className="w-4 h-4 text-gray-600" />,
        category: 'Safety & Tools'
      },
      {
        id: 'st12',
        text: 'Duct tape and plastic sheeting for temporary repairs',
        icon: <Home className="w-4 h-4 text-blue-600" />,
        category: 'Safety & Tools'
      },
      // Comfort & Sanitation
      {
        id: 'st13',
        text: 'Warm blankets, sleeping bags, and extra clothing',
        icon: <Thermometer className="w-4 h-4 text-purple-600" />,
        category: 'Comfort'
      },
      {
        id: 'st14',
        text: 'Personal hygiene items, toilet paper, and feminine supplies',
        icon: <Heart className="w-4 h-4 text-pink-600" />,
        category: 'Comfort'
      },
      {
        id: 'st15',
        text: 'Important documents in waterproof container',
        icon: <Shield className="w-4 h-4 text-blue-600" />,
        category: 'Documents'
      }
    ],
  },
];

export function InfoScreen() {
  const [openChecklists, setOpenChecklists] = useState<Set<string>>(new Set());

  const toggleChecklist = (id: string) => {
    setOpenChecklists(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleEmergencyCall = () => {
    window.open('tel:111', '_self');
  };

  const handleCivilDefence = () => {
    window.open('https://civildefence.govt.nz', '_blank');
  };

  const openLink = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Safety Information
        </h2>
        <p className="text-muted-foreground">
          Essential checklists for emergency preparedness
        </p>
      </div>

      {/* Trusted Data Sources Badge */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold text-primary">Trusted Data Sources</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
              <Activity className="w-3 h-3 mr-1" />
              GeoNet NZ
            </Badge>
            <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200">
              <Globe className="w-3 h-3 mr-1" />
              NZTA
            </Badge>
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
              <Cloud className="w-3 h-3 mr-1" />
              MetService
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Official New Zealand government data sources for real-time emergency information
          </p>
        </CardContent>
      </Card>

      {/* Emergency Quick Dial */}
      <Card className="bg-destructive/5 border-destructive/20">
        <CardContent className="p-4">
          <div className="text-center space-y-3">
            <h3 className="font-semibold text-destructive flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              Emergency Quick Dial
            </h3>
            <Button 
              onClick={handleEmergencyCall}
              size="lg"
              className="w-full bg-destructive hover:bg-destructive/90 text-white font-bold text-xl py-4"
            >
              <Phone className="w-6 h-6 mr-3" />
              CALL 111 NOW
            </Button>
            <p className="text-xs text-muted-foreground">
              Police • Fire • Ambulance • Emergency Services
            </p>
            
            <div className="pt-2 border-t border-destructive/20">
              <Button 
                onClick={handleCivilDefence}
                variant="outline"
                size="sm"
                className="w-full border-primary text-primary hover:bg-primary hover:text-white"
              >
                <Shield className="w-4 h-4 mr-2" />
                Civil Defence Emergency Management
                <ExternalLink className="w-3 h-3 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {safetyChecklists.map(checklist => {
          const isOpen = openChecklists.has(checklist.id);
          
          // Group items by category
          const groupedItems = checklist.items.reduce((acc, item) => {
            const category = item.category || 'General';
            if (!acc[category]) acc[category] = [];
            acc[category].push(item);
            return acc;
          }, {} as Record<string, typeof checklist.items>);
          
          return (
            <Card key={checklist.id} className={`shadow-sm ${checklist.bgColor}`}>
              <Collapsible
                open={isOpen}
                onOpenChange={() => toggleChecklist(checklist.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className={`flex items-center gap-3 ${checklist.color}`}>
                        {checklist.icon}
                        <div>
                          <div className="text-foreground text-lg font-semibold">{checklist.title}</div>
                          <div className="text-sm text-muted-foreground font-normal">{checklist.subtitle}</div>
                        </div>
                      </div>
                      {isOpen ? (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      {Object.entries(groupedItems).map(([category, items]) => (
                        <div key={category}>
                          <h4 className="font-medium text-foreground mb-3 pb-1 border-b border-border/30 flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {items.length} items
                            </span>
                          </h4>
                          <div className="space-y-3">
                            {items.map(item => (
                              <div key={item.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/30 transition-colors">
                                {item.icon}
                                <span className="text-sm text-foreground leading-relaxed">
                                  {item.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>

      {/* Emergency Contacts */}
      <Card className="shadow-sm bg-destructive/5 border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Emergency Contacts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={() => window.open('tel:111', '_self')}
            variant="destructive"
            size="lg"
            className="w-full font-bold text-lg"
          >
            <Phone className="w-5 h-5 mr-2" />
            Emergency Services - 111
          </Button>
          
          <div className="grid grid-cols-1 gap-2">
            <Button
              onClick={() => window.open('tel:0800438732', '_self')}
              variant="outline"
              size="sm"
              className="justify-between border-primary text-primary hover:bg-primary hover:text-white"
            >
              <span>Civil Defence</span>
              <span className="font-semibold">0800 GET READY</span>
            </Button>
            <Button
              onClick={() => window.open('tel:1737', '_self')}
              variant="outline"
              size="sm"
              className="justify-between border-primary text-primary hover:bg-primary hover:text-white"
            >
              <span>Crisis Helpline</span>
              <span className="font-semibold">1737</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Official Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Trusted New Zealand government sources for emergency information:
          </p>
          
          <div className="grid grid-cols-1 gap-2">
            <Button
              onClick={() => openLink('https://getready.govt.nz')}
              variant="ghost"
              size="sm"
              className="justify-start h-auto p-3 border border-border hover:bg-muted"
            >
              <Shield className="w-4 h-4 mr-3 text-primary flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium">Get Ready</div>
                <div className="text-xs text-muted-foreground">Emergency preparedness guide</div>
              </div>
              <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
            </Button>
            
            <Button
              onClick={() => openLink('https://civildefence.govt.nz')}
              variant="ghost"
              size="sm"
              className="justify-start h-auto p-3 border border-border hover:bg-muted"
            >
              <Shield className="w-4 h-4 mr-3 text-blue-600 flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium">Civil Defence</div>
                <div className="text-xs text-muted-foreground">Emergency management</div>
              </div>
              <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
            </Button>
            
            <Button
              onClick={() => openLink('https://www.metservice.com/warnings/home')}
              variant="ghost"
              size="sm"
              className="justify-start h-auto p-3 border border-border hover:bg-muted"
            >
              <Cloud className="w-4 h-4 mr-3 text-green-600 flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium">MetService</div>
                <div className="text-xs text-muted-foreground">Weather warnings & forecasts</div>
              </div>
              <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
            </Button>
            
            <Button
              onClick={() => openLink('https://www.geonet.org.nz')}
              variant="ghost"
              size="sm"
              className="justify-start h-auto p-3 border border-border hover:bg-muted"
            >
              <Activity className="w-4 h-4 mr-3 text-red-600 flex-shrink-0" />
              <div className="text-left">
                <div className="font-medium">GeoNet</div>
                <div className="text-xs text-muted-foreground">Earthquake & volcano monitoring</div>
              </div>
              <ExternalLink className="w-3 h-3 ml-auto text-muted-foreground" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}