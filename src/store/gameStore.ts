import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  points: number;
  image: string;
}

export interface WalletItem extends ShopItem {
  purchasedAt: Date;
  used: boolean;
}

export interface Quest {
  id: string;
  category: string;
  questions: Question[];
  completed: boolean;
  icon: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  funFact?: string;
}

export interface Memory {
  id: string;
  title: string;
  story: string;
  decade: string;
  theme?: string;
  role?: string;
  imageUrl?: string;
  anonymous: boolean;
  authorName?: string;
  createdAt: Date;
  status: 'pending' | 'approved';
  resonanceCount: number;
  featured?: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
  requirement: {
    type: 'quests_completed' | 'streak' | 'points_earned' | 'memories_shared' | 'correct_answers';
    value: number;
  };
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'complete_quest' | 'earn_points' | 'answer_correct';
  target: number;
  progress: number;
  reward: number;
  expiresAt: Date;
  completed: boolean;
}

interface GameState {
  points: number;
  lives: number;
  maxLives: number;
  lastLifeReset: Date;
  wallet: WalletItem[];
  completedQuests: string[];
  memories: Memory[];
  
  // New features
  streak: number;
  lastPlayedDate: string | null;
  totalCorrectAnswers: number;
  totalQuestsCompleted: number;
  achievements: Achievement[];
  unlockedAchievements: string[];
  dailyChallenges: DailyChallenge[];
  questProgress: Record<string, { answered: number; correct: number }>;
  resonatedMemories: string[];
  
  // Actions
  addPoints: (amount: number) => void;
  removePoints: (amount: number) => void;
  loseLife: () => void;
  resetLives: () => void;
  purchaseItem: (item: ShopItem) => boolean;
  useVoucher: (id: string) => void;
  completeQuest: (questId: string) => void;
  addMemory: (memory: Omit<Memory, 'id' | 'createdAt' | 'status' | 'resonanceCount'>) => void;
  checkDailyReset: () => void;
  
  // New actions
  updateStreak: () => void;
  recordCorrectAnswer: () => void;
  updateQuestProgress: (questId: string, correct: boolean) => void;
  unlockAchievement: (achievementId: string) => void;
  checkAchievements: () => void;
  updateDailyChallengeProgress: (type: DailyChallenge['type'], amount: number) => void;
  resonateWithMemory: (memoryId: string) => void;
  generateDailyChallenges: () => void;
}

export const achievements: Achievement[] = [
  {
    id: 'history-explorer',
    name: 'History Explorer',
    description: 'Complete the Timeline quest',
    icon: '🏛️',
    requirement: { type: 'quests_completed', value: 1 },
  },
  {
    id: 'campus-expert',
    name: 'Campus Expert',
    description: 'Complete all quest categories',
    icon: '🎓',
    requirement: { type: 'quests_completed', value: 3 },
  },
  {
    id: 'streak-starter',
    name: 'Streak Starter',
    description: 'Play for 3 days in a row',
    icon: '🔥',
    requirement: { type: 'streak', value: 3 },
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Play for 7 days in a row',
    icon: '⚡',
    requirement: { type: 'streak', value: 7 },
  },
  {
    id: 'point-collector',
    name: 'Point Collector',
    description: 'Earn 1000 points total',
    icon: '💰',
    requirement: { type: 'points_earned', value: 1000 },
  },
  {
    id: 'memory-keeper',
    name: 'Memory Keeper',
    description: 'Share your first memory',
    icon: '📝',
    requirement: { type: 'memories_shared', value: 1 },
  },
  {
    id: 'quiz-champion',
    name: 'Quiz Champion',
    description: 'Answer 20 questions correctly',
    icon: '🏆',
    requirement: { type: 'correct_answers', value: 20 },
  },
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      points: 500,
      lives: 3,
      maxLives: 3,
      lastLifeReset: new Date(),
      wallet: [],
      completedQuests: [],
      memories: [
        {
          id: '1',
          title: 'First Day at NP',
          story: 'I still remember walking through the gates of Ngee Ann Polytechnic on my first day in 1998. The campus was buzzing with energy, and I felt both excited and nervous. The seniors welcomed us warmly, and that sense of community has stayed with me ever since.',
          decade: '1990s',
          theme: 'Campus Life',
          role: 'Alumni',
          anonymous: false,
          authorName: 'John Tan',
          createdAt: new Date('2024-01-15'),
          status: 'approved',
          resonanceCount: 24,
          featured: true,
        },
        {
          id: '2',
          title: 'The Library Coffee Runs',
          story: 'During exam season, my friends and I would practically live in the library. We had this ritual of taking coffee breaks at the canteen every 3 hours. Those late-night study sessions and coffee runs are some of my fondest memories.',
          decade: '2000s',
          theme: 'Friendships',
          role: 'Alumni',
          anonymous: true,
          createdAt: new Date('2024-02-20'),
          status: 'approved',
          resonanceCount: 18,
          featured: true,
        },
        {
          id: '3',
          title: 'Sports Day Victory',
          story: 'Our school team won the inter-polytechnic games in 2015. The feeling of representing NP and bringing home the trophy was indescribable. The whole campus celebrated with us!',
          decade: '2010s',
          theme: 'Achievements',
          role: 'Student',
          anonymous: false,
          authorName: 'Sarah Lim',
          createdAt: new Date('2024-03-10'),
          status: 'approved',
          resonanceCount: 32,
          featured: false,
        },
        {
          id: '4',
          title: 'Meeting My Best Friend',
          story: 'Orientation week 2020 was when I met my best friend. We were in the same group and bonded over our shared love for design. Three years later, we graduated together and still keep in touch.',
          decade: '2020s',
          theme: 'Friendships',
          role: 'Alumni',
          anonymous: false,
          authorName: 'Marcus Chen',
          createdAt: new Date('2024-04-05'),
          status: 'approved',
          resonanceCount: 15,
          featured: false,
        },
      ],
      
      // New state
      streak: 0,
      lastPlayedDate: null,
      totalCorrectAnswers: 0,
      totalQuestsCompleted: 0,
      achievements: achievements,
      unlockedAchievements: [],
      dailyChallenges: [],
      questProgress: {},
      resonatedMemories: [],

      addPoints: (amount) => {
        set((state) => ({ points: state.points + amount }));
        get().updateDailyChallengeProgress('earn_points', amount);
      },
      
      removePoints: (amount) => set((state) => ({ points: Math.max(0, state.points - amount) })),
      
      loseLife: () => set((state) => ({ lives: Math.max(0, state.lives - 1) })),
      
      resetLives: () => set({ lives: 3, lastLifeReset: new Date() }),
      
      purchaseItem: (item) => {
        const state = get();
        if (state.points >= item.points) {
          set({
            points: state.points - item.points,
            wallet: [...state.wallet, { ...item, purchasedAt: new Date(), used: false }],
          });
          return true;
        }
        return false;
      },
      
      useVoucher: (id) => set((state) => ({
        wallet: state.wallet.map((item) =>
          item.id === id ? { ...item, used: true } : item
        ),
      })),
      
      completeQuest: (questId) => {
        set((state) => ({
          completedQuests: [...state.completedQuests, questId],
          totalQuestsCompleted: state.totalQuestsCompleted + 1,
        }));
        get().updateDailyChallengeProgress('complete_quest', 1);
        get().checkAchievements();
      },
      
      addMemory: (memory) => {
        set((state) => ({
          memories: [
            ...state.memories,
            {
              ...memory,
              id: Date.now().toString(),
              createdAt: new Date(),
              status: 'pending',
              resonanceCount: 0,
            },
          ],
        }));
        get().checkAchievements();
      },
      
      checkDailyReset: () => {
        const state = get();
        const now = new Date();
        const lastReset = new Date(state.lastLifeReset);
        
        if (now.getDate() !== lastReset.getDate()) {
          set({ lives: 3, lastLifeReset: now });
          get().generateDailyChallenges();
        }
      },

      updateStreak: () => {
        const state = get();
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (state.lastPlayedDate === today) return;
        
        if (state.lastPlayedDate === yesterday) {
          set({ streak: state.streak + 1, lastPlayedDate: today });
        } else if (state.lastPlayedDate !== today) {
          set({ streak: 1, lastPlayedDate: today });
        }
        
        get().checkAchievements();
      },

      recordCorrectAnswer: () => {
        set((state) => ({ totalCorrectAnswers: state.totalCorrectAnswers + 1 }));
        get().updateDailyChallengeProgress('answer_correct', 1);
        get().checkAchievements();
      },

      updateQuestProgress: (questId, correct) => {
        set((state) => {
          const current = state.questProgress[questId] || { answered: 0, correct: 0 };
          return {
            questProgress: {
              ...state.questProgress,
              [questId]: {
                answered: current.answered + 1,
                correct: current.correct + (correct ? 1 : 0),
              },
            },
          };
        });
      },

      unlockAchievement: (achievementId) => {
        set((state) => ({
          unlockedAchievements: [...state.unlockedAchievements, achievementId],
        }));
      },

      checkAchievements: () => {
        const state = get();
        const pendingMemories = state.memories.filter(m => m.status === 'pending').length;
        
        achievements.forEach((achievement) => {
          if (state.unlockedAchievements.includes(achievement.id)) return;
          
          let shouldUnlock = false;
          
          switch (achievement.requirement.type) {
            case 'quests_completed':
              shouldUnlock = state.totalQuestsCompleted >= achievement.requirement.value;
              break;
            case 'streak':
              shouldUnlock = state.streak >= achievement.requirement.value;
              break;
            case 'points_earned':
              shouldUnlock = state.points >= achievement.requirement.value;
              break;
            case 'memories_shared':
              shouldUnlock = pendingMemories >= achievement.requirement.value;
              break;
            case 'correct_answers':
              shouldUnlock = state.totalCorrectAnswers >= achievement.requirement.value;
              break;
          }
          
          if (shouldUnlock) {
            state.unlockAchievement(achievement.id);
          }
        });
      },

      updateDailyChallengeProgress: (type, amount) => {
        set((state) => ({
          dailyChallenges: state.dailyChallenges.map((challenge) => {
            if (challenge.type !== type || challenge.completed) return challenge;
            
            const newProgress = Math.min(challenge.progress + amount, challenge.target);
            const completed = newProgress >= challenge.target;
            
            if (completed && !challenge.completed) {
              // Award bonus points
              setTimeout(() => get().addPoints(challenge.reward), 0);
            }
            
            return { ...challenge, progress: newProgress, completed };
          }),
        }));
      },

      resonateWithMemory: (memoryId) => {
        const state = get();
        if (state.resonatedMemories.includes(memoryId)) return;
        
        set((state) => ({
          resonatedMemories: [...state.resonatedMemories, memoryId],
          memories: state.memories.map((m) =>
            m.id === memoryId ? { ...m, resonanceCount: m.resonanceCount + 1 } : m
          ),
        }));
      },

      generateDailyChallenges: () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const challenges: DailyChallenge[] = [
          {
            id: `daily-quest-${Date.now()}`,
            title: 'Quest Explorer',
            description: 'Complete 1 quest today',
            type: 'complete_quest',
            target: 1,
            progress: 0,
            reward: 100,
            expiresAt: tomorrow,
            completed: false,
          },
          {
            id: `daily-points-${Date.now()}`,
            title: 'Point Hunter',
            description: 'Earn 200 points today',
            type: 'earn_points',
            target: 200,
            progress: 0,
            reward: 50,
            expiresAt: tomorrow,
            completed: false,
          },
          {
            id: `daily-correct-${Date.now()}`,
            title: 'Sharp Mind',
            description: 'Answer 5 questions correctly',
            type: 'answer_correct',
            target: 5,
            progress: 0,
            reward: 75,
            expiresAt: tomorrow,
            completed: false,
          },
        ];
        
        set({ dailyChallenges: challenges });
      },
    }),
    {
      name: 'np-timewave-storage',
    }
  )
);

// Quest data with fun facts
export const quests: Quest[] = [
  {
    id: 'timeline-history',
    category: "NP's Timeline and History",
    completed: false,
    icon: '📜',
    questions: [
      {
        id: 'q1',
        question: 'In which year was Ngee Ann College established?',
        options: ['1961', '1963', '1965', '1967'],
        correctAnswer: 1,
        funFact: 'Ngee Ann College was founded in 1963 by the Ngee Ann Kongsi to provide tertiary education opportunities for Chinese students in Singapore.',
      },
      {
        id: 'q2',
        question: 'Which year did NP roll out its plan to incorporate interdisciplinary studies into the curriculum?',
        options: ['2001', '2002', '2003', '2004'],
        correctAnswer: 1,
        funFact: 'The 2002 curriculum reform was groundbreaking, making NP one of the first polytechnics to embrace cross-disciplinary learning.',
      },
      {
        id: 'q3',
        question: 'When did Ngee Ann Polytechnic move to its current Clementi campus?',
        options: ['1996', '1998', '2000', '2002'],
        correctAnswer: 1,
        funFact: 'The 35-hectare Clementi campus was a major upgrade, featuring state-of-the-art facilities and green spaces.',
      },
    ],
  },
  {
    id: 'campus',
    category: "NP's Campus",
    completed: false,
    icon: '🏫',
    questions: [
      {
        id: 'q1',
        question: 'How many blocks are there in the main campus?',
        options: ['5', '7', '9', '11'],
        correctAnswer: 2,
        funFact: 'The 9 blocks are interconnected with covered walkways, making it easy to navigate even during rainy days!',
      },
      {
        id: 'q2',
        question: 'What is the name of the main library at NP?',
        options: ['Central Library', 'Lien Ying Chow Library', 'NP Library', 'Heritage Library'],
        correctAnswer: 1,
        funFact: 'The Lien Ying Chow Library is named after a prominent Singaporean banker and philanthropist who was a key figure in the Ngee Ann Kongsi.',
      },
      {
        id: 'q3',
        question: 'Which building houses the School of Engineering?',
        options: ['Block 51', '52', '53', '54'],
        correctAnswer: 0,
        funFact: 'Block 51 features specialized engineering labs and workshops that simulate real industry environments.',
      },
    ],
  },
  {
    id: 'lecturers',
    category: "NP's Lecturers",
    completed: false,
    icon: '👨‍🏫',
    questions: [
      {
        id: 'q1',
        question: 'Who was the first principal of Ngee Ann Polytechnic?',
        options: ['Dr. Cham Tao Soon', 'Mr. Chia Mia Chiang', 'Dr. Lee Kum Tatt', 'Mr. Koh Boon Hwee'],
        correctAnswer: 2,
        funFact: 'Dr. Lee Kum Tatt was a visionary leader who later became known as the "Father of Engineering" in Singapore.',
      },
      {
        id: 'q2',
        question: 'Which notable lecturer founded the Film & Media Studies programme?',
        options: ['Prof. Tan', 'Dr. Wong', 'Mr. Eric Khoo', 'Dr. Lim'],
        correctAnswer: 2,
        funFact: 'Eric Khoo is an internationally acclaimed filmmaker whose works have been screened at Cannes Film Festival.',
      },
      {
        id: 'q3',
        question: 'How many full-time lecturers does NP currently employ?',
        options: ['500+', '800+', '1000+', '1200+'],
        correctAnswer: 2,
        funFact: 'NP\'s lecturers bring diverse industry experience, with many having worked at top companies before teaching.',
      },
    ],
  },
];

// Shop items
export const shopItems: ShopItem[] = [
  {
    id: 'voucher-makan',
    name: 'Makan Place $2 Voucher',
    description: 'Enjoy a $2 discount at any Makan Place stall',
    points: 600,
    image: '🎫',
  },
  {
    id: 'shirt-redemption',
    name: 'Shirt Redemption',
    description: 'Redeem an exclusive NP TimeWave t-shirt',
    points: 2000,
    image: '👕',
  },
  {
    id: 'voucher-prata',
    name: 'Prataboy Free Prata',
    description: 'Get a free prata at Prataboy stall',
    points: 1100,
    image: '🥞',
  },
];

// VR Gallery data
export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: 'timeline' | 'vision' | 'halloffame';
  imageUrl?: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'timeline-1963',
    title: 'Birth of Ngee Ann College',
    description: 'The founding of Ngee Ann College in 1963, marking the beginning of a legacy in education.',
    category: 'timeline',
  },
  {
    id: 'timeline-1998',
    title: 'Clementi Campus Opens',
    description: 'NP moved to its current 35-hectare campus in Clementi, featuring modern facilities.',
    category: 'timeline',
  },
  {
    id: 'timeline-2010',
    title: 'Digital Transformation',
    description: 'NP embraced digital learning with state-of-the-art computer labs and online platforms.',
    category: 'timeline',
  },
  {
    id: 'vision-innovation',
    title: 'Innovation Hub',
    description: 'Our vision for fostering innovation and entrepreneurship among students.',
    category: 'vision',
  },
  {
    id: 'vision-sustainability',
    title: 'Sustainable Campus',
    description: 'NP\'s commitment to environmental sustainability and green initiatives.',
    category: 'vision',
  },
  {
    id: 'hof-dennis-chew',
    title: 'Dennis Chew',
    description: 'An abstract representation of the school\'s establishment in 1923.',
    category: 'halloffame',
  },
  {
    id: 'hof-alumni',
    title: 'Distinguished Alumni',
    description: 'Celebrating the achievements of NP graduates across various industries.',
    category: 'halloffame',
  },
];

// Theme and Role options for Memory Portal
export const memoryThemes = ['Campus Life', 'Friendships', 'Achievements', 'Learning', 'Events', 'Sports', 'Arts', 'Other'];
export const memoryRoles = ['Student', 'Alumni', 'Staff', 'Faculty', 'Visitor'];
