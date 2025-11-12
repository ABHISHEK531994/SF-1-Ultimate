export interface Thread {
  id: string;
  categoryId: string;
  userId: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
    level?: number;
  };
  title: string;
  content: string;
  isPinned: boolean;
  isLocked: boolean;
  tags: string[];
  stats: {
    views: number;
    replies: number;
    votes: number;
    score: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Reply {
  id: string;
  threadId: string;
  userId: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
    level?: number;
  };
  parentReplyId?: string;
  content: string;
  isAccepted: boolean;
  stats: {
    votes: number;
    score: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  color?: string;
  order: number;
  stats: {
    threads: number;
    replies: number;
  };
}

export interface Vote {
  type: 'UPVOTE' | 'DOWNVOTE';
  hasVoted: boolean;
}
