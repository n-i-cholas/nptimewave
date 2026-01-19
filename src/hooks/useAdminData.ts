import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Memory, Quest, Question, ShopItem } from './useGameData';

export const useAdminMemories = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMemories = useCallback(async () => {
    setLoading(true);
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

  const updateMemoryStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('memories')
      .update({ status })
      .eq('id', id);

    if (!error) {
      await fetchMemories();
    }
    return { error };
  };

  const toggleFeatured = async (id: string, featured: boolean) => {
    const { error } = await supabase
      .from('memories')
      .update({ featured })
      .eq('id', id);

    if (!error) {
      await fetchMemories();
    }
    return { error };
  };

  const deleteMemory = async (id: string) => {
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', id);

    if (!error) {
      await fetchMemories();
    }
    return { error };
  };

  const createMemory = async (memory: Omit<Memory, 'id' | 'user_id' | 'resonance_count' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('memories')
      .insert({
        ...memory,
        resonance_count: 0,
      })
      .select()
      .single();

    if (!error) {
      await fetchMemories();
    }
    return { data, error };
  };

  return { 
    memories, 
    loading, 
    updateMemoryStatus, 
    toggleFeatured, 
    deleteMemory,
    createMemory,
    refetch: fetchMemories 
  };
};

export const useAdminQuests = () => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuests = useCallback(async () => {
    setLoading(true);
    const { data: questsData, error: questsError } = await supabase
      .from('quests')
      .select('*')
      .order('display_order');

    if (questsError) {
      console.error('Error fetching quests:', questsError);
      setLoading(false);
      return;
    }

    const { data: questionsData, error: questionsError } = await supabase
      .from('quest_questions')
      .select('*')
      .order('display_order');

    if (questionsError) {
      console.error('Error fetching questions:', questionsError);
      setLoading(false);
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

  const createQuest = async (category: string, icon: string) => {
    const { data, error } = await supabase
      .from('quests')
      .insert({ category, icon, display_order: quests.length })
      .select()
      .single();

    if (error) {
      console.error('Error creating quest:', error);
    } else {
      await fetchQuests();
    }
    return { data, error };
  };

  const updateQuest = async (id: string, updates: Partial<Quest>) => {
    const { error } = await supabase
      .from('quests')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating quest:', error);
    } else {
      await fetchQuests();
    }
    return { error };
  };

  const deleteQuest = async (id: string) => {
    const { error } = await supabase
      .from('quests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting quest:', error);
    } else {
      await fetchQuests();
    }
    return { error };
  };

  const createQuestion = async (questId: string, question: Omit<Question, 'id' | 'quest_id' | 'display_order'>) => {
    const quest = quests.find(q => q.id === questId);
    const displayOrder = quest ? quest.questions.length : 0;

    const { data, error } = await supabase
      .from('quest_questions')
      .insert({
        quest_id: questId,
        question: question.question,
        options: question.options,
        correct_answer: question.correct_answer,
        fun_fact: question.fun_fact,
        points: question.points,
        display_order: displayOrder,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating question:', error);
    } else {
      await fetchQuests();
    }
    return { data, error };
  };

  const updateQuestion = async (id: string, updates: Partial<Question>) => {
    const { error } = await supabase
      .from('quest_questions')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating question:', error);
    } else {
      await fetchQuests();
    }
    return { error };
  };

  const deleteQuestion = async (id: string) => {
    const { error } = await supabase
      .from('quest_questions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting question:', error);
    } else {
      await fetchQuests();
    }
    return { error };
  };

  return { 
    quests, 
    loading, 
    createQuest, 
    updateQuest, 
    deleteQuest,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    refetch: fetchQuests 
  };
};

export const useAdminShop = () => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('shop_items')
      .select('*')
      .order('points');

    if (error) {
      console.error('Error fetching shop items:', error);
    } else {
      setItems(data);
    }
    setLoading(false);
  }, []);

  const createItem = async (item: Omit<ShopItem, 'id' | 'active'>) => {
    const { data, error } = await supabase
      .from('shop_items')
      .insert({ ...item, active: true })
      .select()
      .single();

    if (error) {
      console.error('Error creating shop item:', error);
    } else {
      await fetchItems();
    }
    return { data, error };
  };

  const updateItem = async (id: string, updates: Partial<ShopItem>) => {
    const { error } = await supabase
      .from('shop_items')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating shop item:', error);
    } else {
      await fetchItems();
    }
    return { error };
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase
      .from('shop_items')
      .update({ active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting shop item:', error);
    } else {
      await fetchItems();
    }
    return { error };
  };

  return { 
    items, 
    loading, 
    createItem, 
    updateItem, 
    deleteItem,
    refetch: fetchItems 
  };
};

export const useAdminStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMemories: 0,
    pendingMemories: 0,
    totalQuests: 0,
    totalQuestions: 0,
    totalShopItems: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    const [
      { count: usersCount },
      { count: memoriesCount },
      { count: pendingCount },
      { count: questsCount },
      { count: questionsCount },
      { count: shopCount },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('memories').select('*', { count: 'exact', head: true }),
      supabase.from('memories').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('quests').select('*', { count: 'exact', head: true }),
      supabase.from('quest_questions').select('*', { count: 'exact', head: true }),
      supabase.from('shop_items').select('*', { count: 'exact', head: true }).eq('active', true),
    ]);

    setStats({
      totalUsers: usersCount || 0,
      totalMemories: memoriesCount || 0,
      pendingMemories: pendingCount || 0,
      totalQuests: questsCount || 0,
      totalQuestions: questionsCount || 0,
      totalShopItems: shopCount || 0,
    });
    setLoading(false);
  }, []);

  return { stats, loading, refetch: fetchStats };
};
