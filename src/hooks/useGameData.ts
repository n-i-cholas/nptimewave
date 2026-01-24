import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Quest {
  id: string;
  category: string;
  icon: string;
  display_order: number;
  questions: Question[];
}

export interface Question {
  id: string;
  quest_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  fun_fact: string | null;
  points: number;
  display_order: number;
}

export interface Memory {
  id: string;
  user_id: string | null;
  title: string;
  story: string;
  decade: string;
  theme: string | null;
  role: string | null;
  image_url: string | null;
  anonymous: boolean;
  author_name: string | null;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  resonance_count: number;
  created_at: string;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  points: number;
  image: string;
  active: boolean;
}

export interface WalletItem {
  id: string;
  user_id: string;
  shop_item_id: string | null;
  item_name: string;
  item_description: string;
  item_image: string;
  purchased_at: string;
  used: boolean;
}

export const useQuests = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuests = useCallback(async () => {
    const { data: questsData, error: questsError } = await supabase
      .from('quests')
      .select('*')
      .order('display_order');

    if (questsError) {
      console.error('Error fetching quests:', questsError);
      return;
    }

    const { data: questionsData, error: questionsError } = await supabase
      .from('quest_questions')
      .select('*')
      .order('display_order');

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
      return;
    }

    const questsWithQuestions = questsData.map(quest => ({
      ...quest,
      questions: questionsData
        .filter(q => q.quest_id === quest.id)
        .map(q => ({
          ...q,
          options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string)
        }))
    }));

    setQuests(questsWithQuestions);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  return { quests, loading, refetch: fetchQuests };
};

export const useMemories = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMemories = useCallback(async () => {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching memories:', error);
    } else {
      setMemories(data as Memory[]);
    }
    setLoading(false);
  }, []);

  const submitMemory = async (memory: Omit<Memory, 'id' | 'user_id' | 'status' | 'featured' | 'resonance_count' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('memories')
      .insert({
        ...memory,
        user_id: user?.id || null,
        status: 'pending',
        featured: false,
        resonance_count: 0,
      })
      .select()
      .single();

    if (!error) {
      await fetchMemories();
    }
    return { data, error };
  };

  const resonateWithMemory = async (memoryId: string) => {
    if (!user) return { error: new Error('Must be logged in') };

    const { error } = await supabase
      .from('memory_resonances')
      .insert({ user_id: user.id, memory_id: memoryId });

    if (!error) {
      await fetchMemories();
    }
    return { error };
  };

  const getUserResonances = async () => {
    if (!user) return [];
    
    const { data } = await supabase
      .from('memory_resonances')
      .select('memory_id')
      .eq('user_id', user.id);

    return data?.map(r => r.memory_id) || [];
  };

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  return { memories, loading, submitMemory, resonateWithMemory, getUserResonances, refetch: fetchMemories };
};

export const useShopItems = () => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from('shop_items')
      .select('*')
      .eq('active', true)
      .order('points');

    if (error) {
      console.error('Error fetching shop items:', error);
    } else {
      setItems(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, refetch: fetchItems };
};

export const useWallet = () => {
  const [items, setItems] = useState<WalletItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchItems = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('user_wallet_items')
      .select('*')
      .eq('user_id', user.id)
      .order('purchased_at', { ascending: false });

    if (error) {
      console.error('Error fetching wallet items:', error);
    } else {
      setItems(data);
    }
    setLoading(false);
  }, [user]);

  const purchaseItem = async (shopItem: ShopItem) => {
    if (!user) return { error: new Error('Must be logged in') };

    const { error } = await supabase
      .from('user_wallet_items')
      .insert({
        user_id: user.id,
        shop_item_id: shopItem.id,
        item_name: shopItem.name,
        item_description: shopItem.description,
        item_image: shopItem.image,
      });

    if (!error) {
      await fetchItems();
    }
    return { error };
  };

  const useItem = async (itemId: string) => {
    const { error } = await supabase
      .from('user_wallet_items')
      .update({ used: true })
      .eq('id', itemId);

    if (!error) {
      await fetchItems();
    }
    return { error };
  };

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, purchaseItem, useItem, refetch: fetchItems };
};

export const useUserProgress = () => {
  const { user, profile, updateProfile, refreshProfile } = useAuth();

  const addPoints = async (amount: number) => {
    if (!user) return;
    // Use RPC or direct increment to avoid stale state issues
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('total_points')
      .eq('user_id', user.id)
      .single();
    
    if (currentProfile) {
      await supabase
        .from('profiles')
        .update({ total_points: currentProfile.total_points + amount })
        .eq('user_id', user.id);
    }
  };

  const removePoints = async (amount: number) => {
    if (!user) return;
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('total_points')
      .eq('user_id', user.id)
      .single();
    
    if (currentProfile) {
      await supabase
        .from('profiles')
        .update({ total_points: Math.max(0, currentProfile.total_points - amount) })
        .eq('user_id', user.id);
    }
  };

  const loseLife = async () => {
    if (!profile || !user) return;
    const newLives = Math.max(0, profile.lives - 1);
    
    // If lives hit 0, set cooldown for 1 hour from now
    if (newLives === 0) {
      const resetAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      const { error } = await supabase
        .from('profiles')
        .update({ lives: newLives, lives_reset_at: resetAt })
        .eq('user_id', user.id);
      
      if (!error) {
        await refreshProfile();
      }
    } else {
      await updateProfile({ lives: newLives });
    }
  };

  const resetLives = async () => {
    if (!profile || !user) return;
    
    // Check if cooldown has passed
    if (profile.lives === 0 && profile.lives_reset_at) {
      const resetTime = new Date(profile.lives_reset_at);
      if (new Date() >= resetTime) {
        const { error } = await supabase
          .from('profiles')
          .update({ lives: profile.max_lives, lives_reset_at: null })
          .eq('user_id', user.id);
        
        if (!error) {
          await refreshProfile();
        }
      }
    } else if (profile.lives < profile.max_lives) {
      const { error } = await supabase
        .from('profiles')
        .update({ lives: profile.max_lives, lives_reset_at: null })
        .eq('user_id', user.id);
      
      if (!error) {
        await refreshProfile();
      }
    }
  };
  
  // Auto-check for lives reset on profile load
  const checkAndResetLives = async () => {
    if (!profile || !user) return;
    
    if (profile.lives === 0 && profile.lives_reset_at) {
      const resetTime = new Date(profile.lives_reset_at);
      if (new Date() >= resetTime) {
        await supabase
          .from('profiles')
          .update({ lives: profile.max_lives, lives_reset_at: null })
          .eq('user_id', user.id);
        await refreshProfile();
      }
    }
  };

  const updateStreak = async () => {
    if (!profile) return;
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (profile.last_played_date === today) return;
    
    let newStreak = 1;
    if (profile.last_played_date === yesterday) {
      newStreak = profile.streak + 1;
    }
    
    await updateProfile({ 
      streak: newStreak, 
      last_played_date: today 
    });
  };

  const recordCorrectAnswer = async () => {
    if (!profile) return;
    await updateProfile({ total_correct_answers: profile.total_correct_answers + 1 });
  };

  const completeQuest = async (questId: string) => {
    if (!user || !profile) return;
    
    await supabase
      .from('completed_quests')
      .insert({ user_id: user.id, quest_id: questId })
      .select();
    
    await updateProfile({ total_quests_completed: profile.total_quests_completed + 1 });
  };

  const getCompletedQuests = async () => {
    if (!user) return [];
    
    const { data } = await supabase
      .from('completed_quests')
      .select('quest_id')
      .eq('user_id', user.id);

    return data?.map(c => c.quest_id) || [];
  };

  return {
    profile,
    addPoints,
    removePoints,
    loseLife,
    resetLives,
    checkAndResetLives,
    updateStreak,
    recordCorrectAnswer,
    completeQuest,
    getCompletedQuests,
    refreshProfile,
  };
};

export const useAchievements = () => {
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const { user } = useAuth();

  const fetchAchievements = useCallback(async () => {
    if (!user) {
      setUnlockedAchievements([]);
      return;
    }

    const { data, error } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', user.id);

    if (!error && data) {
      setUnlockedAchievements(data.map(a => a.achievement_id));
    }
  }, [user]);

  const unlockAchievement = async (achievementId: string) => {
    if (!user) return;
    
    if (unlockedAchievements.includes(achievementId)) return;

    const { error } = await supabase
      .from('user_achievements')
      .insert({ user_id: user.id, achievement_id: achievementId });

    if (!error) {
      setUnlockedAchievements(prev => [...prev, achievementId]);
      setNewAchievements(prev => [...prev, achievementId]);
    }
  };

  const clearNewAchievements = () => {
    setNewAchievements([]);
  };

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  return { 
    unlockedAchievements, 
    newAchievements, 
    unlockAchievement, 
    clearNewAchievements,
    refetch: fetchAchievements 
  };
};
