// /apps/media-service/src/utils/mime-types.ts

export const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml'
];

export const VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo'
];

export const DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const AUDIO_MIME_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/ogg'
];

/**
 * MIME-Type zu Kategorie
 */
export function getMimeTypeCategory(mimeType: string): 'image' | 'video' | 'document' | 'audio' | 'other' {
  if (IMAGE_MIME_TYPES.includes(mimeType)) return 'image';
  if (VIDEO_MIME_TYPES.includes(mimeType)) return 'video';
  if (DOCUMENT_MIME_TYPES.includes(mimeType)) return 'document';
  if (AUDIO_MIME_TYPES.includes(mimeType)) return 'audio';
  return 'other';
}

/**
 * Ist Bild?
 */
export function isImageMimeType(mimeType: string): boolean {
  return IMAGE_MIME_TYPES.includes(mimeType);
}

/**
 * Ist Video?
 */
export function isVideoMimeType(mimeType: string): boolean {
  return VIDEO_MIME_TYPES.includes(mimeType);
}

/**
 * Ist Dokument?
 */
export function isDocumentMimeType(mimeType: string): boolean {
  return DOCUMENT_MIME_TYPES.includes(mimeType);
}

/**
 * Extension zu MIME-Type
 */
export function extensionToMimeType(ext: string): string | null {
  const map: { [key: string]: string } = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    mp4: 'video/mp4',
    webm: 'video/webm',
    pdf: 'application/pdf'
  };
  
  return map[ext.toLowerCase()] || null;
}

/**
 * MIME-Type zu Extension
 */
export function mimeTypeToExtension(mimeType: string): string {
  const map: { [key: string]: string } = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'application/pdf': 'pdf'
  };
  
  return map[mimeType] || 'bin';
}
