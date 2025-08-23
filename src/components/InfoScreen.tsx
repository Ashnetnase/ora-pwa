import { ChevronDown, ChevronRight, Droplets, Zap, Wind, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
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
          <CardTitle className="text-destructive">Emergency Contacts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Emergency Services</span>
            <span className="text-destructive font-semibold">111</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Civil Defence</span>
            <span className="text-primary font-semibold">0800 GET READY</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">National Crisis Helpline</span>
            <span className="text-primary font-semibold">1737</span>
          </div>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            For more detailed emergency preparedness information, visit:
          </p>
          <ul className="text-sm space-y-1">
            <li>• getready.govt.nz</li>
            <li>• civildefence.govt.nz</li>
            <li>• MetService weather warnings</li>
            <li>• GeoNet earthquake information</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}