import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ArrowLeft, 
  BookOpen, 
  HelpCircle, 
  ShoppingBag, 
  Settings,
  BarChart3,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminMemories, useAdminQuests, useAdminShop, useAdminStats } from '@/hooks/useAdminData';
import { soundManager } from '@/lib/sounds';
import { Memory, Quest, ShopItem } from '@/hooks/useGameData';

type AdminTab = 'memories' | 'quests' | 'shop' | 'settings' | 'stats';

const AdminPortal = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isModerator, loading: authLoading, signOut } = useAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>('memories');
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin && !isModerator) {
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

            <div className="np-card p-8 animate-fade-in text-center">
              <div className="w-16 h-16 bg-destructive/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">Access Denied</h1>
              <p className="text-muted-foreground mb-6">
                You don't have permission to access the Admin Portal. 
                Only administrators and moderators can access this area.
              </p>
              <button
                onClick={() => navigate('/')}
                className="np-button-primary"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const showSaveSuccess = (message: string) => {
    setSaveMessage(message);
    soundManager.playPurchase();
    setTimeout(() => setSaveMessage(''), 3000);
  };

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
                <p className="text-sm text-muted-foreground">Manage NP TimeWave - Changes sync automatically</p>
              </div>
            </div>

            <button
              onClick={signOut}
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
  const { memories, loading, updateMemoryStatus, toggleFeatured, deleteMemory, createMemory, refetch } = useAdminMemories();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMemory, setNewMemory] = useState({
    title: '',
    story: '',
    decade: '2020s',
    theme: '',
    role: '',
    image_url: null as string | null,
    anonymous: false,
    author_name: '',
    status: 'approved' as const,
    featured: false,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleCreate = async () => {
    if (!newMemory.title || !newMemory.story) return;
    
    await createMemory(newMemory);
    setShowCreateForm(false);
    setNewMemory({
      title: '',
      story: '',
      decade: '2020s',
      theme: '',
      role: '',
      image_url: null,
      anonymous: false,
      author_name: '',
      status: 'approved',
      featured: false,
    });
    onSave('Memory created successfully');
  };

  const handleStatusUpdate = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    await updateMemoryStatus(id, status);
    onSave(`Memory ${status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'set to pending'}`);
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    await toggleFeatured(id, !featured);
    onSave('Featured status updated');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this memory?')) {
      await deleteMemory(id);
      onSave('Memory deleted');
    }
  };

  if (loading) {
    return <div className="text-center py-12"><RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-foreground">Manage Memories</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Total: {memories.length} | Pending: {memories.filter(m => m.status === 'pending').length}
          </span>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="np-button-primary px-4 py-2 text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Memory
          </button>
        </div>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-card rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto border border-border">
            <h3 className="font-display text-xl font-bold text-foreground mb-4">Create New Memory</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newMemory.title}
                onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                placeholder="Title"
                className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground"
              />
              <textarea
                value={newMemory.story}
                onChange={(e) => setNewMemory({ ...newMemory, story: e.target.value })}
                placeholder="Story"
                rows={4}
                className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground resize-none"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newMemory.decade}
                  onChange={(e) => setNewMemory({ ...newMemory, decade: e.target.value })}
                  className="px-4 py-3 bg-secondary rounded-xl text-foreground"
                >
                  {['1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newMemory.theme}
                  onChange={(e) => setNewMemory({ ...newMemory, theme: e.target.value })}
                  placeholder="Theme"
                  className="px-4 py-3 bg-secondary rounded-xl text-foreground"
                />
              </div>
              <input
                type="text"
                value={newMemory.author_name}
                onChange={(e) => setNewMemory({ ...newMemory, author_name: e.target.value })}
                placeholder="Author Name"
                className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground"
              />
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newMemory.featured}
                    onChange={(e) => setNewMemory({ ...newMemory, featured: e.target.checked })}
                  />
                  <span className="text-sm text-foreground">Featured</span>
                </label>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowCreateForm(false)} className="flex-1 py-3 bg-secondary text-foreground rounded-xl">
                  Cancel
                </button>
                <button onClick={handleCreate} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium">
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {memories.map((memory) => (
          <div key={memory.id} className="np-card p-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-foreground">{memory.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    memory.status === 'approved' 
                      ? 'bg-success/20 text-success' 
                      : memory.status === 'rejected'
                      ? 'bg-destructive/20 text-destructive'
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
                  <span>{memory.anonymous ? 'Anonymous' : memory.author_name}</span>
                  <span>❤️ {memory.resonance_count}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleFeatured(memory.id, memory.featured)}
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
                  <>
                    <button
                      onClick={() => handleStatusUpdate(memory.id, 'approved')}
                      className="p-2 bg-success/20 text-success rounded-lg hover:bg-success/30 transition-colors"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(memory.id, 'rejected')}
                      className="p-2 bg-destructive/20 text-destructive rounded-lg hover:bg-destructive/30 transition-colors"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleStatusUpdate(memory.id, 'pending')}
                    className="p-2 bg-warning/20 text-warning rounded-lg hover:bg-warning/30 transition-colors"
                    title="Set to Pending"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(memory.id)}
                  className="p-2 bg-destructive/20 text-destructive rounded-lg hover:bg-destructive/30 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {memories.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No memories yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Quests Admin Section
const QuestsAdmin = ({ onSave }: { onSave: (msg: string) => void }) => {
  const { quests, loading, createQuest, updateQuest, deleteQuest, createQuestion, updateQuestion, deleteQuestion, refetch } = useAdminQuests();
  const [editingQuestion, setEditingQuestion] = useState<{ questId: string; questionId: string } | null>(null);
  const [showAddQuestion, setShowAddQuestion] = useState<string | null>(null);
  const [showAddQuest, setShowAddQuest] = useState(false);
  const [newQuest, setNewQuest] = useState({ category: '', icon: '📜' });
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    fun_fact: '',
    points: 100,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleCreateQuest = async () => {
    if (!newQuest.category) return;
    await createQuest(newQuest.category, newQuest.icon);
    setNewQuest({ category: '', icon: '📜' });
    setShowAddQuest(false);
    onSave('Quest created');
  };

  const handleDeleteQuest = async (id: string) => {
    if (confirm('Delete this quest and all its questions?')) {
      await deleteQuest(id);
      onSave('Quest deleted');
    }
  };

  const handleCreateQuestion = async (questId: string) => {
    if (!newQuestion.question || newQuestion.options.some(o => !o)) return;
    await createQuestion(questId, newQuestion);
    setNewQuestion({ question: '', options: ['', '', '', ''], correct_answer: 0, fun_fact: '', points: 100 });
    setShowAddQuestion(null);
    onSave('Question added');
  };

  const handleUpdateQuestion = async (id: string, updates: any) => {
    await updateQuestion(id, updates);
    setEditingQuestion(null);
    onSave('Question updated');
  };

  const handleDeleteQuestion = async (id: string) => {
    if (confirm('Delete this question?')) {
      await deleteQuestion(id);
      onSave('Question deleted');
    }
  };

  if (loading) {
    return <div className="text-center py-12"><RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-foreground">Manage Quests</h2>
        <button onClick={() => setShowAddQuest(true)} className="np-button-primary px-4 py-2 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Quest
        </button>
      </div>

      {/* Add Quest Modal */}
      {showAddQuest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full mx-4 border border-border">
            <h3 className="font-display text-xl font-bold mb-4">Create New Quest</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newQuest.category}
                onChange={(e) => setNewQuest({ ...newQuest, category: e.target.value })}
                placeholder="Quest Category Name"
                className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground"
              />
              <input
                type="text"
                value={newQuest.icon}
                onChange={(e) => setNewQuest({ ...newQuest, icon: e.target.value })}
                placeholder="Icon (emoji)"
                className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground"
              />
              <div className="flex gap-3">
                <button onClick={() => setShowAddQuest(false)} className="flex-1 py-3 bg-secondary rounded-xl">Cancel</button>
                <button onClick={handleCreateQuest} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {quests.map((quest) => (
        <div key={quest.id} className="np-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{quest.icon}</span>
              <h3 className="font-display text-lg font-bold text-foreground">{quest.category}</h3>
              <span className="text-sm text-muted-foreground">({quest.questions.length} questions)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddQuestion(quest.id)}
                className="p-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteQuest(quest.id)}
                className="p-2 bg-destructive/20 text-destructive rounded-lg hover:bg-destructive/30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add Question Form */}
          {showAddQuestion === quest.id && (
            <div className="mb-4 p-4 bg-secondary/50 rounded-xl space-y-3">
              <input
                type="text"
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                placeholder="Question"
                className="w-full px-4 py-2 bg-card rounded-lg text-foreground"
              />
              <div className="grid grid-cols-2 gap-2">
                {newQuestion.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={newQuestion.correct_answer === i}
                      onChange={() => setNewQuestion({ ...newQuestion, correct_answer: i })}
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const opts = [...newQuestion.options];
                        opts[i] = e.target.value;
                        setNewQuestion({ ...newQuestion, options: opts });
                      }}
                      placeholder={`Option ${i + 1}`}
                      className="flex-1 px-3 py-2 bg-card rounded-lg text-foreground text-sm"
                    />
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={newQuestion.fun_fact}
                onChange={(e) => setNewQuestion({ ...newQuestion, fun_fact: e.target.value })}
                placeholder="Fun Fact"
                className="w-full px-4 py-2 bg-card rounded-lg text-foreground"
              />
              <div className="flex gap-2">
                <button onClick={() => setShowAddQuestion(null)} className="flex-1 py-2 bg-card rounded-lg">Cancel</button>
                <button onClick={() => handleCreateQuestion(quest.id)} className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg">Add</button>
              </div>
            </div>
          )}

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
                            i === question.correct_answer 
                              ? 'bg-success/20 text-success' 
                              : 'bg-card text-muted-foreground'
                          }`}
                        >
                          {i === question.correct_answer && '✓ '}{opt}
                        </span>
                      ))}
                    </div>
                    {question.fun_fact && (
                      <p className="text-xs text-muted-foreground italic">
                        💡 {question.fun_fact}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingQuestion({ questId: quest.id, questionId: question.id })}
                      className="p-2 bg-card rounded-lg hover:bg-card/80"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="p-2 bg-destructive/20 text-destructive rounded-lg hover:bg-destructive/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
  const { items, loading, createItem, updateItem, deleteItem, refetch } = useAdminShop();
  const [editingItem, setEditingItem] = useState<ShopItem | null>(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', description: '', points: 100, image: '🎁' });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleCreate = async () => {
    if (!newItem.name) return;
    await createItem(newItem);
    setNewItem({ name: '', description: '', points: 100, image: '🎁' });
    setShowAddItem(false);
    onSave('Shop item created');
  };

  const handleUpdate = async () => {
    if (!editingItem) return;
    await updateItem(editingItem.id, editingItem);
    setEditingItem(null);
    onSave('Shop item updated');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this shop item?')) {
      await deleteItem(id);
      onSave('Shop item deleted');
    }
  };

  if (loading) {
    return <div className="text-center py-12"><RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-foreground">Manage Shop</h2>
        <button onClick={() => setShowAddItem(true)} className="np-button-primary px-4 py-2 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Add Item Modal */}
      {showAddItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full mx-4 border border-border">
            <h3 className="font-display text-xl font-bold mb-4">Add Shop Item</h3>
            <div className="space-y-4">
              <input
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Item name"
                className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground"
              />
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Description"
                className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground resize-none"
                rows={2}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={newItem.points}
                  onChange={(e) => setNewItem({ ...newItem, points: parseInt(e.target.value) || 0 })}
                  placeholder="Points"
                  className="px-4 py-3 bg-secondary rounded-xl text-foreground"
                />
                <input
                  value={newItem.image}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                  placeholder="Emoji"
                  className="px-4 py-3 bg-secondary rounded-xl text-foreground"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowAddItem(false)} className="flex-1 py-3 bg-secondary rounded-xl">Cancel</button>
                <button onClick={handleCreate} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium">Create</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="np-card p-5">
            {editingItem?.id === item.id ? (
              <div className="space-y-3">
                <input
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary rounded-lg text-foreground"
                />
                <textarea
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary rounded-lg text-foreground resize-none"
                  rows={2}
                />
                <input
                  type="number"
                  value={editingItem.points}
                  onChange={(e) => setEditingItem({ ...editingItem, points: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-secondary rounded-lg text-foreground"
                />
                <div className="flex gap-2">
                  <button onClick={handleUpdate} className="flex-1 py-2 bg-success text-white rounded-lg">Save</button>
                  <button onClick={() => setEditingItem(null)} className="flex-1 py-2 bg-secondary rounded-lg">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="text-4xl">{item.image}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{item.name}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                  <p className="text-primary font-bold mt-2">{item.points} points</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => setEditingItem(item)} className="p-2 bg-secondary rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-destructive/20 text-destructive rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
  const { stats, loading, refetch } = useAdminStats();

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading) {
    return <div className="text-center py-12"><RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" /></div>;
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
    { label: 'Total Memories', value: stats.totalMemories, icon: '📝' },
    { label: 'Pending Memories', value: stats.pendingMemories, icon: '⏳' },
    { label: 'Total Quests', value: stats.totalQuests, icon: '🎯' },
    { label: 'Total Questions', value: stats.totalQuestions, icon: '❓' },
    { label: 'Shop Items', value: stats.totalShopItems, icon: '🛒' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-foreground">Platform Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="np-card p-5 text-center">
            <div className="text-3xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Settings Admin Section
const SettingsAdmin = ({ onSave }: { onSave: (msg: string) => void }) => {
  const { signOut } = useAuth();

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="font-display text-xl font-bold text-foreground">Admin Settings</h2>
      
      <div className="np-card p-5">
        <h3 className="font-bold text-foreground mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button
            onClick={signOut}
            className="w-full py-3 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="np-card p-5 border-destructive/50">
        <h3 className="font-bold text-destructive mb-4">Information</h3>
        <p className="text-muted-foreground text-sm">
          All changes made in the admin portal are automatically synced with the database. 
          Users will see updates immediately on their end.
        </p>
      </div>
    </div>
  );
};

export default AdminPortal;
