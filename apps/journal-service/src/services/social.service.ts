import { Reaction } from '../models/Reaction.model';
import { Comment, IComment } from '../models/Comment.model';
import { Grow } from '../models/Grow.model';
import { redis } from '../config/redis';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

export class SocialService {
  async toggleReaction(data: {
    userId: string;
    growId: string;
    type: string;
  }): Promise<any> {
    const grow = await Grow.findById(data.growId);
    
    if (!grow) {
      throw new AppError('GROW_NOT_FOUND', 404);
    }
    
    const existing = await Reaction.findOne({
      userId: data.userId,
      growId: data.growId
    });
    
    if (existing) {
      if (existing.type === data.type) {
        await Reaction.deleteOne({ _id: existing._id });
        await Grow.updateOne(
          { _id: data.growId },
          { $inc: { likeCount: -1 } }
        );
        return { removed: true };
      } else {
        existing.type = data.type as any;
        await existing.save();
        return existing;
      }
    }
    
    const reaction = new Reaction(data);
    await reaction.save();
    
    await Grow.updateOne(
      { _id: data.growId },
      { $inc: { likeCount: 1 } }
    );
    
    return reaction;
  }
  
  async removeReaction(userId: string, growId: string): Promise<void> {
    const deleted = await Reaction.deleteOne({ userId, growId });
    
    if (deleted.deletedCount > 0) {
      await Grow.updateOne(
        { _id: growId },
        { $inc: { likeCount: -1 } }
      );
    }
  }
  
  async getReactions(growId: string, requestUserId?: string): Promise<any> {
    const counts = await Reaction.aggregate([
      { $match: { growId } },
      { $group: { 
        _id: '$type', 
        count: { $sum: 1 } 
      }}
    ]);
    
    const result: any = {
      fire: 0,
      frosty: 0,
      jealous: 0,
      helpful: 0,
      impressive: 0
    };
    
    counts.forEach(c => {
      result[c._id] = c.count;
    });
    
    if (requestUserId) {
      const userReaction = await Reaction.findOne({
        userId: requestUserId,
        growId
      });
      result.userReaction = userReaction?.type || null;
    }
    
    return result;
  }
  
  async addComment(data: {
    userId: string;
    growId: string;
    content: string;
    parentId?: string;
  }): Promise<IComment> {
    const grow = await Grow.findById(data.growId);
    
    if (!grow) {
      throw new AppError('GROW_NOT_FOUND', 404);
    }
    
    const comment = new Comment(data);
    await comment.save();
    
    await Grow.updateOne(
      { _id: data.growId },
      { $inc: { commentCount: 1 } }
    );
    
    logger.info(`[Social] Comment ${comment._id} on grow ${data.growId}`);
    
    return comment;
  }
  
  async getComments(growId: string, options: {
    limit?: number;
    skip?: number;
  } = {}): Promise<{ comments: IComment[]; total: number }> {
    const limit = Math.min(options.limit || 50, 200);
    const skip = options.skip || 0;
    
    const [comments, total] = await Promise.all([
      Comment.find({ 
        growId, 
        isDeleted: false,
        parentId: { $exists: false }
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Comment.countDocuments({ growId, isDeleted: false })
    ]);
    
    const commentIds = comments.map(c => c._id.toString());
    const replies = await Comment.find({
      parentId: { $in: commentIds },
      isDeleted: false
    })
      .sort({ createdAt: 1 })
      .lean();
    
    const commentsWithReplies = comments.map(comment => ({
      ...comment,
      replies: replies.filter(r => r.parentId === comment._id.toString())
    }));
    
    return { comments: commentsWithReplies as any, total };
  }
  
  async updateComment(commentId: string, userId: string, content: string): Promise<IComment | null> {
    const comment = await Comment.findOne({ _id: commentId, userId });
    
    if (!comment) {
      throw new AppError('NOT_FOUND', 404);
    }
    
    comment.content = content;
    comment.isEdited = true;
    await comment.save();
    
    return comment;
  }
  
  async deleteComment(commentId: string, userId: string): Promise<void> {
    const comment = await Comment.findOne({ _id: commentId, userId });
    
    if (!comment) {
      throw new AppError('NOT_FOUND', 404);
    }
    
    comment.isDeleted = true;
    comment.deletedAt = new Date();
    comment.content = '[deleted]';
    await comment.save();
    
    await Grow.updateOne(
      { _id: comment.growId },
      { $inc: { commentCount: -1 } }
    );
  }
  
  async toggleCommentLike(commentId: string, userId: string): Promise<void> {
    const cacheKey = `comment:like:${commentId}:${userId}`;
    
    const existing = await redis.get(cacheKey);
    
    if (existing) {
      await redis.del(cacheKey);
      await Comment.updateOne(
        { _id: commentId },
        { $inc: { likeCount: -1 } }
      );
    } else {
      await redis.set(cacheKey, '1');
      await Comment.updateOne(
        { _id: commentId },
        { $inc: { likeCount: 1 } }
      );
    }
  }
}

export const socialService = new SocialService();
