'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VotingProps {
  score: number;
  hasVoted?: 'UPVOTE' | 'DOWNVOTE' | null;
  onVote: (type: 'UPVOTE' | 'DOWNVOTE') => Promise<void>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Voting({ score, hasVoted, onVote, size = 'md', className }: VotingProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [currentVote, setCurrentVote] = useState(hasVoted);
  const [currentScore, setCurrentScore] = useState(score);

  const handleVote = async (type: 'UPVOTE' | 'DOWNVOTE') => {
    if (isVoting) return;

    setIsVoting(true);

    // Optimistic UI update
    const oldVote = currentVote;
    const oldScore = currentScore;

    let newScore = currentScore;
    let newVote: 'UPVOTE' | 'DOWNVOTE' | null = type;

    // Calculate new score based on previous vote
    if (oldVote === type) {
      // Remove vote
      newVote = null;
      newScore = type === 'UPVOTE' ? currentScore - 1 : currentScore + 1;
    } else if (oldVote) {
      // Change vote
      newScore = type === 'UPVOTE' ? currentScore + 2 : currentScore - 2;
    } else {
      // New vote
      newScore = type === 'UPVOTE' ? currentScore + 1 : currentScore - 1;
    }

    setCurrentVote(newVote);
    setCurrentScore(newScore);

    try {
      await onVote(type);
    } catch (error) {
      // Revert on error
      setCurrentVote(oldVote);
      setCurrentScore(oldScore);
      console.error('Vote error:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const sizeClasses = {
    sm: { button: 'h-7 w-7', icon: 'h-3 w-3', text: 'text-sm' },
    md: { button: 'h-8 w-8', icon: 'h-4 w-4', text: 'text-sm' },
    lg: { button: 'h-10 w-10', icon: 'h-5 w-5', text: 'text-lg' },
  };

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          sizeClasses[size].button,
          currentVote === 'UPVOTE' && 'text-primary bg-primary/10'
        )}
        onClick={() => handleVote('UPVOTE')}
        disabled={isVoting}
      >
        <ArrowUp className={sizeClasses[size].icon} />
      </Button>

      <span
        className={cn(
          'font-semibold',
          sizeClasses[size].text,
          currentScore > 0 && 'text-primary',
          currentScore < 0 && 'text-destructive'
        )}
      >
        {currentScore}
      </span>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          sizeClasses[size].button,
          currentVote === 'DOWNVOTE' && 'text-destructive bg-destructive/10'
        )}
        onClick={() => handleVote('DOWNVOTE')}
        disabled={isVoting}
      >
        <ArrowDown className={sizeClasses[size].icon} />
      </Button>
    </div>
  );
}
