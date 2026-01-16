-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  total_points INTEGER NOT NULL DEFAULT 0,
  lives INTEGER NOT NULL DEFAULT 3,
  max_lives INTEGER NOT NULL DEFAULT 3,
  streak INTEGER NOT NULL DEFAULT 0,
  last_played_date DATE,
  total_correct_answers INTEGER NOT NULL DEFAULT 0,
  total_quests_completed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create memories table
CREATE TABLE public.memories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  decade TEXT NOT NULL,
  theme TEXT,
  role TEXT,
  image_url TEXT,
  anonymous BOOLEAN NOT NULL DEFAULT false,
  author_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  featured BOOLEAN NOT NULL DEFAULT false,
  resonance_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quests table
CREATE TABLE public.quests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT '📜',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quest_questions table
CREATE TABLE public.quest_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id UUID NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  correct_answer INTEGER NOT NULL DEFAULT 0,
  fun_fact TEXT,
  points INTEGER NOT NULL DEFAULT 100,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create shop_items table
CREATE TABLE public.shop_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  points INTEGER NOT NULL,
  image TEXT NOT NULL DEFAULT '🎁',
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_achievements table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create user_wallet_items table
CREATE TABLE public.user_wallet_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  shop_item_id UUID REFERENCES public.shop_items(id) ON DELETE SET NULL,
  item_name TEXT NOT NULL,
  item_description TEXT NOT NULL,
  item_image TEXT NOT NULL,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  used BOOLEAN NOT NULL DEFAULT false
);

-- Create completed_quests table
CREATE TABLE public.completed_quests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quest_id UUID REFERENCES public.quests(id) ON DELETE SET NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, quest_id)
);

-- Create memory_resonances table (for tracking likes)
CREATE TABLE public.memory_resonances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  memory_id UUID NOT NULL REFERENCES public.memories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, memory_id)
);

-- Create helper function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = 'admin'
  )
$$;

-- Create helper function to check if current user is moderator
CREATE OR REPLACE FUNCTION public.is_moderator()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'moderator')
  )
$$;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email));
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_memories_updated_at BEFORE UPDATE ON public.memories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_quests_updated_at BEFORE UPDATE ON public.quests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_quest_questions_updated_at BEFORE UPDATE ON public.quest_questions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_shop_items_updated_at BEFORE UPDATE ON public.shop_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wallet_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_resonances ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- USER_ROLES POLICIES
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Only admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Only admins can update roles" ON public.user_roles FOR UPDATE USING (public.is_admin());
CREATE POLICY "Only admins can delete roles" ON public.user_roles FOR DELETE USING (public.is_admin());

-- MEMORIES POLICIES
CREATE POLICY "Approved memories are viewable by everyone" ON public.memories FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR public.is_moderator());
CREATE POLICY "Authenticated users can submit memories" ON public.memories FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own pending memories" ON public.memories FOR UPDATE USING (auth.uid() = user_id OR public.is_moderator());
CREATE POLICY "Only moderators can delete memories" ON public.memories FOR DELETE USING (public.is_moderator());

-- QUESTS POLICIES (Public read, admin write)
CREATE POLICY "Quests are viewable by everyone" ON public.quests FOR SELECT USING (true);
CREATE POLICY "Only admins can insert quests" ON public.quests FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Only admins can update quests" ON public.quests FOR UPDATE USING (public.is_admin());
CREATE POLICY "Only admins can delete quests" ON public.quests FOR DELETE USING (public.is_admin());

-- QUEST_QUESTIONS POLICIES
CREATE POLICY "Questions are viewable by everyone" ON public.quest_questions FOR SELECT USING (true);
CREATE POLICY "Only admins can insert questions" ON public.quest_questions FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Only admins can update questions" ON public.quest_questions FOR UPDATE USING (public.is_admin());
CREATE POLICY "Only admins can delete questions" ON public.quest_questions FOR DELETE USING (public.is_admin());

-- SHOP_ITEMS POLICIES
CREATE POLICY "Shop items are viewable by everyone" ON public.shop_items FOR SELECT USING (true);
CREATE POLICY "Only admins can insert shop items" ON public.shop_items FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Only admins can update shop items" ON public.shop_items FOR UPDATE USING (public.is_admin());
CREATE POLICY "Only admins can delete shop items" ON public.shop_items FOR DELETE USING (public.is_admin());

-- USER_ACHIEVEMENTS POLICIES
CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add own achievements" ON public.user_achievements FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- USER_WALLET_ITEMS POLICIES
CREATE POLICY "Users can view own wallet items" ON public.user_wallet_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add own wallet items" ON public.user_wallet_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own wallet items" ON public.user_wallet_items FOR UPDATE USING (auth.uid() = user_id);

-- COMPLETED_QUESTS POLICIES
CREATE POLICY "Users can view own completed quests" ON public.completed_quests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add own completed quests" ON public.completed_quests FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- MEMORY_RESONANCES POLICIES
CREATE POLICY "Users can view own resonances" ON public.memory_resonances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add resonances" ON public.memory_resonances FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own resonances" ON public.memory_resonances FOR DELETE USING (auth.uid() = user_id);

-- Function to increment resonance count
CREATE OR REPLACE FUNCTION public.increment_resonance_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.memories SET resonance_count = resonance_count + 1 WHERE id = NEW.memory_id;
  RETURN NEW;
END;
$$;

-- Trigger to update resonance count on new resonance
CREATE TRIGGER on_memory_resonance_created
  AFTER INSERT ON public.memory_resonances
  FOR EACH ROW EXECUTE FUNCTION public.increment_resonance_count();

-- Function to decrement resonance count
CREATE OR REPLACE FUNCTION public.decrement_resonance_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.memories SET resonance_count = GREATEST(0, resonance_count - 1) WHERE id = OLD.memory_id;
  RETURN OLD;
END;
$$;

-- Trigger to update resonance count on delete
CREATE TRIGGER on_memory_resonance_deleted
  AFTER DELETE ON public.memory_resonances
  FOR EACH ROW EXECUTE FUNCTION public.decrement_resonance_count();

-- Seed default quests
INSERT INTO public.quests (id, category, icon, display_order) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'NP''s Timeline and History', '📜', 1),
  ('00000000-0000-0000-0000-000000000002', 'NP''s Campus', '🏛️', 2),
  ('00000000-0000-0000-0000-000000000003', 'NP''s Lecturers', '👨‍🏫', 3);

-- Seed questions for Timeline quest
INSERT INTO public.quest_questions (quest_id, question, options, correct_answer, fun_fact, display_order) VALUES
  ('00000000-0000-0000-0000-000000000001', 'In which year was Ngee Ann College established?', '["1961", "1963", "1965", "1967"]', 1, 'Ngee Ann College was founded in 1963 by the Ngee Ann Kongsi to provide tertiary education opportunities for Chinese students in Singapore.', 1),
  ('00000000-0000-0000-0000-000000000001', 'Which year did NP roll out its plan to incorporate interdisciplinary studies into the curriculum?', '["2001", "2002", "2003", "2004"]', 1, 'The 2002 curriculum reform was groundbreaking, making NP one of the first polytechnics to embrace cross-disciplinary learning.', 2),
  ('00000000-0000-0000-0000-000000000001', 'When did Ngee Ann Polytechnic move to its current Clementi campus?', '["1996", "1998", "2000", "2002"]', 1, 'The 35-hectare Clementi campus was a major upgrade, featuring state-of-the-art facilities and green spaces.', 3);

-- Seed questions for Campus quest
INSERT INTO public.quest_questions (quest_id, question, options, correct_answer, fun_fact, display_order) VALUES
  ('00000000-0000-0000-0000-000000000002', 'How many schools does Ngee Ann Polytechnic have?', '["6", "7", "8", "9"]', 3, 'NP has 9 academic schools covering a wide range of disciplines from engineering to design.', 1),
  ('00000000-0000-0000-0000-000000000002', 'What is the name of NP''s main library?', '["Lien Ying Chow Library", "Ngee Ann Library", "Central Library", "Knowledge Hub"]', 0, 'The Lien Ying Chow Library was named after the late Dr Lien Ying Chow, a prominent banker and philanthropist.', 2),
  ('00000000-0000-0000-0000-000000000002', 'Which building houses the School of Film & Media Studies?', '["Block 51", "Block 52", "Block 53", "Block 54"]', 2, 'Block 53 is home to state-of-the-art studios and editing suites for aspiring filmmakers.', 3);

-- Seed questions for Lecturers quest
INSERT INTO public.quest_questions (quest_id, question, options, correct_answer, fun_fact, display_order) VALUES
  ('00000000-0000-0000-0000-000000000003', 'What is the title of the highest academic position at NP?', '["Professor", "Principal", "Director", "Dean"]', 1, 'The Principal is the chief executive of the polytechnic, overseeing all academic and administrative functions.', 1),
  ('00000000-0000-0000-0000-000000000003', 'How many diploma courses does NP offer approximately?', '["30", "40", "50", "60"]', 1, 'NP offers about 40 full-time diploma courses across its 9 schools.', 2),
  ('00000000-0000-0000-0000-000000000003', 'What recognition program celebrates outstanding NP educators?', '["Teaching Excellence Award", "Star Lecturer Award", "Best Teacher Award", "Educator of the Year"]', 0, 'The Teaching Excellence Award recognizes lecturers who demonstrate exceptional teaching and mentorship.', 3);

-- Seed shop items
INSERT INTO public.shop_items (name, description, points, image) VALUES
  ('Coffee Voucher', 'Free coffee at NP café', 200, '☕'),
  ('NP Merchandise', 'Exclusive NP branded items', 500, '👕'),
  ('Extra Life', 'Get one extra life for quests', 150, '❤️'),
  ('VIP Gallery Access', 'Special VR gallery content', 300, '🎫'),
  ('Study Kit', 'Stationery and supplies', 400, '📚');