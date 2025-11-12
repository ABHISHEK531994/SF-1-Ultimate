'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Plus, 
  TrendingUp, 
  Users, 
  Award,
  Sprout,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/components/providers/auth-provider';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    { name: 'Meine Grows', value: '3', icon: Sprout, change: '+1 diese Woche' },
    { name: 'Journal Einträge', value: '24', icon: Calendar, change: '+5 diese Woche' },
    { name: 'Community Beiträge', value: '12', icon: MessageSquare, change: '+2 heute' },
    { name: 'Erreichte Level', value: '5', icon: Award, change: '450 XP bis Level 6' },
  ];

  const quickActions = [
    {
      title: 'Neuer Grow',
      description: 'Starte einen neuen Grow und dokumentiere deine Reise',
      icon: Plus,
      href: '/journal/new',
      color: 'bg-primary',
    },
    {
      title: 'Preise vergleichen',
      description: 'Finde die besten Deals für deine Lieblings-Strains',
      icon: TrendingUp,
      href: '/prices',
      color: 'bg-blue-500',
    },
    {
      title: 'Community',
      description: 'Diskutiere mit anderen Growern und teile dein Wissen',
      icon: Users,
      href: '/community',
      color: 'bg-purple-500',
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold">
            Willkommen zurück, {user?.displayName || user?.username}! 👋
          </h1>
          <p className="text-muted-foreground">
            Hier ist eine Übersicht deiner Growing-Aktivitäten
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.name}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">Schnellaktionen</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card key={action.title} className="cursor-pointer transition-colors hover:bg-accent">
                  <CardHeader>
                    <div className={`mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg ${action.color} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle>{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* My Grows */}
          <Card>
            <CardHeader>
              <CardTitle>Meine Grows</CardTitle>
              <CardDescription>Deine aktiven Grow-Projekte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10">
                      <Sprout className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Gorilla Glue #4</div>
                      <div className="text-sm text-muted-foreground">Tag 45 • Flowering</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Öffnen</Button>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10">
                      <Sprout className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Northern Lights</div>
                      <div className="text-sm text-muted-foreground">Tag 28 • Vegetative</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Öffnen</Button>
                </div>

                <Button variant="outline" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Neuen Grow starten
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Community Feed</CardTitle>
              <CardDescription>Neueste Beiträge aus der Community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3 rounded-lg border p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-medium">
                    JD
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Erste Ernte nach 90 Tagen!</div>
                    <div className="text-sm text-muted-foreground">
                      John Doe • vor 2 Stunden
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 rounded-lg border p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 text-white text-sm font-medium">
                    MS
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">VPD richtig einstellen?</div>
                    <div className="text-sm text-muted-foreground">
                      Mike Smith • vor 5 Stunden
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Alle Beiträge ansehen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
