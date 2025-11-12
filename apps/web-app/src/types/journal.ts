export interface Grow {
  id: string;
  userId: string;
  title: string;
  description?: string;
  strain: {
    name: string;
    breeder?: string;
    type?: 'SATIVA' | 'INDICA' | 'HYBRID' | 'RUDERALIS';
  };
  growType: 'INDOOR' | 'OUTDOOR' | 'GREENHOUSE';
  medium: 'SOIL' | 'COCO' | 'HYDRO' | 'AERO' | 'OTHER';
  status: 'PLANNING' | 'GERMINATION' | 'SEEDLING' | 'VEGETATIVE' | 'FLOWERING' | 'DRYING' | 'CURING' | 'HARVESTED' | 'ABANDONED';
  isPublic: boolean;
  startDate?: string;
  harvestDate?: string;
  stats: {
    totalEntries: number;
    totalPhotos: number;
    totalComments: number;
    totalReactions: number;
    followers: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Entry {
  id: string;
  growId: string;
  userId: string;
  title: string;
  content: string;
  day: number;
  week: number;
  stage: string;
  measurements?: {
    height?: number;
    ph?: number;
    ec?: number;
    temperature?: number;
    humidity?: number;
  };
  photos: string[];
  tags: string[];
  stats: {
    comments: number;
    reactions: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GrowComment {
  id: string;
  userId: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface GrowReaction {
  type: 'LIKE' | 'LOVE' | 'FIRE' | 'CURIOUS';
  count: number;
  hasReacted: boolean;
}
