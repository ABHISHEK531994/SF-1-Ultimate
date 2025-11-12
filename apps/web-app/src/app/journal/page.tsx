'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar, Sprout, Eye, Heart, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { formatRelativeTime } from '@/lib/utils';

// TODO: Replace with real API data
const mockGrows = [
  {
    id: '1',
    title: 'Gorilla Glue #4 Indoor',
    strain: { name: 'Gorilla Glue #4', type: 'HYBRID' },
    growType: 'INDOOR',
    medium: 'SOIL',
    status: 'FLOWERING',
    startDate: new Date('2024-09-15'),
    stats: {
      totalEntries: 12,
      totalPhotos: 45,
      totalComments: 8,
      totalReactions: 23,
      followers: 5
    }
  },
  {
    id: '2',
    title: 'Northern Lights Autoflower',
    strain: { name: 'Northern Lights Auto', type: 'INDICA' },
    growType: 'INDOOR',
    medium: 'COCO',
    status: 'VEGETATIVE',
    startDate: new Date('2024-10-01'),
    stats: {
      totalEntries: 8,
      totalPhotos: 24,
      totalComments: 3,
      totalReactions: 12,
      followers: 2
    }
  },
  {
    id: '3',
    title: 'Blue Dream Outdoor Summer',
    strain: { name: 'Blue Dream', type: 'SATIVA' },
    growType: 'OUTDOOR',
    medium: 'SOIL',
    status: 'HARVESTED',
    startDate: new Date('2024-05-01'),
    harvestDate: new Date('2024-09-20'),
    stats: {
      totalEntries: 24,
      totalPhotos: 96,
      totalComments: 18,
      totalReactions: 54,
      followers: 12
    }
  }
];

const statusColors = {
  PLANNING: 'bg-gray-500',
  GERMINATION: 'bg-yellow-500',
  SEEDLING: 'bg-lime-500',
  VEGETATIVE: 'bg-green-500',
  FLOWERING: 'bg-purple-500',
  DRYING: 'bg-orange-500',
  CURING: 'bg-brown-500',
  HARVESTED: 'bg-blue-500',
  ABANDONED: 'bg-red-500'
};

const typeColors = {
  SATIVA: 'text-orange-500',
  INDICA: 'text-purple-500',
  HYBRID: 'text-green-500',
  RUDERALIS: 'text-blue-500'
};

export default function JournalPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mein Grow Journal</h1>
            <p className="text-muted-foreground">
              Dokumentiere deine Grows und teile deine Erfahrungen
            </p>
          </div>
          <Button asChild>
            <Link href="/journal/new">
              <Plus className="mr-2 h-4 w-4" />
              Neuer Grow
            </Link>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktive Grows</CardTitle>
              <Sprout className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">+1 dieser Monat</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Einträge</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">44</div>
              <p className="text-xs text-muted-foreground">+5 diese Woche</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Follower</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">19</div>
              <p className="text-xs text-muted-foreground">+3 diese Woche</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reactions</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">+12 diese Woche</p>
            </CardContent>
          </Card>
        </div>

        {/* Grows Grid */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">Meine Grows</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockGrows.map((grow) => (
              <Card key={grow.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Grow Header with Image Placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Sprout className="h-20 w-20 text-primary/40" />
                  <div className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-medium text-white ${statusColors[grow.status as keyof typeof statusColors]}`}>
                    {grow.status}
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="line-clamp-1">{grow.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <span className={`font-medium ${typeColors[grow.strain.type as keyof typeof typeColors]}`}>
                      {grow.strain.name}
                    </span>
                    <span className="text-xs">• {grow.strain.type}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Art:</span>
                      <span className="font-medium">{grow.growType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Medium:</span>
                      <span className="font-medium">{grow.medium}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gestartet:</span>
                      <span className="font-medium">{formatRelativeTime(grow.startDate)}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {grow.stats.totalEntries}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {grow.stats.totalComments}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {grow.stats.totalReactions}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="gap-2">
                  <Button asChild className="flex-1">
                    <Link href={`/journal/${grow.id}`}>
                      Öffnen
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Empty State (if no grows) */}
        {mockGrows.length === 0 && (
          <Card className="flex flex-col items-center justify-center py-16">
            <Sprout className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-xl font-semibold">Noch keine Grows</h3>
            <p className="mb-6 text-center text-muted-foreground">
              Starte deinen ersten Grow und dokumentiere deine Reise!
            </p>
            <Button asChild>
              <Link href="/journal/new">
                <Plus className="mr-2 h-4 w-4" />
                Ersten Grow starten
              </Link>
            </Button>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
