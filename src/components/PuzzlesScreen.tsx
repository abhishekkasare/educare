import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Trophy, RotateCcw } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info.tsx';

interface PuzzlesScreenProps {
  onNavigate: (screen: string) => void;
  userId?: string;
  accessToken?: string;
}

const puzzles = [
  {
    id: 1,
    name: 'Number Order',
    difficulty: 'easy',
    type: 'sequence',
    items: ['1', '2', '3', '4', '5'],
    correctOrder: ['1', '2', '3', '4', '5']
  },
  {
    id: 2,
    name: 'Alphabet Order',
    difficulty: 'easy',
    type: 'sequence',
    items: ['A', 'B', 'C', 'D', 'E'],
    correctOrder: ['A', 'B', 'C', 'D', 'E']
  },
  {
    id: 3,
    name: 'Color Match',
    difficulty: 'medium',
    type: 'match',
    items: ['🔴', '🟡', '🔵', '🟢'],
    correctOrder: ['🔴', '🔴', '🟡', '🟡']
  },
  {
    id: 4,
    name: 'Shape Match',
    difficulty: 'medium',
    type: 'match',
    items: ['⭐', '❤️', '⭕', '⬛'],
    correctOrder: ['⭐', '⭐', '❤️', '❤️']
  },
  {
    id: 5,
    name: 'Spell CAT',
    difficulty: 'easy',
    type: 'spell',
    items: ['C', 'A', 'T'],
    correctOrder: ['C', 'A', 'T']
  },
  {
    id: 6,
    name: 'Spell DOG',
    difficulty: 'easy',
    type: 'spell',
    items: ['D', 'O', 'G'],
    correctOrder: ['D', 'O', 'G']
  },
  {
    id: 7,
    name: 'Two Letter Word: GO',
    difficulty: 'easy',
    type: 'spell',
    items: ['G', 'O'],
    correctOrder: ['G', 'O']
  },
  {
    id: 8,
    name: 'Two Letter Word: IN',
    difficulty: 'easy',
    type: 'spell',
    items: ['I', 'N'],
    correctOrder: ['I', 'N']
  },
  {
    id: 9,
    name: 'Spell SUN',
    difficulty: 'medium',
    type: 'spell',
    items: ['S', 'U', 'N'],
    correctOrder: ['S', 'U', 'N']
  },
  {
    id: 10,
    name: 'Spell RUN',
    difficulty: 'medium',
    type: 'spell',
    items: ['R', 'U', 'N'],
    correctOrder: ['R', 'U', 'N']
  }
];

export function PuzzlesScreen({ onNavigate, userId, accessToken }: PuzzlesScreenProps) {
  const [selectedPuzzle, setSelectedPuzzle] = useState<typeof puzzles[0] | null>(null);
  const [shuffledItems, setShuffledItems] = useState<string[]>([]);
  const [userOrder, setUserOrder] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (selectedPuzzle) {
      const shuffled = [...selectedPuzzle.items].sort(() => Math.random() - 0.5);
      setShuffledItems(shuffled);
      setUserOrder([]);
      setCompleted(false);
    }
  }, [selectedPuzzle]);

  const handleItemClick = (item: string) => {
    if (completed) return;
    
    const newOrder = [...userOrder, item];
    setUserOrder(newOrder);

    if (newOrder.length === selectedPuzzle?.items.length) {
      const isCorrect = JSON.stringify(newOrder) === JSON.stringify(selectedPuzzle.correctOrder);
      
      if (isCorrect) {
        const points = selectedPuzzle.difficulty === 'easy' ? 50 : 100;
        setScore(score + points);
        setCompleted(true);
        
        // Save score to backend
        if (userId && accessToken) {
          saveScore(selectedPuzzle.name, points);
        }

        setTimeout(() => {
          alert(`🎉 Correct! You earned ${points} points!`);
        }, 500);
      } else {
        setTimeout(() => {
          alert('Try again!');
          setUserOrder([]);
        }, 500);
      }
    }
  };

  const saveScore = async (puzzleName: string, points: number) => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-97f4c85e/save-activity-score`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            activityType: 'puzzle',
            activityName: puzzleName,
            score: points
          }),
        }
      );
    } catch (error) {
      console.error('Error saving puzzle score:', error);
    }
  };

  const resetPuzzle = () => {
    if (selectedPuzzle) {
      const shuffled = [...selectedPuzzle.items].sort(() => Math.random() - 0.5);
      setShuffledItems(shuffled);
      setUserOrder([]);
      setCompleted(false);
    }
  };

  if (selectedPuzzle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 pb-8 rounded-b-3xl shadow-lg sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setSelectedPuzzle(null)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={resetPuzzle}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <RotateCcw className="size-5" />
              </button>
              <div className="flex items-center gap-2">
                <Trophy className="size-5" />
                <span>{score}</span>
              </div>
            </div>
          </div>
          <h2 className="text-xl">{selectedPuzzle.name}</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <p className="text-slate-700 text-center">
              {selectedPuzzle.type === 'sequence' ? 'Tap the items in the correct order!' : 'Match the pairs!'}
            </p>
          </div>

          {/* User's Order */}
          <div className="bg-white rounded-2xl p-5 shadow-md">
            <h3 className="text-slate-900 mb-3 text-center">Your Answer:</h3>
            <div className="flex justify-center gap-3 flex-wrap min-h-[60px]">
              {userOrder.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Shuffled Items */}
          <div className="grid grid-cols-3 gap-3">
            {shuffledItems.map((item, index) => {
              const isUsed = userOrder.includes(item) && userOrder.filter(i => i === item).length >= selectedPuzzle.items.filter(i => i === item).length;
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: isUsed ? 1 : 1.05 }}
                  whileTap={{ scale: isUsed ? 1 : 0.95 }}
                  onClick={() => !isUsed && handleItemClick(item)}
                  disabled={isUsed}
                  className={`h-20 rounded-2xl shadow-md transition-all ${
                    isUsed 
                      ? 'bg-slate-100 opacity-50 cursor-not-allowed' 
                      : 'bg-white hover:shadow-xl'
                  }`}
                >
                  <span className="text-3xl">{item}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 pb-8 rounded-b-3xl shadow-lg sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft className="size-6" />
            </button>
            <div>
              <h1 className="text-2xl">Puzzles 🧩</h1>
              <p className="text-purple-100 text-sm">Solve fun puzzles</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="size-5" />
            <span>{score}</span>
          </div>
        </div>
      </div>

      {/* Puzzles List */}
      <div className="p-6 space-y-4">
        {puzzles.map((puzzle, index) => (
          <motion.button
            key={puzzle.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedPuzzle(puzzle)}
            className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-slate-900 mb-1">{puzzle.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  puzzle.difficulty === 'easy' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {puzzle.difficulty}
                </span>
              </div>
              <span className="text-3xl">🧩</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}