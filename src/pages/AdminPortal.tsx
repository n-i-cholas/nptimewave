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
  Check,
  X,
  RefreshCw,
  Lock,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminMemories, useAdminQuests, useAdminShop, useAdminStats, useAdminUsers } from '@/hooks/useAdminData';
import { soundManager } from '@/lib/sounds';

type AdminTab = 'memories' | 'quests' | 'shop' | 'settings' | 'stats' | 'users';

const ADMIN_PASSWORD = 'admin123';

const AdminPortal = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isModerator, loading: authLoading, signOut } = useAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>('memories');
  const [saveMessage, setSaveMessage] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Check local storage for admin session
  useEffect(() => {
    const adminSession = sessionStorage.getItem('np-admin-authenticated');
    if (adminSession === 'true' || isAdmin || isModerator) {
      setIsAuthenticated(true);
    }
  }, [isAdmin, isModerator]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('np-admin-authenticated', 'true');
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Show password gate if not authenticated via role or password
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

            <div className="np-card p-8 animate-fade-in text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">Admin Portal</h1>
              <p className="text-muted-foreground mb-6">
                Enter the admin password to access the management portal.
              </p>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground border border-border focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {passwordError && (
                  <p className="text-destructive text-sm">{passwordError}</p>
                )}
                <button type="submit" className="w-full np-button-primary">
                  Access Admin Portal
                </button>
              </form>
              
              <p className="text-xs text-muted-foreground mt-4">
                Default password: admin123
              </p>
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

  const handleLogout = () => {
    sessionStorage.removeItem('np-admin-authenticated');
    setIsAuthenticated(false);
    if (user) {
      signOut();
    }
  };

  const tabs = [
    { key: 'memories', label: 'Memories', icon: BookOpen },
    { key: 'quests', label: 'Quests', icon: HelpCircle },
    { key: 'shop', label: 'Shop', icon: ShoppingBag },
    { key: 'users', label: 'Users', icon: Users },
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
                className="p-2 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors border border-border"
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
              onClick={handleLogout}
              className="px-4 py-2 bg-secondary text-foreground rounded-xl hover:bg-secondary/80 transition-colors text-sm border border-border"
            >
              Logout
            </button>
          </div>

          {/* Save Message */}
          {saveMessage && (
            <div className="mb-4 p-3 bg-success/10 border border-success/30 rounded-xl text-success font-medium flex items-center gap-2 animate-fade-in">
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
                      : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border'
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
          {currentTab === 'users' && <UsersAdmin onSave={showSaveSuccess} />}
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
                className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground border border-border"
              />
              <textarea
                value={newMemory.story}
                onChange={(e) => setNewMemory({ ...newMemory, story: e.target.value })}
                placeholder="Story"
                rows={4}
                className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground resize-none border border-border"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newMemory.decade}
                  onChange={(e) => setNewMemory({ ...newMemory, decade: e.target.value })}
                  className="px-4 py-3 bg-secondary rounded-xl text-foreground border border-border"
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
                  className="px-4 py-3 bg-secondary rounded-xl text-foreground border border-border"
                />
              </div>
              <input
                type="text"
                value={newMemory.author_name}
                onChange={(e) => setNewMemory({ ...newMemory, author_name: e.target.value })}
                placeholder="Author Name"
                className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground border border-border"
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
                <button onClick={() => setShowCreateForm(false)} className="flex-1 py-3 bg-secondary text-foreground rounded-xl border border-border">
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
                      ? 'bg-success/10 text-success' 
                      : memory.status === 'rejected'
                      ? 'bg-destructive/10 text-destructive'
                      : 'bg-warning/10 text-warning'
                  }`}>
                    {memory.status}
                  </span>
                  {memory.featured && (
                    <span className="px-2 py-0.5 bg-np-gold/10 text-np-gold rounded-full text-xs font-medium">
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
                      ? 'bg-np-gold/10 text-np-gold' 
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
                      className="p-2 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(memory.id, 'rejected')}
                      className="p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
                      title="Reject"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleStatusUpdate(memory.id, 'pending')}
                    className="p-2 bg-warning/10 text-warning rounded-lg hover:bg-warning/20 transition-colors"
                    title="Set to Pending"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(memory.id)}
                  className="p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
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
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-foreground">Manage Quests</h2>
        <button onClick={() => setShowAddQuest(true)} className="np-button-primary px-4 py-2 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Quest
        </button>
      </div>

      {/* Add Quest Modal */}
      {showAddQuest && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full mx-4 border border-border">
            <h3 className="font-display text-xl font-bold text-foreground mb-4">Add New Quest</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newQuest.category}
                onChange={(e) => setNewQuest({ ...newQuest, category: e.target.value })}
                placeholder="Quest Category (e.g., NP's History)"
                className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground border border-border"
              />
              <input
                type="text"
                value={newQuest.icon}
                onChange={(e) => setNewQuest({ ...newQuest, icon: e.target.value })}
                placeholder="Icon emoji"
                className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground border border-border"
              />
              <div className="flex gap-3">
                <button onClick={() => setShowAddQuest(false)} className="flex-1 py-3 bg-secondary text-foreground rounded-xl border border-border">
                  Cancel
                </button>
                <button onClick={handleCreateQuest} className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium">
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {quests.map((quest) => (
        <div key={quest.id} className="np-card p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{quest.icon}</span>
              <h3 className="font-display text-lg font-bold text-foreground">{quest.category}</h3>
              <span className="text-sm text-muted-foreground">({quest.questions.length} questions)</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddQuestion(quest.id)}
                className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20"
              >
                + Add Question
              </button>
              <button
                onClick={() => handleDeleteQuest(quest.id)}
                className="p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add Question Form */}
          {showAddQuestion === quest.id && (
            <div className="mb-4 p-4 bg-secondary/50 rounded-xl border border-border">
              <h4 className="font-bold text-foreground mb-3">Add New Question</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  placeholder="Question text"
                  className="w-full px-4 py-2 bg-card rounded-xl text-foreground border border-border"
                />
                {newQuestion.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={newQuestion.correct_answer === i}
                      onChange={() => setNewQuestion({ ...newQuestion, correct_answer: i })}
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...newQuestion.options];
                        newOpts[i] = e.target.value;
                        setNewQuestion({ ...newQuestion, options: newOpts });
                      }}
                      placeholder={`Option ${i + 1}`}
                      className="flex-1 px-4 py-2 bg-card rounded-xl text-foreground border border-border"
                    />
                  </div>
                ))}
                <input
                  type="text"
                  value={newQuestion.fun_fact}
                  onChange={(e) => setNewQuestion({ ...newQuestion, fun_fact: e.target.value })}
                  placeholder="Fun fact (optional)"
                  className="w-full px-4 py-2 bg-card rounded-xl text-foreground border border-border"
                />
                <div className="flex gap-2">
                  <button onClick={() => setShowAddQuestion(null)} className="px-4 py-2 bg-secondary text-foreground rounded-xl border border-border">
                    Cancel
                  </button>
                  <button onClick={() => handleCreateQuestion(quest.id)} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl">
                    Add Question
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Questions List */}
          <div className="space-y-2">
            {quest.questions.map((question, idx) => (
              <QuestionItem
                key={question.id}
                question={question}
                index={idx}
                isEditing={editingQuestion?.questionId === question.id}
                onEdit={() => setEditingQuestion({ questId: quest.id, questionId: question.id })}
                onSave={(updates) => handleUpdateQuestion(question.id, updates)}
                onCancel={() => setEditingQuestion(null)}
                onDelete={() => handleDeleteQuestion(question.id)}
              />
            ))}
          </div>
        </div>
      ))}

      {quests.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No quests yet. Create one to get started!</p>
        </div>
      )}
    </div>
  );
};

// Question Item Component
const QuestionItem = ({ question, index, isEditing, onEdit, onSave, onCancel, onDelete }: any) => {
  const [editData, setEditData] = useState({
    question: question.question,
    options: [...question.options],
    correct_answer: question.correct_answer,
    fun_fact: question.fun_fact || '',
  });

  if (isEditing) {
    return (
      <div className="p-3 bg-secondary/50 rounded-xl border border-border">
        <input
          type="text"
          value={editData.question}
          onChange={(e) => setEditData({ ...editData, question: e.target.value })}
          className="w-full px-3 py-2 bg-card rounded-lg text-foreground border border-border mb-2"
        />
        {editData.options.map((opt: string, i: number) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input
              type="radio"
              checked={editData.correct_answer === i}
              onChange={() => setEditData({ ...editData, correct_answer: i })}
            />
            <input
              type="text"
              value={opt}
              onChange={(e) => {
                const newOpts = [...editData.options];
                newOpts[i] = e.target.value;
                setEditData({ ...editData, options: newOpts });
              }}
              className="flex-1 px-3 py-2 bg-card rounded-lg text-foreground border border-border"
            />
          </div>
        ))}
        <input
          type="text"
          value={editData.fun_fact}
          onChange={(e) => setEditData({ ...editData, fun_fact: e.target.value })}
          placeholder="Fun fact"
          className="w-full px-3 py-2 bg-card rounded-lg text-foreground border border-border mb-2"
        />
        <div className="flex gap-2">
          <button onClick={onCancel} className="px-3 py-1.5 bg-secondary text-foreground rounded-lg text-sm border border-border">
            Cancel
          </button>
          <button onClick={() => onSave(editData)} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm">
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 bg-secondary/30 rounded-xl flex items-center gap-3 border border-border/50">
      <span className="text-muted-foreground text-sm font-medium">{index + 1}.</span>
      <p className="flex-1 text-foreground text-sm">{question.question}</p>
      <button onClick={onEdit} className="p-1.5 text-muted-foreground hover:text-foreground">
        ✏️
      </button>
      <button onClick={onDelete} className="p-1.5 text-destructive hover:text-destructive/80">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

// Shop Admin Section
const ShopAdmin = ({ onSave }: { onSave: (msg: string) => void }) => {
  const { items, loading, createItem, updateItem, deleteItem, refetch } = useAdminShop();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    points: 100,
    image: '🎁',
    active: true,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleCreate = async () => {
    if (!newItem.name) return;
    await createItem(newItem);
    setNewItem({ name: '', description: '', points: 100, image: '🎁', active: true });
    setShowAddForm(false);
    onSave('Shop item created');
  };

  const handleUpdate = async (id: string, updates: any) => {
    await updateItem(id, updates);
    setEditingId(null);
    onSave('Shop item updated');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this item?')) {
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
        <button onClick={() => setShowAddForm(true)} className="np-button-primary px-4 py-2 text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full mx-4 border border-border">
            <h3 className="font-display text-xl font-bold text-foreground mb-4">Add Shop Item</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Item Name"
                className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground border border-border"
              />
              <textarea
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Description"
                className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground resize-none border border-border"
                rows={2}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={newItem.points}
                  onChange={(e) => setNewItem({ ...newItem, points: parseInt(e.target.value) || 0 })}
                  placeholder="Points"
                  className="px-4 py-3 bg-secondary rounded-xl text-foreground border border-border"
                />
                <input
                  type="text"
                  value={newItem.image}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                  placeholder="Emoji"
                  className="px-4 py-3 bg-secondary rounded-xl text-foreground border border-border"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowAddForm(false)} className="flex-1 py-3 bg-secondary text-foreground rounded-xl border border-border">
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
        {items.map((item) => (
          <ShopItemRow
            key={item.id}
            item={item}
            isEditing={editingId === item.id}
            onEdit={() => setEditingId(item.id)}
            onSave={(updates) => handleUpdate(item.id, updates)}
            onCancel={() => setEditingId(null)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}

        {items.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No shop items yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Shop Item Row Component
const ShopItemRow = ({ item, isEditing, onEdit, onSave, onCancel, onDelete }: any) => {
  const [editData, setEditData] = useState({
    name: item.name,
    description: item.description,
    points: item.points,
    image: item.image,
    active: item.active,
  });

  if (isEditing) {
    return (
      <div className="np-card p-4 border border-border">
        <div className="space-y-3">
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="w-full px-3 py-2 bg-secondary rounded-xl text-foreground border border-border"
          />
          <textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="w-full px-3 py-2 bg-secondary rounded-xl text-foreground resize-none border border-border"
            rows={2}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              value={editData.points}
              onChange={(e) => setEditData({ ...editData, points: parseInt(e.target.value) || 0 })}
              className="px-3 py-2 bg-secondary rounded-xl text-foreground border border-border"
            />
            <input
              type="text"
              value={editData.image}
              onChange={(e) => setEditData({ ...editData, image: e.target.value })}
              className="px-3 py-2 bg-secondary rounded-xl text-foreground border border-border"
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={editData.active}
              onChange={(e) => setEditData({ ...editData, active: e.target.checked })}
            />
            <span className="text-sm text-foreground">Active</span>
          </label>
          <div className="flex gap-2">
            <button onClick={onCancel} className="px-4 py-2 bg-secondary text-foreground rounded-xl border border-border">
              Cancel
            </button>
            <button onClick={() => onSave(editData)} className="px-4 py-2 bg-primary text-primary-foreground rounded-xl">
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`np-card p-4 flex items-center gap-4 ${!item.active ? 'opacity-50' : ''}`}>
      <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">
        {item.image}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-foreground">{item.name}</h3>
        <p className="text-muted-foreground text-sm">{item.description}</p>
      </div>
      <div className="text-right">
        <span className="text-primary font-bold">{item.points} pts</span>
        {!item.active && <p className="text-xs text-muted-foreground">Inactive</p>}
      </div>
      <button onClick={onEdit} className="p-2 text-muted-foreground hover:text-foreground">
        ✏️
      </button>
      <button onClick={onDelete} className="p-2 text-destructive hover:text-destructive/80">
        <Trash2 className="w-4 h-4" />
      </button>
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

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-foreground">Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="np-card p-6 text-center">
          <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
          <p className="text-muted-foreground">Total Users</p>
        </div>
        <div className="np-card p-6 text-center">
          <p className="text-3xl font-bold text-success">{stats.totalMemories}</p>
          <p className="text-muted-foreground">Total Memories</p>
        </div>
        <div className="np-card p-6 text-center">
          <p className="text-3xl font-bold text-warning">{stats.pendingMemories}</p>
          <p className="text-muted-foreground">Pending Memories</p>
        </div>
        <div className="np-card p-6 text-center">
          <p className="text-3xl font-bold text-np-gold">{stats.totalQuests}</p>
          <p className="text-muted-foreground">Total Quests</p>
        </div>
      </div>
    </div>
  );
};

// Users Admin Section
const UsersAdmin = ({ onSave }: { onSave: (msg: string) => void }) => {
  const { users, loading, updateUserRole, refetch } = useAdminUsers();
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'moderator' | 'user') => {
    await updateUserRole(userId, newRole);
    setEditingUserId(null);
    onSave(`User role updated to ${newRole}`);
  };

  if (loading) {
    return <div className="text-center py-12"><RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-foreground">Manage Users</h2>
        <span className="text-sm text-muted-foreground">
          Total: {users.length}
        </span>
      </div>

      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="np-card p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground">{user.display_name || 'Unnamed User'}</h3>
                <p className="text-muted-foreground text-sm">ID: {user.id.slice(0, 8)}...</p>
                <p className="text-xs text-muted-foreground">
                  Joined: {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {editingUserId === user.id ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRoleChange(user.id, 'user')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        user.role === 'user' 
                          ? 'bg-secondary text-foreground' 
                          : 'bg-secondary/50 text-muted-foreground hover:bg-secondary'
                      }`}
                    >
                      User
                    </button>
                    <button
                      onClick={() => handleRoleChange(user.id, 'moderator')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        user.role === 'moderator' 
                          ? 'bg-warning/20 text-warning' 
                          : 'bg-secondary/50 text-muted-foreground hover:bg-warning/20 hover:text-warning'
                      }`}
                    >
                      Moderator
                    </button>
                    <button
                      onClick={() => handleRoleChange(user.id, 'admin')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        user.role === 'admin' 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-secondary/50 text-muted-foreground hover:bg-primary/20 hover:text-primary'
                      }`}
                    >
                      Admin
                    </button>
                    <button
                      onClick={() => setEditingUserId(null)}
                      className="p-1.5 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      user.role === 'admin' 
                        ? 'bg-primary/20 text-primary' 
                        : user.role === 'moderator'
                        ? 'bg-warning/20 text-warning'
                        : 'bg-secondary text-muted-foreground'
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                    <button
                      onClick={() => setEditingUserId(user.id)}
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                      title="Edit Role"
                    >
                      ✏️
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Settings Admin Section
const SettingsAdmin = ({ onSave }: { onSave: (msg: string) => void }) => {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-foreground">Settings</h2>
      
      <div className="np-card p-6">
        <h3 className="font-bold text-foreground mb-4">General Settings</h3>
        <p className="text-muted-foreground text-sm">
          Settings are managed automatically. All changes in the admin portal sync to the main site in real-time.
        </p>
      </div>

      <div className="np-card p-6">
        <h3 className="font-bold text-foreground mb-4">Admin Access</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Current password: <code className="bg-secondary px-2 py-1 rounded">admin123</code>
        </p>
        <p className="text-xs text-muted-foreground">
          To change the admin password, contact the system administrator.
        </p>
      </div>
    </div>
  );
};

export default AdminPortal;
