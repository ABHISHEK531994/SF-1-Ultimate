import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Sprout, 
  Search, 
  BookOpen, 
  Users, 
  Brain, 
  TrendingDown,
  Shield,
  Zap,
  Award,
  MessageSquare
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sprout className="h-4 w-4" />
              SF-1 Ultimate Platform
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Grow Smarter mit{' '}
              <span className="text-primary">KI-Unterstützung</span>
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Die ultimative Cannabis-Growing-Plattform mit AI-Diagnose, 
              Preisvergleich, Community-Forum und wissenschaftlichen Tools.
            </p>
            
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="text-lg">
                <Link href="/auth/register">
                  Kostenlos starten
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <Link href="/auth/login">
                  Login
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Alles was du zum Growen brauchst
            </h2>
            <p className="text-lg text-muted-foreground">
              11 integrierte Services für professionelle Grower
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* AI Diagnosis */}
            <Card>
              <CardHeader>
                <Brain className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>AI Plant Diagnosis</CardTitle>
                <CardDescription>
                  GPT-4 Vision analysiert deine Pflanzen-Fotos und erkennt Probleme automatisch
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Price Comparison */}
            <Card>
              <CardHeader>
                <TrendingDown className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Preisvergleich</CardTitle>
                <CardDescription>
                  10.000+ Strains von 50+ Seedbanks. Finde die besten Deals automatisch
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Grow Journal */}
            <Card>
              <CardHeader>
                <BookOpen className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Grow-Tagebuch</CardTitle>
                <CardDescription>
                  Dokumentiere deinen Grow mit Timeline, Fotos und Community-Feedback
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Community Forum */}
            <Card>
              <CardHeader>
                <Users className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Community Forum</CardTitle>
                <CardDescription>
                  Reddit-Style Forum mit Upvotes, Karma und hilfreichen Diskussionen
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Search */}
            <Card>
              <CardHeader>
                <Search className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Universal Search</CardTitle>
                <CardDescription>
                  Blitzschnelle Suche über Strains, Threads, Grows und User
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Gamification */}
            <Card>
              <CardHeader>
                <Award className="mb-2 h-10 w-10 text-primary" />
                <CardTitle>Gamification</CardTitle>
                <CardDescription>
                  XP, Levels, Badges und Achievements für aktive Community-Mitglieder
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Wissenschaftliche Rechner
            </h2>
            <p className="text-lg text-muted-foreground">
              Optimiere dein Setup mit präzisen Berechnungen
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
              <Zap className="h-6 w-6 text-primary" />
              <div>
                <div className="font-semibold">VPD Calculator</div>
                <div className="text-sm text-muted-foreground">Vapor Pressure Deficit</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
              <Zap className="h-6 w-6 text-primary" />
              <div>
                <div className="font-semibold">EC/PPM Calculator</div>
                <div className="text-sm text-muted-foreground">Nährstoff-Konzentration</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
              <Zap className="h-6 w-6 text-primary" />
              <div>
                <div className="font-semibold">DLI Calculator</div>
                <div className="text-sm text-muted-foreground">Daily Light Integral</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
              <Zap className="h-6 w-6 text-primary" />
              <div>
                <div className="font-semibold">PPFD Calculator</div>
                <div className="text-sm text-muted-foreground">Lichtintensität</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
              <Zap className="h-6 w-6 text-primary" />
              <div>
                <div className="font-semibold">Power Cost Calculator</div>
                <div className="text-sm text-muted-foreground">Stromkosten berechnen</div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
              <Zap className="h-6 w-6 text-primary" />
              <div>
                <div className="font-semibold">CO₂ Calculator</div>
                <div className="text-sm text-muted-foreground">CO₂-Ergänzung optimieren</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">10,000+</div>
              <div className="text-muted-foreground">Cannabis Strains</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">50+</div>
              <div className="text-muted-foreground">Seedbanks</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">11</div>
              <div className="text-muted-foreground">Microservices</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-primary">160+</div>
              <div className="text-muted-foreground">API Endpoints</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Bereit zum Start?
          </h2>
          <p className="mb-8 text-lg opacity-90">
            Registriere dich jetzt kostenlos und nutze alle Features
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg">
            <Link href="/auth/register">
              Jetzt kostenlos registrieren
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sprout className="h-5 w-5 text-primary" />
              <span>© 2025 SF-1 Ultimate. All rights reserved.</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link href="/about" className="hover:text-primary">
                Über uns
              </Link>
              <Link href="/privacy" className="hover:text-primary">
                Datenschutz
              </Link>
              <Link href="/terms" className="hover:text-primary">
                AGB
              </Link>
              <Link href="/contact" className="hover:text-primary">
                Kontakt
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
