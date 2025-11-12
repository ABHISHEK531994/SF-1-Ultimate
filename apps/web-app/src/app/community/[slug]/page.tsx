'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Plus, ArrowUp, ArrowDown, MessageSquare, TrendingUp, Eye, Award } from 'lucide-react';
import Link from 'next/link';
import { formatRelativeTime, formatNumber } from '@/lib/utils';

// Mock Data
const mockCategory = {
  id: '1',
  name: 'Anfänger-Fragen',
  slug: 'beginners',
  description: 'Stelle hier deine Fragen als Anfänger. Die Community hilft gerne!',
  icon: '🌱',
};

const mockThreads = [
  {
    id: '1',
    title: 'Erste Indoor-Grow Setup Hilfe - Welche Lampe?',
    content: 'Hey Leute, ich möchte meinen ersten Indoor-Grow starten...',
    author: {
      id: '1',
      username: 'NewGrower123',
      avatar: null,
      level: 2,
    },
    isPinned: false,
    isLocked: false,
    tags: ['anfänger', 'indoor', 'equipment'],
    stats: {
      views: 234,
      replies: 12,
      votes: 23,
      score: 19,
    },
    createdAt: new Date('2024-10-28T10:30:00'),
  },
  {
    id: '2',
    title: 'pH-Wert richtig messen - Tipps?',
    content: 'Ich bin unsicher wie ich den pH-Wert richtig messe...',
    author: {
      id: '2',
      username: 'GrowNewbie',
      avatar: null,
      level: 1,
    },
    isPinned: false,
    isLocked: false,
    tags: ['ph-wert', 'messung'],
    stats: {
      views: 156,
      replies: 8,
      votes: 15,
      score: 12,
    },
    createdAt: new Date('2024-10-27T15:20:00'),
  },
  {
    id: '3',
    title: 'Welcher Strain für den ersten Grow?',
    content: 'Ich möchte mit einem einfachen Strain anfangen...',
    author: {
      id: '3',
      username: 'FirstTimer',
      avatar: null,
      level: 1,
    },
    isPinned: false,
    isLocked: false,
    tags: ['strain', 'empfehlung'],
    stats: {
      views: 345,
      replies: 24,
      votes: 45,
      score: 38,
    },
    createdAt: new Date('2024-10-26T09:15:00'),
  },
];

export default function CategoryThreadsPage({ params }: { params: { slug: string } }) {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="text-4xl">{mockCategory.icon}</div>
              <div>
                <h1 className="text-3xl font-bold">{mockCategory.name}</h1>
                <p className="text-muted-foreground">{mockCategory.description}</p>
              </div>
            </div>
          </div>
          <Button asChild>
            <Link href={`/community/${params.slug}/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Neuer Thread
            </Link>
          </Button>
        </div>

        {/* Sorting */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            Hot
          </Button>
          <Button variant="ghost" size="sm">
            Neu
          </Button>
          <Button variant="ghost" size="sm">
            Top
          </Button>
        </div>

        {/* Threads List */}
        <div className="space-y-3">
          {mockThreads.map((thread) => (
            <Card key={thread.id} className="hover:bg-accent transition-colors">
              <CardHeader className="p-4">
                <div className="flex gap-4">
                  {/* Voting */}
                  <div className="flex flex-col items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <span className={`text-sm font-semibold ${thread.stats.score > 0 ? 'text-primary' : thread.stats.score < 0 ? 'text-destructive' : ''}`}>
                      {thread.stats.score}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/community/thread/${thread.id}`} className="group">
                      <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {thread.title}
                      </h3>
                    </Link>

                    {/* Tags */}
                    <div className="mt-2 flex flex-wrap gap-2">
                      {thread.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Meta */}
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-xs font-medium">
                          {thread.author.username.charAt(0)}
                        </div>
                        <Link href={`/profile/${thread.author.username}`} className="hover:underline">
                          {thread.author.username}
                        </Link>
                        <div className="flex items-center gap-1 text-xs">
                          <Award className="h-3 w-3" />
                          <span>{thread.author.level}</span>
                        </div>
                      </div>
                      <span>•</span>
                      <span>{formatRelativeTime(thread.createdAt)}</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{formatNumber(thread.stats.views)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{thread.stats.replies}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center">
          <Button variant="outline">Mehr laden</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
