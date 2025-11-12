'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUp, ArrowDown, MessageSquare, Share2, Flag, Award, Check } from 'lucide-react';
import Link from 'next/link';
import { formatRelativeTime } from '@/lib/utils';

// Mock Data
const mockThread = {
  id: '1',
  title: 'Erste Indoor-Grow Setup Hilfe - Welche Lampe?',
  content: `Hey Leute,

ich möchte meinen ersten Indoor-Grow starten und bin total überwältigt von den ganzen Optionen. Mein Setup wird sein:

- Growbox: 80x80x160cm
- Budget: ca. 500€
- Strain: Northern Lights Auto (wurde mir empfohlen)

Welche LED-Lampe würdet ihr empfehlen? Ich habe von Mars Hydro, Spider Farmer und Viparspectra gelesen. Was ist das Beste für Anfänger?

Außerdem: Brauche ich wirklich einen Carbon-Filter von Anfang an oder kann ich den später nachrüsten?

Danke für eure Hilfe! 🌱`,
  author: {
    id: '1',
    username: 'NewGrower123',
    avatar: null,
    level: 2,
    karma: 156,
  },
  categoryName: 'Anfänger-Fragen',
  categorySlug: 'beginners',
  isPinned: false,
  isLocked: false,
  tags: ['anfänger', 'indoor', 'equipment', 'led'],
  stats: {
    views: 234,
    replies: 5,
    votes: 23,
    score: 19,
  },
  createdAt: new Date('2024-10-28T10:30:00'),
};

const mockReplies = [
  {
    id: '1',
    threadId: '1',
    parentReplyId: null,
    content: `Willkommen in der Community! 👋

Für deine Growbox würde ich den **Spider Farmer SF-1000** empfehlen. Der ist perfekt für 80x80cm und sehr anfängerfreundlich. Mars Hydro TS-1000 ist auch gut, aber Spider Farmer hat meiner Meinung nach das bessere Spektrum.

Zum Carbon-Filter: JA, brauchst du von Anfang an! Sobald die Pflanze in die Blüte geht, riecht das ganze Haus. Besser gleich einplanen.`,
    author: {
      id: '2',
      username: 'ProGrower',
      avatar: null,
      level: 12,
      karma: 4521,
    },
    isAccepted: true,
    stats: {
      votes: 15,
      score: 12,
    },
    createdAt: new Date('2024-10-28T11:15:00'),
  },
  {
    id: '2',
    threadId: '1',
    parentReplyId: null,
    content: `Kann mich ProGrower nur anschließen. Spider Farmer ist eine gute Wahl.

Alternativ kannst du auch bei Sanlight schauen, die sind zwar teurer aber absolute Premium-Qualität. Falls Budget erlaubt: Sanlight Flex II.`,
    author: {
      id: '3',
      username: 'LightExpert',
      avatar: null,
      level: 8,
      karma: 2341,
    },
    isAccepted: false,
    stats: {
      votes: 8,
      score: 6,
    },
    createdAt: new Date('2024-10-28T12:00:00'),
  },
  {
    id: '3',
    threadId: '1',
    parentReplyId: '1',
    content: 'Danke für den Tipp! Spider Farmer SF-1000 schaue ich mir mal genauer an. Wo kauft ihr am besten? Amazon oder gibt es bessere Shops?',
    author: {
      id: '1',
      username: 'NewGrower123',
      avatar: null,
      level: 2,
      karma: 156,
    },
    isAccepted: false,
    stats: {
      votes: 3,
      score: 3,
    },
    createdAt: new Date('2024-10-28T13:30:00'),
  },
];

export default function ThreadDetailPage({ params }: { params: { id: string } }) {
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReply = async () => {
    setIsSubmitting(true);
    // TODO: API Call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setReplyContent('');
    setIsSubmitting(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/community" className="hover:text-foreground">Community</Link>
          <span>/</span>
          <Link href={`/community/${mockThread.categorySlug}`} className="hover:text-foreground">
            {mockThread.categoryName}
          </Link>
          <span>/</span>
          <span className="text-foreground">Thread</span>
        </div>

        {/* Thread */}
        <Card>
          <CardHeader>
            <div className="flex gap-4">
              {/* Voting */}
              <div className="flex flex-col items-center gap-1">
                <Button variant="ghost" size="icon">
                  <ArrowUp className="h-5 w-5" />
                </Button>
                <span className={`text-lg font-bold ${mockThread.stats.score > 0 ? 'text-primary' : ''}`}>
                  {mockThread.stats.score}
                </span>
                <Button variant="ghost" size="icon">
                  <ArrowDown className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-3">{mockThread.title}</h1>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {mockThread.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Author & Meta */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white font-medium">
                      {mockThread.author.username.charAt(0)}
                    </div>
                    <Link href={`/profile/${mockThread.author.username}`} className="font-medium hover:underline">
                      {mockThread.author.username}
                    </Link>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4" />
                      <span>Level {mockThread.author.level}</span>
                    </div>
                    <span>•</span>
                    <span>{mockThread.author.karma} Karma</span>
                  </div>
                  <span>•</span>
                  <span>{formatRelativeTime(mockThread.createdAt)}</span>
                </div>

                {/* Content */}
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{mockThread.content}</p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center gap-3">
                  <Button variant="ghost" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Teilen
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Flag className="mr-2 h-4 w-4" />
                    Melden
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Replies */}
        <div>
          <h2 className="mb-4 text-xl font-semibold">
            {mockThread.stats.replies} Antworten
          </h2>

          <div className="space-y-4">
            {mockReplies.map((reply) => (
              <Card key={reply.id} className={reply.parentReplyId ? 'ml-12' : ''}>
                <CardHeader>
                  <div className="flex gap-4">
                    {/* Voting */}
                    <div className="flex flex-col items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <span className={`text-sm font-semibold ${reply.stats.score > 0 ? 'text-primary' : ''}`}>
                        {reply.stats.score}
                      </span>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      {/* Author */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-500 text-white text-sm font-medium">
                          {reply.author.username.charAt(0)}
                        </div>
                        <Link href={`/profile/${reply.author.username}`} className="font-medium hover:underline">
                          {reply.author.username}
                        </Link>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Award className="h-3 w-3" />
                          <span>Level {reply.author.level}</span>
                        </div>
                        {reply.isAccepted && (
                          <div className="flex items-center gap-1 rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
                            <Check className="h-3 w-3" />
                            Akzeptierte Antwort
                          </div>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(reply.createdAt)}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="prose prose-sm max-w-none">
                        <p className="whitespace-pre-wrap text-sm">{reply.content}</p>
                      </div>

                      {/* Actions */}
                      <div className="mt-3 flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="mr-2 h-3 w-3" />
                          Antworten
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Flag className="mr-2 h-3 w-3" />
                          Melden
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Reply Form */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Deine Antwort</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Schreibe deine Antwort..."
              rows={6}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setReplyContent('')}>
                Abbrechen
              </Button>
              <Button onClick={handleSubmitReply} disabled={!replyContent.trim() || isSubmitting}>
                {isSubmitting ? 'Wird gesendet...' : 'Antworten'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
