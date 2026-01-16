import { Trophy, Medal, Crown, TrendingUp, User } from 'lucide-react';

// Mock leaderboard data
const mockLeaderboardData = [
  { rank: 1, name: 'Sarah L.', points: 4850, avatar: '👩‍🎓', streak: 12, badge: 'Campus Expert' },
  { rank: 2, name: 'Marcus C.', points: 4200, avatar: '👨‍💻', streak: 8, badge: 'History Explorer' },
  { rank: 3, name: 'Emily T.', points: 3950, avatar: '👩‍🔬', streak: 15, badge: 'Quiz Champion' },
  { rank: 4, name: 'Jason W.', points: 3600, avatar: '👨‍🎨', streak: 5, badge: 'Streak Master' },
  { rank: 5, name: 'Amanda K.', points: 3400, avatar: '👩‍💼', streak: 7, badge: 'Memory Keeper' },
  { rank: 6, name: 'David L.', points: 3100, avatar: '👨‍🏫', streak: 4, badge: '' },
  { rank: 7, name: 'Michelle P.', points: 2850, avatar: '👩‍🎤', streak: 3, badge: '' },
  { rank: 8, name: 'Kevin N.', points: 2600, avatar: '👨‍🔧', streak: 6, badge: '' },
  { rank: 9, name: 'Jennifer H.', points: 2400, avatar: '👩‍⚕️', streak: 2, badge: '' },
  { rank: 10, name: 'Alex M.', points: 2200, avatar: '🧑‍🎓', streak: 1, badge: '' },
];

interface LeaderboardProps {
  currentUserPoints?: number;
  compact?: boolean;
}

const Leaderboard = ({ currentUserPoints = 500, compact = false }: LeaderboardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center font-bold text-muted-foreground">{rank}</span>;
    }
  };

  const getRankBackground = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border-yellow-500/30';
      case 2:
        return 'bg-gradient-to-r from-gray-400/20 to-gray-300/10 border-gray-400/30';
      case 3:
        return 'bg-gradient-to-r from-amber-600/20 to-orange-500/10 border-amber-600/30';
      default:
        return 'bg-card border-border';
    }
  };

  // Calculate user's estimated rank
  const userRank = mockLeaderboardData.findIndex(u => currentUserPoints >= u.points);
  const displayRank = userRank === -1 ? mockLeaderboardData.length + 1 : userRank + 1;

  const displayData = compact ? mockLeaderboardData.slice(0, 5) : mockLeaderboardData;

  return (
    <div className="np-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-np-gold/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-np-gold" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-foreground">Weekly Leaderboard</h3>
            <p className="text-sm text-muted-foreground">Resets every Sunday</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="w-4 h-4" />
          <span>Live</span>
        </div>
      </div>

      {/* Your Position */}
      <div className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Your Position</p>
            <p className="font-bold text-foreground">
              Rank #{displayRank} • {currentUserPoints.toLocaleString()} pts
            </p>
          </div>
          {displayRank <= 10 && (
            <span className="px-2 py-1 bg-success/20 text-success text-xs font-bold rounded-full">
              Top 10!
            </span>
          )}
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {displayData.map((user, index) => (
          <div
            key={user.rank}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 hover:scale-[1.01] ${getRankBackground(user.rank)}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Rank */}
            <div className="w-8 flex justify-center">
              {getRankIcon(user.rank)}
            </div>

            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl">
              {user.avatar}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-foreground truncate">{user.name}</p>
                {user.badge && (
                  <span className="hidden sm:inline px-2 py-0.5 bg-np-gold/20 text-np-gold text-xs font-medium rounded-full">
                    {user.badge}
                  </span>
                )}
              </div>
              {user.streak > 0 && (
                <p className="text-xs text-muted-foreground">
                  🔥 {user.streak} day streak
                </p>
              )}
            </div>

            {/* Points */}
            <div className="text-right">
              <p className="font-bold text-foreground">{user.points.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">points</p>
            </div>
          </div>
        ))}
      </div>

      {compact && (
        <div className="mt-4 text-center">
          <button className="text-primary text-sm font-medium hover:underline">
            View Full Leaderboard
          </button>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
