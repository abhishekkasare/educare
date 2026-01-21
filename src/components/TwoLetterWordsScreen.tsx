import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Volume2, BookOpen } from 'lucide-react';

interface TwoLetterWordsScreenProps {
  onNavigate: (screen: string) => void;
}

const twoLetterWords = [
  { word: 'AT', meaning: 'In or to a place', emoji: '📍', color: 'from-red-400 to-red-600' },
  { word: 'AN', meaning: 'One; single', emoji: '1️⃣', color: 'from-orange-400 to-orange-600' },
  { word: 'AS', meaning: 'In the same way', emoji: '↔️', color: 'from-yellow-400 to-yellow-600' },
  { word: 'BE', meaning: 'To exist', emoji: '✨', color: 'from-green-400 to-green-600' },
  { word: 'BY', meaning: 'Near or next to', emoji: '👋', color: 'from-blue-400 to-blue-600' },
  { word: 'DO', meaning: 'To perform', emoji: '💪', color: 'from-indigo-400 to-indigo-600' },
  { word: 'GO', meaning: 'To move', emoji: '🚶', color: 'from-purple-400 to-purple-600' },
  { word: 'HE', meaning: 'A boy or man', emoji: '👦', color: 'from-pink-400 to-pink-600' },
  { word: 'IF', meaning: 'In case that', emoji: '🤔', color: 'from-rose-400 to-rose-600' },
  { word: 'IN', meaning: 'Inside', emoji: '📦', color: 'from-red-500 to-orange-500' },
  { word: 'IS', meaning: 'To be', emoji: '✅', color: 'from-cyan-400 to-blue-500' },
  { word: 'IT', meaning: 'A thing', emoji: '🎯', color: 'from-teal-400 to-green-500' },
  { word: 'ME', meaning: 'Myself', emoji: '😊', color: 'from-lime-400 to-green-500' },
  { word: 'MY', meaning: 'Belonging to me', emoji: '👆', color: 'from-emerald-400 to-teal-500' },
  { word: 'NO', meaning: 'Not any', emoji: '❌', color: 'from-sky-400 to-blue-500' },
  { word: 'OF', meaning: 'Belonging to', emoji: '🔗', color: 'from-violet-400 to-purple-500' },
  { word: 'ON', meaning: 'Above and touching', emoji: '⬆️', color: 'from-fuchsia-400 to-pink-500' },
  { word: 'OR', meaning: 'Gives a choice', emoji: '⚖️', color: 'from-rose-400 to-red-500' },
  { word: 'SO', meaning: 'Very much', emoji: '💯', color: 'from-amber-400 to-orange-500' },
  { word: 'TO', meaning: 'In the direction of', emoji: '➡️', color: 'from-blue-500 to-purple-500' },
  { word: 'UP', meaning: 'Toward the sky', emoji: '🆙', color: 'from-green-500 to-emerald-500' },
  { word: 'US', meaning: 'You and me', emoji: '👫', color: 'from-pink-500 to-rose-500' },
  { word: 'WE', meaning: 'You and I', emoji: '🤝', color: 'from-orange-500 to-red-500' },
];

export function TwoLetterWordsScreen({ onNavigate }: TwoLetterWordsScreenProps) {
  const [activeWord, setActiveWord] = useState<string | null>(null);

  const speak = (word: string, meaning: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${word.split('').join('. ')}. ${word}. ${meaning}`);
      utterance.rate = 0.7;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
      setActiveWord(word);
      setTimeout(() => setActiveWord(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 pb-8 rounded-b-3xl shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="size-6" />
          </button>
          <div>
            <h1 className="text-2xl">2-Letter Words 📖</h1>
            <p className="text-blue-100 text-sm">Learn simple two-letter words</p>
          </div>
        </div>
      </div>

      {/* Words Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-3">
          {twoLetterWords.map((item, index) => (
            <motion.button
              key={item.word}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: index * 0.03, 
                type: 'spring',
                stiffness: 200,
                damping: 15
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => speak(item.word, item.meaning)}
              className={`relative bg-white rounded-2xl p-4 shadow-md hover:shadow-xl transition-all ${
                activeWord === item.word ? 'ring-4 ring-purple-400' : ''
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                {/* Emoji */}
                <motion.div
                  animate={activeWord === item.word ? { 
                    scale: [1, 1.3, 1],
                    rotate: [0, -10, 10, 0]
                  } : {}}
                  transition={{ duration: 0.5 }}
                  className="text-4xl"
                >
                  {item.emoji}
                </motion.div>

                {/* Word */}
                <div className={`px-4 py-2 rounded-xl bg-gradient-to-br ${item.color} w-full`}>
                  <div className="text-white text-2xl text-center tracking-widest">{item.word}</div>
                </div>

                {/* Letter Breakdown */}
                <div className="text-xs text-purple-600">
                  {item.word.split('').join(', ')}
                </div>

                {/* Meaning */}
                <div className="text-xs text-slate-600 text-center line-clamp-2">{item.meaning}</div>

                {/* Sound Icon */}
                <div className={`p-2 rounded-full bg-gradient-to-br ${item.color} absolute top-2 right-2`}>
                  <Volume2 className="size-3 text-white" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
