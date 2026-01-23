import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Crown, TrendingUp, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type LeaderboardEntry = {
  user_id: string;
  display_name: string;
  total_points: number;
  total_quests_completed: number;
  streak: number;
  rank: number;
};

const Leaderboard = () => {
  const { user, profile } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, total_points, total_quests_completed, streak')
        .order('total_points', { ascending: false })
        .limit(10);

      if (error) throw error;

      const ranked = (data || []).map((entry, index) => ({
        user_id: entry.id,
        display_name: entry.display_name || 'Anonymous Explorer',
        total_points: entry.total_points || 0,
        total_quests_completed: entry.total_quests_completed || 0,
        streak: entry.streak || 0,
        rank: index + 1,
      }));

      setEntries(ranked);

      // Find current user's rank
      if (user) {
        const userIndex = ranked.findIndex(e => e.user_id === user.id);
        if (userIndex !== -1) {
          setUserRank(userIndex + 1);
        } else {
          // User not in top 10, fetch their actual rank
          const { count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .gt('total_points', profile?.total_points || 0);
          
          setUserRank((count || 0) + 1);
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-primary" />;
      case 2:
        return <Medal className="w-6 h-6 text-muted-foreground" />;
      case 3:
        return <Award className="w-6 h-6 text-accent-foreground" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-muted-foreground font-bold">{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-primary/30 to-primary/10 border-primary/40';
      case 2:
        return 'bg-gradient-to-r from-muted to-muted/50 border-muted-foreground/30';
      case 3:
        return 'bg-gradient-to-r from-accent/30 to-accent/10 border-accent/40';
      default:
        return 'bg-card border-border';
    }
  };

  if (loading) {
    return (
      <div className="np-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-primary" />
          <h2 className="font-display text-xl font-bold">Leaderboard</h2>
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted animate-pulse rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="np-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">Leaderboard</h2>
            <p className="text-sm text-muted-foreground">Top Explorers</p>
          </div>
        </div>
        {userRank && (
          <div className="flex items-center gap-2 text-sm bg-primary/10 px-3 py-1.5 rounded-full">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-primary font-medium">Your Rank: #{userRank}</span>
          </div>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No players yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.user_id}
              className={`flex items-center gap-4 p-3 rounded-xl border transition-all hover:scale-[1.01] ${getRankStyle(entry.rank)} ${
                entry.user_id === user?.id ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className="flex-shrink-0">
                {getRankIcon(entry.rank)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">
                  {entry.display_name}
                  {entry.user_id === user?.id && (
                    <span className="ml-2 text-xs text-primary">(You)</span>
                  )}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{entry.total_quests_completed} quests</span>
                  {entry.streak > 0 && (
                    <span className="flex items-center gap-1">
                      🔥 {entry.streak} streak
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-primary text-lg">{entry.total_points.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
