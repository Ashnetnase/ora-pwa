import { ChevronDown, ChevronRight, Droplets, Zap, Wind, CheckCircle, Phone, ExternalLink, Shield, Globe, Cloud, Activity } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface SafetyItem {
  id: string;
  text: string;
  icon: React.ReactNode;
}

interface SafetyChecklist {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  items: SafetyItem[];
}

const safetyChecklists: SafetyChecklist[] = [
  {
    id: 'flood',
    title: 'Flood Safety',
    icon: <Droplets className="w-5 h-5" />,
    color: 'text-blue-600',
    items: [
      {
        id: 'f1',
        text: 'Move to higher ground immediately',
        icon: <CheckCircle className="w-4 h-4 text-accent" />,
      },
      {
        id: 'f2',
        text: 'Avoid walking or driving through flood water',
        icon: <CheckCircle className="w-4 h-4 text-accent" />,
      },
      {
        id: 'f3',
        text: 'Turn off electricity at the main switch',
        icon: <CheckCircle className="w-4 h-4 text-accent" />,
      },
      {
        id: 'f4',
        text: 'Have emergency supplies ready (water, food, radio)',
        icon: <CheckCircle className="w-4 h-4 text-accent" />,
      },
      {
        id: 'f5',
        text: 'Stay informed via official emergency channels',
        icon: <CheckCircle className="w-4 h-4 text-accent" />,
      },
      {
        id: 'f6',
        text: 'Do not return home until authorities say it\'s safe',
        icon: <CheckCircle className="w-4 h-4 text-accent" />,
      },
    ],
  },
  {
    id: 'earthquake',
    title: 'Earthquake Safety',
    icon: <Zap className="w-5 h-5" />,
    color: 'text-yellow-600',
    items: [
      {
        id: 'e1',
        text: 'Drop, Cover, and Hold On during shaking',
        icon: <CheckCircle className="w-4 h-4 text-accent" />,
      },
      {
        id: 'e2',
        text: 'Stay away from windows and heavy objects',
        icon: <CheckCircle className="w-4 h-4 text-accent" />,
      },
      {
        id: 'e3',
        text: 'If outdoors, move away from buildings and power lines',
        icon: <CheckCircle className="w-4 h-4 text-accent" />,
      },
      {
        id: 'e4',
        text: 'Check for injuries and hazards after shaking stops',
        icon: <CheckCircle className="w-4 h-4 text-accent" />,
      },
      {
        id: 'e5',
        text: 'Be prepared for aftershocks',
        icon: <CheckCircle className="w-4 h-4 text-accent" />,
      },
      {
        id: 'e6',
        text: 'Have a family emergency plan and meeting place',
        icon: <CheckCircle className="w-4 h-4 text-accent" />,
      },
      {
        id: 'e7',
        text: 'Keep emergency kit stocked (3 days supplies)',
        icon: <CheckCircle className="w-4 h-4 text-accent" />,
      },
    ],
  },
  {
    id: 'storm',
    title: 'Storm Safety',
    icon: <Wind className="w-5 h-5" />,
    color: 'text-gray-600',
    items: [
      {
        id: 's1',
        text: 'Stay indoors and away from windows',
        icon: <CheckCircle className="w-4 h-4 text-accent" />,
      },
      {
        id: 's2',
        text: 'Secure outdoor furniture and objects',
        icon: <CheckCircle className="w-4 h-4 text-accent" />,
      },
      {
        id: 's3',
        text: 'Avoid using electrical appliances',
        icon: <CheckCircle className="w-4 h-4 text-accent" />,
      },
      {
        id: 's4',
        text: 'Keep flashlights and battery radio ready',
        icon: <CheckCircle className="w-4 h-4 text-accent" />,
      },
      {
        id: 's5',
        text: 'Monitor weather warnings and updates',
        icon: <CheckCircle className="w-4 h-4 text-accent" />,
      },
      {
        id: 's6',
        text: 'Avoid driving unless absolutely necessary',
        icon: <CheckCircle className="w-4 h-4 text-accent" />,
      },
      {
        id: 's7',
        text: 'Stay away from damaged power lines',
        icon: <CheckCircle className="w-4 h-4 text-accent" />,
      },
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
          
          return (
            <Card key={checklist.id} className="shadow-sm">
              <Collapsible
                open={isOpen}
                onOpenChange={() => toggleChecklist(checklist.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className={`flex items-center gap-3 ${checklist.color}`}>
                        {checklist.icon}
                        <span className="text-foreground">{checklist.title}</span>
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
                    <div className="space-y-3">
                      {checklist.items.map(item => (
                        <div key={item.id} className="flex items-start gap-3">
                          {item.icon}
                          <span className="text-sm text-foreground leading-relaxed">
                            {item.text}
                          </span>
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