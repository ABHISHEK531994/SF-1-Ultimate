import { Entry, IEntry } from '../models/Entry.model';
import { Grow } from '../models/Grow.model';
import { Photo } from '../models/Photo.model';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export class EntryService {
  async create(data: Partial<IEntry>): Promise<IEntry> {
    const grow = await Grow.findOne({ 
      _id: data.growId, 
      userId: data.userId 
    });
    
    if (!grow) {
      throw new AppError('GROW_NOT_FOUND', 404);
    }
    
    const entry = new Entry(data);
    await entry.save();
    
    logger.info(`[Entry] Created ${entry._id} for grow ${data.growId}`);
    
    return entry;
  }
  
  async getByGrow(growId: string, requestUserId?: string): Promise<IEntry[]> {
    const grow = await Grow.findById(growId);
    
    if (!grow) {
      throw new AppError('GROW_NOT_FOUND', 404);
    }
    
    if (!grow.isPublic && grow.userId !== requestUserId) {
      throw new AppError('FORBIDDEN', 403);
    }
    
    const entries = await Entry.find({ growId })
      .sort({ week: 1, day: 1 })
      .lean();
    
    const entryIds = entries.map(e => e._id.toString());
    const photos = await Photo.find({ 
      entryId: { $in: entryIds } 
    })
      .sort({ order: 1 })
      .lean();
    
    return entries.map(entry => ({
      ...entry,
      photos: photos.filter(p => p.entryId === entry._id.toString())
    })) as any;
  }
  
  async update(entryId: string, userId: string, data: Partial<IEntry>): Promise<IEntry | null> {
    const entry = await Entry.findOne({ _id: entryId, userId });
    
    if (!entry) {
      throw new AppError('NOT_FOUND', 404);
    }
    
    Object.assign(entry, data);
    await entry.save();
    
    return entry;
  }
  
  async delete(entryId: string, userId: string): Promise<void> {
    const entry = await Entry.findOne({ _id: entryId, userId });
    
    if (!entry) {
      throw new AppError('NOT_FOUND', 404);
    }
    
    const photos = await Photo.find({ entryId });
    
    await Entry.deleteOne({ _id: entryId });
    
    logger.info(`[Entry] Deleted ${entryId} with ${photos.length} photos`);
  }
}

export const entryService = new EntryService();
