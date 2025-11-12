import sharp from 'sharp';
import { nanoid } from 'nanoid';
import { Photo, IPhoto } from '../models/Photo.model';
import { Entry } from '../models/Entry.model';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export class PhotoService {
  async upload(data: {
    entryId: string;
    userId: string;
    file: Express.Multer.File;
    caption?: string;
    order?: number;
  }): Promise<IPhoto> {
    const entry = await Entry.findOne({ _id: data.entryId, userId: data.userId });
    
    if (!entry) {
      throw new AppError('ENTRY_NOT_FOUND', 404);
    }
    
    if (!ALLOWED_TYPES.includes(data.file.mimetype)) {
      throw new AppError('INVALID_FILE_TYPE', 400);
    }
    
    if (data.file.size > MAX_FILE_SIZE) {
      throw new AppError('FILE_TOO_LARGE', 400);
    }
    
    const fileId = nanoid(16);
    
    try {
      const processedImage = await sharp(data.file.buffer)
        .rotate()
        .resize(2048, 2048, { 
          fit: 'inside',
          withoutEnlargement: true
        })
        .withMetadata(false)
        .jpeg({ quality: 90 })
        .toBuffer();
      
      const thumbnail = await sharp(data.file.buffer)
        .resize(300, 300, { fit: 'cover' })
        .withMetadata(false)
        .jpeg({ quality: 80 })
        .toBuffer();
      
      const medium = await sharp(data.file.buffer)
        .resize(800, 800, { fit: 'inside' })
        .withMetadata(false)
        .jpeg({ quality: 85 })
        .toBuffer();
      
      const metadata = await sharp(data.file.buffer).metadata();
      
      const photo = new Photo({
        entryId: data.entryId,
        growId: entry.growId,
        userId: data.userId,
        filename: `${fileId}.jpg`,
        originalFilename: data.file.originalname,
        mimeType: 'image/jpeg',
        size: processedImage.length,
        url: `https://cdn.example.com/${fileId}.jpg`,
        thumbnailUrl: `https://cdn.example.com/${fileId}_thumb.jpg`,
        mediumUrl: `https://cdn.example.com/${fileId}_medium.jpg`,
        width: metadata.width || 0,
        height: metadata.height || 0,
        takenAt: metadata.exif?.DateTimeOriginal ? new Date(metadata.exif.DateTimeOriginal) : undefined,
        caption: data.caption,
        order: data.order || 0
      });
      
      await photo.save();
      
      await Entry.updateOne(
        { _id: data.entryId },
        { $inc: { photoCount: 1 } }
      );
      
      logger.info(`[Photo] Uploaded ${photo._id} for entry ${data.entryId}`);
      
      return photo;
      
    } catch (error) {
      logger.error('[Photo] Upload failed:', error);
      throw new AppError('UPLOAD_FAILED', 500);
    }
  }
  
  async delete(photoId: string, userId: string): Promise<void> {
    const photo = await Photo.findOne({ _id: photoId, userId });
    
    if (!photo) {
      throw new AppError('NOT_FOUND', 404);
    }
    
    try {
      await Photo.deleteOne({ _id: photoId });
      
      await Entry.updateOne(
        { _id: photo.entryId },
        { $inc: { photoCount: -1 } }
      );
      
      logger.info(`[Photo] Deleted ${photoId}`);
      
    } catch (error) {
      logger.error('[Photo] Delete failed:', error);
      throw new AppError('DELETE_FAILED', 500);
    }
  }
}

export const photoService = new PhotoService();
