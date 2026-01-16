import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, User, Mail, Trophy, Flame, Target, Heart, Coins, LogOut, Save } from 'lucide-react';
import { toast } from 'sonner';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, profile, signOut, updateProfile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [saving, setSaving] = useState(false);

  if (!user || !profile) {
    navigate('/auth');
    return null;
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ display_name: displayName });
      await refreshProfile();
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const stats = [
    { label: 'Total Points', value: profile.total_points.toLocaleString(), icon: Coins, color: 'text-np-gold' },
    { label: 'Current Streak', value: `${profile.streak} days`, icon: Flame, color: 'text-orange-500' },
    { label: 'Quests Completed', value: profile.total_quests_completed, icon: Trophy, color: 'text-primary' },
    { label: 'Correct Answers', value: profile.total_correct_answers, icon: Target, color: 'text-success' },
    { label: 'Lives', value: `${profile.lives}/${profile.max_lives}`, icon: Heart, color: 'text-destructive' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="py-8 animate-fade-in">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-all border border-border"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="font-display text-3xl font-bold text-foreground">My Profile</h1>
          </div>

          {/* Profile Card */}
          <div className="np-card p-6 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-xl font-bold text-foreground">
                  {profile.display_name || 'Explorer'}
                </h2>
                <p className="text-muted-foreground text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                  className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground border border-border focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving || displayName === profile.display_name}
                className="w-full np-button-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-8">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Your Stats</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="np-card p-4 text-center">
                    <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                    <p className="font-bold text-foreground text-xl">{stat.value}</p>
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Account Info */}
          <div className="np-card p-6 mb-8">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">Account</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="text-foreground">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last played</span>
                <span className="text-foreground">
                  {profile.last_played_date 
                    ? new Date(profile.last_played_date).toLocaleDateString()
                    : 'Never'}
                </span>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-destructive/10 text-destructive rounded-xl font-medium hover:bg-destructive/20 transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
