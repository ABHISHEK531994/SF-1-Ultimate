'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, MessageSquare, Users, TrendingUp, Pin, Lock } from 'lucide-react';
import Link from 'next/link';
import { formatNumber } from '@/lib/utils';

// Mock Data - TODO: Replace with API
const mockCategories = [
  {
    id: '1',
    name: 'Anfänger-Fragen',
    slug: 'beginners',
    description: 'Stelle hier deine Fragen als Anfänger. Die Community hilft gerne!',
    icon: '🌱',
    color: 'bg-green-500',
    stats: {
      threads: 1234,
      replies: 5678,
    },
    latestThread: {
      title: 'Erste Indoor-Grow Setup Hilfe',
      author: 'NewGrower123',
      createdAt: new Date('2024-10-28'),
    }
  },
  {
    id: '2',
    name: 'Grow-Techniken',
    slug: 'techniques',
    description: 'Diskutiere über verschiedene Anbaumethoden, LST, HST, SCROG und mehr',
    icon: '🔧',
    color: 'bg-blue-500',
    stats: {
      threads: 892,
      replies: 4521,
    },
    latestThread: {
      title: 'LST vs HST - Was ist besser?',
      author: 'ProGrower',
      createdAt: new Date('2024-10-27'),
    }
  },
  {
    id: '3',
    name: 'Strain-Empfehlungen',
    slug: 'strains',
    description: 'Empfehlungen, Erfahrungen und Diskussionen über verschiedene Strains',
    icon: '🌿',
    color: 'bg-purple-500',
    stats: {
      threads: 2341,
      replies: 9876,
    },
    latestThread: {
      title: 'Bester Strain für Anfänger?',
      author: 'StrainHunter',
      createdAt: new Date('2024-10-28'),
    }
  },
  {
    id: '4',
    name: 'Problemlösungen',
    slug: 'problems',
    description: 'Probleme mit deinen Pflanzen? Hier bekommst du schnelle Hilfe!',
    icon: '🔬',
    color: 'bg-red-500',
    stats: {
      threads: 1567,
      replies: 6789,
    },
    latestThread: {
      title: 'Gelbe Blätter - Was tun?',
      author: 'HelpNeeded',
      createdAt: new Date('2024-10-28'),
    }
  },
  {
    id: '5',
    name: 'Equipment & Setup',
    slug: 'equipment',
    description: 'Lampen, Zelte, Lüftung, Töpfe - alles rund um Equipment',
    icon: '💡',
    color: 'bg-orange-500',
    stats: {
      threads: 987,
      replies: 3456,
    },
    latestThread: {
      title: 'LED vs HPS - 2024 Update',
      author: 'TechGuy',
      createdAt: new Date('2024-10-27'),
    }
  },
  {
    id: '6',
    name: 'Harvest & Curing',
    slug: 'harvest',
    description: 'Alles über Ernte, Trocknung und Fermentation',
    icon: '✂️',
    color: 'bg-amber-500',
    stats: {
      threads: 654,
      replies: 2345,
    },
    latestThread: {
      title: 'Perfekter Ernte-Zeitpunkt?',
      author: 'Harvester',
      createdAt: new Date('2024-10-26'),
    }
  },
];

export default function CommunityPage() {
  const totalThreads = mockCategories.reduce((acc, cat) => acc + cat.stats.threads, 0);
  const totalReplies = mockCategories.reduce((acc, cat) => acc + cat.stats.replies, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Community Forum</h1>
            <p className="text-muted-foreground">
              Tausche dich mit anderen Growern aus und teile dein Wissen
            </p>
          </div>
          <Button asChild>
            <Link href="/community/new">
              <Plus className="mr-2 h-4 w-4" />
              Neuer Thread
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Kategorien</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockCategories.length}</div>
              <p className="text-xs text-muted-foreground">Aktive Bereiche</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Threads</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(totalThreads)}</div>
              <p className="text-xs text-muted-foreground">Gesamt-Diskussionen</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Antworten</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(totalReplies)}</div>
              <p className="text-xs text-muted-foreground">Community Beiträge</p>
            </CardContent>
          </Card>
        </div>

        {/* Categories */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">Kategorien</h2>
          <div className="space-y-4">
            {mockCategories.map((category) => (
              <Link key={category.id} href={`/community/${category.slug}`}>
                <Card className="transition-colors hover:bg-accent cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${category.color} text-white text-2xl`}>
                        {category.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle>{category.name}</CardTitle>
                        </div>
                        <CardDescription className="mt-1">
                          {category.description}
                        </CardDescription>

                        {/* Stats */}
                        <div className="mt-3 flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{formatNumber(category.stats.threads)} Threads</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{formatNumber(category.stats.replies)} Antworten</span>
                          </div>
                        </div>
                      </div>

                      {/* Latest Thread */}
                      <div className="hidden md:block flex-shrink-0 w-64 text-sm">
                        <div className="text-muted-foreground text-xs mb-1">Neuester Thread:</div>
                        <div className="font-medium line-clamp-1">{category.latestThread.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          von {category.latestThread.author}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Pinned Threads */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">Angepinnte Threads</h2>
          <div className="space-y-2">
            <Card>
              <CardHeader className="py-3">
                <div className="flex items-center gap-3">
                  <Pin className="h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <Link href="/community/thread/1" className="font-medium hover:underline">
                      📌 Forum-Regeln - Bitte lesen!
                    </Link>
                    <div className="text-xs text-muted-foreground mt-1">
                      von Admin • vor 30 Tagen
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>234</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>12</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <div className="flex items-center gap-3">
                  <Pin className="h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <Link href="/community/thread/2" className="font-medium hover:underline">
                      📌 Willkommen in der SF-1 Community!
                    </Link>
                    <div className="text-xs text-muted-foreground mt-1">
                      von Admin • vor 45 Tagen
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>567</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>89</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
