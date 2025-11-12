export interface UserProfile {
  userId: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  title?: string;
  badges: Badge[];
  achievements: Achievement[];
  stats: {
    totalGrows: number;
    totalPosts: number;
    totalComments: number;
    helpfulVotes: number;
    daysActive: number;
  };
  streak: {
    current: number;
    longest: number;
  };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  unlockedAt?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  progress: number;
  target: number;
  completed: boolean;
  reward: {
    xp: number;
    badge?: string;
  };
  completedAt?: string;
}

export interface Leaderboard {
  period: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME';
  category: 'XP' | 'GROWS' | 'HELPFUL' | 'POSTS';
  entries: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar?: string;
  level: number;
  score: number;
  change?: number;
}
