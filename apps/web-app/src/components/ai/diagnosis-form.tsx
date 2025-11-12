'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DiagnosisFormProps {
  onDiagnose: (data: { images?: File[]; description?: string }) => void;
  onQuickDiagnose: (description: string) => void;
  isLoading: boolean;
}

export function DiagnosisForm({ onDiagnose, onQuickDiagnose, isLoading }: DiagnosisFormProps) {
  const [images, setImages] = useState<File[]>([]);
  const [description, setDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );
    if (files.length > 0) {
      setImages((prev) => [...prev, ...files].slice(0, 5)); // Max 5 images
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter((file) =>
        file.type.startsWith('image/')
      );
      setImages((prev) => [...prev, ...files].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (images.length === 0 && !description.trim()) return;
    onDiagnose({
      images: images.length > 0 ? images : undefined,
      description: description.trim() || undefined,
    });
  };

  const handleQuickSubmit = () => {
    if (!description.trim()) return;
    onQuickDiagnose(description);
  };

  return (
    <div className="space-y-6">
      {/* Image Upload */}
      <div className="neo-deep rounded-2xl p-8">
        <h3 className="font-black text-white mb-4 flex items-center gap-2 text-xl">
          <span className="text-2xl">📸</span>
          Bilder hochladen (Optional)
        </h3>

        {images.length === 0 ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'upload-zone rounded-2xl p-16 text-center cursor-pointer transition',
              dragActive && 'border-emerald-500 bg-emerald-500/10'
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="mb-6">
              <div className="inline-block icon-emboss p-8 rounded-xl">
                <Upload className="w-16 h-16 text-gray-900" />
              </div>
            </div>
            <h4 className="text-2xl font-black text-white mb-3">Fotos hochladen</h4>
            <p className="text-xl text-emerald-200 mb-5 font-medium">
              Klicken oder Drag & Drop
            </p>
            <p className="text-lg text-white/60 font-medium">
              PNG, JPG bis 10MB • Max. 5 Bilder
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative neo-deep rounded-xl p-2 group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="neo-deep rounded-xl p-2 h-48 flex flex-col items-center justify-center hover:scale-105 transition"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Upload className="w-12 h-12 text-emerald-400 mb-2" />
                  <span className="text-sm text-white font-medium">Weitere hinzufügen</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="neo-deep rounded-2xl p-8">
        <h3 className="font-black text-white mb-4 flex items-center gap-2 text-xl">
          <span className="text-2xl">📝</span>
          Beschreibung (Optional)
        </h3>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Beschreibe das Problem: z.B. 'gelbe Blätter an unteren Zweigen', 'braune Flecken auf Blättern'..."
          className="w-full input-inset rounded-xl px-6 py-5 text-white text-lg placeholder-white/50 font-medium focus:outline-none min-h-[150px] resize-none"
          disabled={isLoading}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={handleSubmit}
          disabled={isLoading || (images.length === 0 && !description.trim())}
          className={cn(
            'flex-1 bubble-soft px-10 py-6 rounded-xl font-black text-white text-xl transition',
            (isLoading || (images.length === 0 && !description.trim())) &&
              'opacity-50 cursor-not-allowed'
          )}
        >
          🔬 Vollständige Diagnose
        </button>

        {images.length === 0 && description.trim() && (
          <button
            onClick={handleQuickSubmit}
            disabled={isLoading}
            className="neo-deep px-10 py-6 rounded-xl font-bold text-white text-lg hover:scale-105 transition flex items-center gap-2"
          >
            <Zap className="w-5 h-5" />
            Schnell-Diagnose
          </button>
        )}
      </div>
    </div>
  );
}
