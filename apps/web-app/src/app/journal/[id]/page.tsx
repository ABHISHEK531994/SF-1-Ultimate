'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Calendar, 
  Sprout, 
  Heart, 
  MessageSquare, 
  Share2,
  Edit,
  Trash2,
  Eye,
  Droplets,
  Thermometer,
  Zap
} from 'lucide-react';
import { formatDate, formatRelativeTime } from '@/lib/utils';

// Mock Data - TODO: Replace with API
const mockGrow = {
  id: '1',
  title: 'Gorilla Glue #4 Indoor',
  description: 'Mein erster Indoor-Grow mit LED. Ziel ist es, die optimalen VPD-Werte zu halten und dokumentieren.',
  strain: {
    name: 'Gorilla Glue #4',
    breeder: 'GG Strains',
    type: 'HYBRID'
  },
  growType: 'INDOOR',
  medium: 'SOIL',
  status: 'FLOWERING',
  isPublic: true,
  startDate: new Date('2024-09-15'),
  stats: {
    totalEntries: 12,
    totalPhotos: 45,
    totalComments: 8,
    totalReactions: 23,
    followers: 5
  }
};

const mockEntries = [
  {
    id: '1',
    title: 'Woche 6 - Flowering beginnt!',
    content: 'Heute habe ich auf 12/12 umgestellt. Die Pflanzen sind 45cm hoch und sehen sehr gesund aus.',
    day: 42,
    week: 6,
    stage: 'FLOWERING',
    measurements: {
      height: 45,
      ph: 6.2,
      ec: 1.8,
      temperature: 24,
      humidity: 55
    },
    photos: ['photo1.jpg', 'photo2.jpg'],
    stats: {
      comments: 3,
      reactions: 8
    },
    createdAt: new Date('2024-10-27')
  },
  {
    id: '2',
    title: 'Tag 38 - Letzte Woche Veg',
    content: 'Pflanzen werden gut. Habe letztmalig getoppt und werde nächste Woche auf Flowering umstellen.',
    day: 38,
    week: 5,
    stage: 'VEGETATIVE',
    measurements: {
      height: 40,
      ph: 6.3,
      ec: 1.6,
      temperature: 23,
      humidity: 60
    },
    photos: ['photo3.jpg'],
    stats: {
      comments: 2,
      reactions: 5
    },
    createdAt: new Date('2024-10-23')
  }
];

export default function GrowDetailPage({ params }: { params: { id: string } }) {
  const [showNewEntryForm, setShowNewEntryForm] = useState(false);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Grow Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl">{mockGrow.title}</CardTitle>
                <CardDescription className="mt-2">
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="font-medium text-primary">{mockGrow.strain.name}</span>
                    <span>•</span>
                    <span>{mockGrow.strain.type}</span>
                    <span>•</span>
                    <span>{mockGrow.growType}</span>
                    <span>•</span>
                    <span>{mockGrow.medium}</span>
                  </div>
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{mockGrow.description}</p>
            
            {/* Stats Row */}
            <div className="mt-6 flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Gestartet: {formatDate(mockGrow.startDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span>{mockGrow.stats.followers} Follower</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <span>{mockGrow.stats.totalReactions} Reactions</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span>{mockGrow.stats.totalComments} Kommentare</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Journal Einträge</h2>
          <Button onClick={() => setShowNewEntryForm(!showNewEntryForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Neuer Eintrag
          </Button>
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {mockEntries.map((entry, index) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                        D{entry.day}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{entry.title}</CardTitle>
                        <CardDescription>
                          Tag {entry.day} • Woche {entry.week} • {entry.stage}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatRelativeTime(entry.createdAt)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Content */}
                <p className="text-sm">{entry.content}</p>

                {/* Measurements */}
                {entry.measurements && (
                  <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 md:grid-cols-5">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Sprout className="h-4 w-4" />
                        Höhe
                      </div>
                      <div className="mt-1 font-semibold">{entry.measurements.height} cm</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Droplets className="h-4 w-4" />
                        pH
                      </div>
                      <div className="mt-1 font-semibold">{entry.measurements.ph}</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Zap className="h-4 w-4" />
                        EC
                      </div>
                      <div className="mt-1 font-semibold">{entry.measurements.ec} mS/cm</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Thermometer className="h-4 w-4" />
                        Temp
                      </div>
                      <div className="mt-1 font-semibold">{entry.measurements.temperature}°C</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Droplets className="h-4 w-4" />
                        RH
                      </div>
                      <div className="mt-1 font-semibold">{entry.measurements.humidity}%</div>
                    </div>
                  </div>
                )}

                {/* Photos Preview */}
                {entry.photos.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {entry.photos.map((photo, idx) => (
                      <div
                        key={idx}
                        className="h-32 w-32 flex-shrink-0 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
                      >
                        <Sprout className="h-12 w-12 text-primary/40" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 border-t pt-4">
                  <Button variant="ghost" size="sm">
                    <Heart className="mr-2 h-4 w-4" />
                    {entry.stats.reactions}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {entry.stats.comments}
                  </Button>
                  <div className="ml-auto flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {mockEntries.length === 0 && (
          <Card className="flex flex-col items-center justify-center py-16">
            <Calendar className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">Noch keine Einträge</h3>
            <p className="mb-6 text-center text-muted-foreground">
              Starte mit deinem ersten Eintrag und dokumentiere deinen Grow!
            </p>
            <Button onClick={() => setShowNewEntryForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Ersten Eintrag erstellen
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
