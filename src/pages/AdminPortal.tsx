import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ArrowLeft, 
  BookOpen, 
  HelpCircle, 
  ShoppingBag, 
  Image, 
  Settings,
  Users,
  BarChart3,
  Save,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Eye,
  EyeOff
} from 'lucide-react';
import { useGameStore, quests, shopItems, Memory, Quest, Question, ShopItem, memoryThemes, memoryRoles } from '@/store/gameStore';
import { soundManager } from '@/lib/sounds';

type AdminTab = 'memories' | 'quests' | 'shop' | 'settings' | 'stats';

const AdminPortal = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentTab, setCurrentTab] = useState<AdminTab>('memories');
  const [saveMessage, setSaveMessage] = useState('');

  // Store hooks
  const { 
    memories, 
    points,
    lives,
    streak,
    totalCorrectAnswers,
    totalQuestsCompleted,
    unlockedAchievements,
  } = useGameStore();

  // Simple admin authentication (in production, use proper auth)
  const handleLogin = () => {
    if (adminPassword === 'admin123') {
      setIsAuthenticated(true);
      soundManager.playClick();
    } else {
      alert('Invalid password. Try: admin123');
    }
  };

  const showSaveSuccess = (message: string) => {
    setSaveMessage(message);
    soundManager.playPurchase();
    setTimeout(() => setSaveMessage(''), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 pb-12 bg-background">
        <div className="container mx-auto px-4 max-w-md">
          <div className="py-12">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>

            <div className="np-card p-8 animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h1 className="font-display text-2xl font-bold text-foreground mb-2">Admin Portal</h1>
                <p className="text-muted-foreground">Enter your admin password to continue</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    placeholder="Admin Password"
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                <button
                  onClick={handleLogin}
                  className="w-full np-button-primary py-3"
                >
                  Login to Admin
                </button>

                <p className="text-center text-sm text-muted-foreground">
                  Demo password: <code className="bg-secondary px-2 py-0.5 rounded">admin123</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'memories', label: 'Memories', icon: BookOpen },
    { key: 'quests', label: 'Quests', icon: HelpCircle },
    { key: 'shop', label: 'Shop', icon: ShoppingBag },
    { key: 'stats', label: 'Stats', icon: BarChart3 },
    { key: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen pt-20 pb-12 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="py-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary" />
                  Admin Portal
                </h1>
                <p className="text-sm text-muted-foreground">Manage all aspects of NP TimeWave</p>
              </div>
            </div>

            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-secondary text-foreground rounded-xl hover:bg-secondary/80 transition-colors text-sm"
            >
              Logout
            </button>
          </div>

          {/* Save Message */}
          {saveMessage && (
            <div className="mb-4 p-3 bg-success/20 border border-success/30 rounded-xl text-success font-medium flex items-center gap-2 animate-fade-in">
              <Check className="w-5 h-5" />
              {saveMessage}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setCurrentTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                    currentTab === tab.key
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {currentTab === 'memories' && <MemoriesAdmin onSave={showSaveSuccess} />}
          {currentTab === 'quests' && <QuestsAdmin onSave={showSaveSuccess} />}
          {currentTab === 'shop' && <ShopAdmin onSave={showSaveSuccess} />}
          {currentTab === 'stats' && <StatsAdmin />}
          {currentTab === 'settings' && <SettingsAdmin onSave={showSaveSuccess} />}
        </div>
      </div>
    </div>
  );
};

// Memories Admin Section
const MemoriesAdmin = ({ onSave }: { onSave: (msg: string) => void }) => {
  const memories = useGameStore((state) => state.memories);
  const [localMemories, setLocalMemories] = useState(memories);

  const updateMemoryStatus = (id: string, status: 'pending' | 'approved') => {
    const updated = localMemories.map(m => m.id === id ? { ...m, status } : m);
    setLocalMemories(updated);
    useGameStore.setState({ memories: updated });
    onSave(`Memory ${status === 'approved' ? 'approved' : 'set to pending'}`);
  };

  const toggleFeatured = (id: string) => {
    const updated = localMemories.map(m => 
      m.id === id ? { ...m, featured: !m.featured } : m
    );
    setLocalMemories(updated);
    useGameStore.setState({ memories: updated });
    onSave('Featured status updated');
  };

  const deleteMemory = (id: string) => {
    if (confirm('Are you sure you want to delete this memory?')) {
      const updated = localMemories.filter(m => m.id !== id);
      setLocalMemories(updated);
      useGameStore.setState({ memories: updated });
      onSave('Memory deleted');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-foreground">Manage Memories</h2>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Total: {localMemories.length}</span>
          <span>Pending: {localMemories.filter(m => m.status === 'pending').length}</span>
        </div>
      </div>

      <div className="space-y-3">
        {localMemories.map((memory) => (
          <div key={memory.id} className="np-card p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-foreground">{memory.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    memory.status === 'approved' 
                      ? 'bg-success/20 text-success' 
                      : 'bg-warning/20 text-warning'
                  }`}>
                    {memory.status}
                  </span>
                  {memory.featured && (
                    <span className="px-2 py-0.5 bg-np-gold/20 text-np-gold rounded-full text-xs font-medium">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-2">{memory.story}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{memory.decade}</span>
                  <span>{memory.theme}</span>
                  <span>{memory.anonymous ? 'Anonymous' : memory.authorName}</span>
                  <span>❤️ {memory.resonanceCount}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFeatured(memory.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    memory.featured 
                      ? 'bg-np-gold/20 text-np-gold' 
                      : 'bg-secondary text-muted-foreground hover:text-foreground'
                  }`}
                  title="Toggle Featured"
                >
                  ⭐
                </button>
                {memory.status === 'pending' ? (
                  <button
                    onClick={() => updateMemoryStatus(memory.id, 'approved')}
                    className="p-2 bg-success/20 text-success rounded-lg hover:bg-success/30 transition-colors"
                    title="Approve"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => updateMemoryStatus(memory.id, 'pending')}
                    className="p-2 bg-warning/20 text-warning rounded-lg hover:bg-warning/30 transition-colors"
                    title="Unapprove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteMemory(memory.id)}
                  className="p-2 bg-destructive/20 text-destructive rounded-lg hover:bg-destructive/30 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Quests Admin Section
const QuestsAdmin = ({ onSave }: { onSave: (msg: string) => void }) => {
  const [localQuests, setLocalQuests] = useState<Quest[]>(quests);
  const [editingQuest, setEditingQuest] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<{ questId: string; questionId: string } | null>(null);

  const updateQuestionPoints = (questId: string, questionId: string, funFact: string) => {
    const updated = localQuests.map(q => 
      q.id === questId 
        ? { 
            ...q, 
            questions: q.questions.map(question => 
              question.id === questionId 
                ? { ...question, funFact } 
                : question
            ) 
          } 
        : q
    );
    setLocalQuests(updated);
    setEditingQuestion(null);
    onSave('Question updated');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-foreground">Manage Quests</h2>
        <span className="text-sm text-muted-foreground">{localQuests.length} categories</span>
      </div>

      {localQuests.map((quest) => (
        <div key={quest.id} className="np-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{quest.icon}</span>
            <h3 className="font-display text-lg font-bold text-foreground">{quest.category}</h3>
            <span className="text-sm text-muted-foreground">({quest.questions.length} questions)</span>
          </div>

          <div className="space-y-3">
            {quest.questions.map((question, qIndex) => (
              <div key={question.id} className="bg-secondary/50 rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-foreground mb-2">
                      Q{qIndex + 1}: {question.question}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {question.options.map((opt, i) => (
                        <span 
                          key={i} 
                          className={`text-sm px-2 py-1 rounded ${
                            i === question.correctAnswer 
                              ? 'bg-success/20 text-success' 
                              : 'bg-card text-muted-foreground'
                          }`}
                        >
                          {i === question.correctAnswer && '✓ '}{opt}
                        </span>
                      ))}
                    </div>
                    {question.funFact && (
                      <p className="text-xs text-muted-foreground italic">
                        💡 {question.funFact}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setEditingQuestion({ questId: quest.id, questionId: question.id })}
                    className="p-2 bg-card rounded-lg hover:bg-card/80 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Shop Admin Section
const ShopAdmin = ({ onSave }: { onSave: (msg: string) => void }) => {
  const [localItems, setLocalItems] = useState<ShopItem[]>(shopItems);
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);

  const updateItem = (id: string, updates: Partial<ShopItem>) => {
    setLocalItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    setEditingItem(null);
    onSave('Shop item updated');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-foreground">Manage Shop</h2>
        <button className="np-button-primary px-4 py-2 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {localItems.map((item) => (
          <div key={item.id} className="np-card p-5">
            {editingItem?.id === item.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary rounded-lg text-foreground"
                  placeholder="Item name"
                />
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary rounded-lg text-foreground resize-none"
                  rows={2}
                  placeholder="Description"
                />
                <input
                  type="number"
                  value={editingItem.points}
                  onChange={(e) => setEditingItem({ ...editingItem, points: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-secondary rounded-lg text-foreground"
                  placeholder="Points cost"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => updateItem(item.id, editingItem)}
                    className="flex-1 py-2 bg-success text-white rounded-lg font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingItem(null)}
                    className="flex-1 py-2 bg-secondary text-foreground rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-np-cyan/20 rounded-xl flex items-center justify-center text-3xl">
                  {item.image}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  <p className="text-primary font-bold">{item.points} pts</p>
                </div>
                <button
                  onClick={() => setEditingItem(item)}
                  className="p-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Stats Admin Section
const StatsAdmin = () => {
  const { 
    points, 
    lives, 
    streak, 
    totalCorrectAnswers, 
    totalQuestsCompleted,
    unlockedAchievements,
    memories,
    wallet,
  } = useGameStore();

  const stats = [
    { label: 'Total Points', value: points.toLocaleString(), icon: '💰' },
    { label: 'Current Lives', value: `${lives}/3`, icon: '❤️' },
    { label: 'Current Streak', value: `${streak} days`, icon: '🔥' },
    { label: 'Correct Answers', value: totalCorrectAnswers, icon: '✅' },
    { label: 'Quests Completed', value: totalQuestsCompleted, icon: '📜' },
    { label: 'Achievements Unlocked', value: unlockedAchievements.length, icon: '🏆' },
    { label: 'Total Memories', value: memories.length, icon: '📝' },
    { label: 'Pending Memories', value: memories.filter(m => m.status === 'pending').length, icon: '⏳' },
    { label: 'Items in Wallet', value: wallet.length, icon: '👛' },
  ];

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-foreground mb-6">Application Statistics</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="np-card p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Settings Admin Section
const SettingsAdmin = ({ onSave }: { onSave: (msg: string) => void }) => {
  const { resetLives } = useGameStore();
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleResetLives = () => {
    resetLives();
    onSave('Lives reset to 3');
  };

  const handleAddPoints = () => {
    useGameStore.getState().addPoints(500);
    onSave('Added 500 points');
  };

  const handleResetProgress = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      localStorage.removeItem('np-timewave-storage');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="font-display text-xl font-bold text-foreground mb-6">Settings</h2>
      
      <div className="space-y-4">
        <div className="np-card p-5">
          <h3 className="font-bold text-foreground mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleResetLives}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:scale-105 transition-transform"
            >
              Reset Lives
            </button>
            <button
              onClick={handleAddPoints}
              className="px-4 py-2 bg-success text-white rounded-lg font-medium hover:scale-105 transition-transform"
            >
              Add 500 Points
            </button>
          </div>
        </div>

        <div className="np-card p-5">
          <h3 className="font-bold text-foreground mb-3">Sound Effects</h3>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => {
                setSoundEnabled(e.target.checked);
                soundManager.setEnabled(e.target.checked);
              }}
              className="w-5 h-5 rounded"
            />
            <span className="text-foreground">Enable sound effects</span>
          </label>
        </div>

        <div className="np-card p-5 border-destructive/30">
          <h3 className="font-bold text-destructive mb-3">Danger Zone</h3>
          <button
            onClick={handleResetProgress}
            className="px-4 py-2 bg-destructive text-white rounded-lg font-medium hover:bg-destructive/90 transition-colors"
          >
            Reset All Progress
          </button>
          <p className="text-sm text-muted-foreground mt-2">
            This will clear all saved data and cannot be undone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
