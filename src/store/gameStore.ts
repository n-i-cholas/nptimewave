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
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Memory {
  id: string;
  title: string;
  story: string;
  decade: string;
  imageUrl?: string;
  anonymous: boolean;
  authorName?: string;
  createdAt: Date;
  status: 'pending' | 'approved';
}

interface GameState {
  points: number;
  lives: number;
  maxLives: number;
  lastLifeReset: Date;
  wallet: WalletItem[];
  completedQuests: string[];
  memories: Memory[];
  
  // Actions
  addPoints: (amount: number) => void;
  removePoints: (amount: number) => void;
  loseLife: () => void;
  resetLives: () => void;
  purchaseItem: (item: ShopItem) => boolean;
  useVoucher: (id: string) => void;
  completeQuest: (questId: string) => void;
  addMemory: (memory: Omit<Memory, 'id' | 'createdAt' | 'status'>) => void;
  checkDailyReset: () => void;
}

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
          anonymous: false,
          authorName: 'John Tan',
          createdAt: new Date('2024-01-15'),
          status: 'approved',
        },
        {
          id: '2',
          title: 'The Library Coffee Runs',
          story: 'During exam season, my friends and I would practically live in the library. We had this ritual of taking coffee breaks at the canteen every 3 hours. Those late-night study sessions and coffee runs are some of my fondest memories.',
          decade: '2000s',
          anonymous: true,
          createdAt: new Date('2024-02-20'),
          status: 'approved',
        },
        {
          id: '3',
          title: 'Sports Day Victory',
          story: 'Our school team won the inter-polytechnic games in 2015. The feeling of representing NP and bringing home the trophy was indescribable. The whole campus celebrated with us!',
          decade: '2010s',
          anonymous: false,
          authorName: 'Sarah Lim',
          createdAt: new Date('2024-03-10'),
          status: 'approved',
        },
      ],

      addPoints: (amount) => set((state) => ({ points: state.points + amount })),
      
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
      
      completeQuest: (questId) => set((state) => ({
        completedQuests: [...state.completedQuests, questId],
      })),
      
      addMemory: (memory) => set((state) => ({
        memories: [
          ...state.memories,
          {
            ...memory,
            id: Date.now().toString(),
            createdAt: new Date(),
            status: 'pending',
          },
        ],
      })),
      
      checkDailyReset: () => {
        const state = get();
        const now = new Date();
        const lastReset = new Date(state.lastLifeReset);
        
        if (now.getDate() !== lastReset.getDate()) {
          set({ lives: 3, lastLifeReset: now });
        }
      },
    }),
    {
      name: 'np-timewave-storage',
    }
  )
);

// Quest data
export const quests: Quest[] = [
  {
    id: 'timeline-history',
    category: "NP's Timeline and History",
    completed: false,
    questions: [
      {
        id: 'q1',
        question: 'In which year was Ngee Ann College established?',
        options: ['1961', '1963', '1965', '1967'],
        correctAnswer: 1,
      },
      {
        id: 'q2',
        question: 'Which year did NP roll out its plan to incorporate interdisciplinary studies into the curriculum?',
        options: ['2001', '2002', '2003', '2004'],
        correctAnswer: 1,
      },
      {
        id: 'q3',
        question: 'When did Ngee Ann Polytechnic move to its current Clementi campus?',
        options: ['1996', '1998', '2000', '2002'],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: 'campus',
    category: "NP's Campus",
    completed: false,
    questions: [
      {
        id: 'q1',
        question: 'How many blocks are there in the main campus?',
        options: ['5', '7', '9', '11'],
        correctAnswer: 2,
      },
      {
        id: 'q2',
        question: 'What is the name of the main library at NP?',
        options: ['Central Library', 'Lien Ying Chow Library', 'NP Library', 'Heritage Library'],
        correctAnswer: 1,
      },
      {
        id: 'q3',
        question: 'Which building houses the School of Engineering?',
        options: ['Block 51', '52', '53', '54'],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: 'lecturers',
    category: "NP's Lecturers",
    completed: false,
    questions: [
      {
        id: 'q1',
        question: 'Who was the first principal of Ngee Ann Polytechnic?',
        options: ['Dr. Cham Tao Soon', 'Mr. Chia Mia Chiang', 'Dr. Lee Kum Tatt', 'Mr. Koh Boon Hwee'],
        correctAnswer: 2,
      },
      {
        id: 'q2',
        question: 'Which notable lecturer founded the Film & Media Studies programme?',
        options: ['Prof. Tan', 'Dr. Wong', 'Mr. Eric Khoo', 'Dr. Lim'],
        correctAnswer: 2,
      },
      {
        id: 'q3',
        question: 'How many full-time lecturers does NP currently employ?',
        options: ['500+', '800+', '1000+', '1200+'],
        correctAnswer: 2,
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
