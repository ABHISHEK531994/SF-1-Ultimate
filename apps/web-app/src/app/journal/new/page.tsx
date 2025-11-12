'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const createGrowSchema = z.object({
  title: z.string().min(3, 'Titel muss mindestens 3 Zeichen lang sein'),
  description: z.string().optional(),
  strainName: z.string().min(2, 'Strain-Name erforderlich'),
  strainBreeder: z.string().optional(),
  strainType: z.enum(['SATIVA', 'INDICA', 'HYBRID', 'RUDERALIS']),
  growType: z.enum(['INDOOR', 'OUTDOOR', 'GREENHOUSE']),
  medium: z.enum(['SOIL', 'COCO', 'HYDRO', 'AERO', 'OTHER']),
  startDate: z.string().optional(),
  isPublic: z.boolean().default(true),
});

type CreateGrowFormData = z.infer<typeof createGrowSchema>;

export default function NewGrowPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGrowFormData>({
    resolver: zodResolver(createGrowSchema),
    defaultValues: {
      isPublic: true,
      startDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: CreateGrowFormData) => {
    setIsLoading(true);

    try {
      // TODO: API Call
      console.log('Creating grow:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Grow erfolgreich erstellt!');
      router.push('/journal');
    } catch (error: any) {
      console.error('Create grow error:', error);
      toast.error('Fehler beim Erstellen des Grows');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Neuen Grow starten</h1>
          <p className="text-muted-foreground">
            Dokumentiere deinen Grow von Anfang an
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Grundinformationen</CardTitle>
              <CardDescription>
                Allgemeine Informationen über deinen Grow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Titel *
                </label>
                <Input
                  id="title"
                  placeholder="z.B. Gorilla Glue #4 Indoor 2024"
                  {...register('title')}
                  disabled={isLoading}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Beschreibung
                </label>
                <Textarea
                  id="description"
                  placeholder="Beschreibe dein Setup, deine Ziele, etc..."
                  rows={4}
                  {...register('description')}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="startDate" className="text-sm font-medium">
                  Startdatum
                </label>
                <Input
                  id="startDate"
                  type="date"
                  {...register('startDate')}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Strain Info */}
          <Card>
            <CardHeader>
              <CardTitle>Strain-Informationen</CardTitle>
              <CardDescription>
                Details über die Genetik
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="strainName" className="text-sm font-medium">
                    Strain Name *
                  </label>
                  <Input
                    id="strainName"
                    placeholder="z.B. Gorilla Glue #4"
                    {...register('strainName')}
                    disabled={isLoading}
                  />
                  {errors.strainName && (
                    <p className="text-sm text-destructive">{errors.strainName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="strainBreeder" className="text-sm font-medium">
                    Breeder
                  </label>
                  <Input
                    id="strainBreeder"
                    placeholder="z.B. GG Strains"
                    {...register('strainBreeder')}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="strainType" className="text-sm font-medium">
                  Strain-Typ *
                </label>
                <select
                  id="strainType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  {...register('strainType')}
                  disabled={isLoading}
                >
                  <option value="SATIVA">Sativa</option>
                  <option value="INDICA">Indica</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="RUDERALIS">Ruderalis</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Growing Method */}
          <Card>
            <CardHeader>
              <CardTitle>Anbau-Methode</CardTitle>
              <CardDescription>
                Wie und wo wirst du anbauen?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="growType" className="text-sm font-medium">
                    Anbau-Art *
                  </label>
                  <select
                    id="growType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    {...register('growType')}
                    disabled={isLoading}
                  >
                    <option value="INDOOR">Indoor</option>
                    <option value="OUTDOOR">Outdoor</option>
                    <option value="GREENHOUSE">Greenhouse</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="medium" className="text-sm font-medium">
                    Medium *
                  </label>
                  <select
                    id="medium"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    {...register('medium')}
                    disabled={isLoading}
                  >
                    <option value="SOIL">Soil (Erde)</option>
                    <option value="COCO">Coco</option>
                    <option value="HYDRO">Hydro</option>
                    <option value="AERO">Aeroponics</option>
                    <option value="OTHER">Andere</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>Privatsphäre</CardTitle>
              <CardDescription>
                Wer darf deinen Grow sehen?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  className="h-4 w-4 rounded border-gray-300"
                  {...register('isPublic')}
                  disabled={isLoading}
                />
                <label
                  htmlFor="isPublic"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Öffentlich (Andere Nutzer können deinen Grow sehen)
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Abbrechen
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Erstelle...
                </>
              ) : (
                'Grow erstellen'
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
