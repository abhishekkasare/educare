import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Volume2 } from 'lucide-react';

interface ThreeLetterWordsScreenProps {
  onNavigate: (screen: string) => void;
}

const threeLetterWords = [
  { word: 'CAT', meaning: 'A small pet animal', emoji: '🐱', color: 'from-red-400 to-red-600' },
  { word: 'DOG', meaning: 'A friendly pet', emoji: '🐕', color: 'from-orange-400 to-orange-600' },
  { word: 'BAT', meaning: 'A flying mammal', emoji: '🦇', color: 'from-yellow-400 to-yellow-600' },
  { word: 'SUN', meaning: 'Bright star in sky', emoji: '☀️', color: 'from-green-400 to-green-600' },
  { word: 'HAT', meaning: 'Worn on head', emoji: '🎩', color: 'from-blue-400 to-blue-600' },
  { word: 'CAR', meaning: 'A vehicle to drive', emoji: '🚗', color: 'from-indigo-400 to-indigo-600' },
  { word: 'BUS', meaning: 'Large vehicle', emoji: '🚌', color: 'from-purple-400 to-purple-600' },
  { word: 'CUP', meaning: 'To drink from', emoji: '☕', color: 'from-pink-400 to-pink-600' },
  { word: 'BED', meaning: 'For sleeping', emoji: '🛏️', color: 'from-rose-400 to-rose-600' },
  { word: 'BOX', meaning: 'A container', emoji: '📦', color: 'from-red-500 to-orange-500' },
  { word: 'BAG', meaning: 'To carry things', emoji: '👜', color: 'from-cyan-400 to-blue-500' },
  { word: 'PEN', meaning: 'For writing', emoji: '🖊️', color: 'from-teal-400 to-green-500' },
  { word: 'BOY', meaning: 'A male child', emoji: '👦', color: 'from-lime-400 to-green-500' },
  { word: 'TOY', meaning: 'To play with', emoji: '🧸', color: 'from-emerald-400 to-teal-500' },
  { word: 'EGG', meaning: 'From a chicken', emoji: '🥚', color: 'from-sky-400 to-blue-500' },
  { word: 'RUN', meaning: 'To move fast', emoji: '🏃', color: 'from-violet-400 to-purple-500' },
  { word: 'JOY', meaning: 'Happiness', emoji: '😊', color: 'from-fuchsia-400 to-pink-500' },
  { word: 'KEY', meaning: 'Opens locks', emoji: '🔑', color: 'from-rose-400 to-red-500' },
  { word: 'MAP', meaning: 'Shows places', emoji: '🗺️', color: 'from-amber-400 to-orange-500' },
  { word: 'NET', meaning: 'To catch things', emoji: '🥅', color: 'from-blue-500 to-purple-500' },
  { word: 'TOP', meaning: 'The highest part', emoji: '🔝', color: 'from-green-500 to-emerald-500' },
  { word: 'FAN', meaning: 'Blows air', emoji: '🪭', color: 'from-pink-500 to-rose-500' },
  { word: 'JAR', meaning: 'Glass container', emoji: '🫙', color: 'from-orange-500 to-red-500' },
  { word: 'FOX', meaning: 'Wild animal', emoji: '🦊', color: 'from-purple-500 to-indigo-500' },
  { word: 'BEE', meaning: 'Makes honey', emoji: '🐝', color: 'from-cyan-500 to-teal-500' },
  { word: 'COW', meaning: 'Farm animal', emoji: '🐄', color: 'from-yellow-500 to-amber-500' },
  { word: 'PIG', meaning: 'Pink farm animal', emoji: '🐷', color: 'from-lime-500 to-green-500' },
  { word: 'ANT', meaning: 'Tiny insect', emoji: '🐜', color: 'from-sky-500 to-blue-500' },
];

export function ThreeLetterWordsScreen({ onNavigate }: ThreeLetterWordsScreenProps) {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 pb-8 rounded-b-3xl shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="size-6" />
          </button>
          <div>
            <h1 className="text-2xl">3-Letter Words 📚</h1>
            <p className="text-green-100 text-sm">Learn simple three-letter words</p>
          </div>
        </div>
      </div>

      {/* Words Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-3">
          {threeLetterWords.map((item, index) => (
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
                activeWord === item.word ? 'ring-4 ring-green-400' : ''
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
                <div className="text-xs text-green-600">
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
