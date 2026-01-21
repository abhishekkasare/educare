import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Volume2 } from 'lucide-react';

interface NumberSpellingScreenProps {
  onNavigate: (screen: string) => void;
}

const numberSpellings = [
  { number: 1, word: 'ONE', color: 'from-red-400 to-red-600' },
  { number: 2, word: 'TWO', color: 'from-orange-400 to-orange-600' },
  { number: 3, word: 'THREE', color: 'from-yellow-400 to-yellow-600' },
  { number: 4, word: 'FOUR', color: 'from-green-400 to-green-600' },
  { number: 5, word: 'FIVE', color: 'from-blue-400 to-blue-600' },
  { number: 6, word: 'SIX', color: 'from-indigo-400 to-indigo-600' },
  { number: 7, word: 'SEVEN', color: 'from-purple-400 to-purple-600' },
  { number: 8, word: 'EIGHT', color: 'from-pink-400 to-pink-600' },
  { number: 9, word: 'NINE', color: 'from-rose-400 to-rose-600' },
  { number: 10, word: 'TEN', color: 'from-red-500 to-orange-500' },
  { number: 11, word: 'ELEVEN', color: 'from-cyan-400 to-blue-500' },
  { number: 12, word: 'TWELVE', color: 'from-teal-400 to-green-500' },
  { number: 13, word: 'THIRTEEN', color: 'from-lime-400 to-green-500' },
  { number: 14, word: 'FOURTEEN', color: 'from-emerald-400 to-teal-500' },
  { number: 15, word: 'FIFTEEN', color: 'from-sky-400 to-blue-500' },
  { number: 16, word: 'SIXTEEN', color: 'from-violet-400 to-purple-500' },
  { number: 17, word: 'SEVENTEEN', color: 'from-fuchsia-400 to-pink-500' },
  { number: 18, word: 'EIGHTEEN', color: 'from-rose-400 to-red-500' },
  { number: 19, word: 'NINETEEN', color: 'from-amber-400 to-orange-500' },
  { number: 20, word: 'TWENTY', color: 'from-blue-500 to-purple-500' },
  { number: 21, word: 'TWENTY ONE', color: 'from-green-500 to-emerald-500' },
  { number: 22, word: 'TWENTY TWO', color: 'from-pink-500 to-rose-500' },
  { number: 23, word: 'TWENTY THREE', color: 'from-orange-500 to-red-500' },
  { number: 24, word: 'TWENTY FOUR', color: 'from-purple-500 to-indigo-500' },
  { number: 25, word: 'TWENTY FIVE', color: 'from-cyan-500 to-teal-500' },
  { number: 26, word: 'TWENTY SIX', color: 'from-yellow-500 to-amber-500' },
  { number: 27, word: 'TWENTY SEVEN', color: 'from-lime-500 to-green-500' },
  { number: 28, word: 'TWENTY EIGHT', color: 'from-sky-500 to-blue-500' },
  { number: 29, word: 'TWENTY NINE', color: 'from-fuchsia-500 to-pink-500' },
  { number: 30, word: 'THIRTY', color: 'from-red-500 to-purple-500' },
];

export function NumberSpellingScreen({ onNavigate }: NumberSpellingScreenProps) {
  const [activeNumber, setActiveNumber] = useState<number | null>(null);

  const speak = (number: number, word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`${number}. ${word}`);
      utterance.rate = 0.7;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
      setActiveNumber(number);
      setTimeout(() => setActiveNumber(null), 2000);
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
            <h1 className="text-2xl">Number Spelling 🔤</h1>
            <p className="text-blue-100 text-sm">Learn how to spell 1 to 30</p>
          </div>
        </div>
      </div>

      {/* Number Spelling Cards */}
      <div className="p-6">
        <div className="space-y-3">
          {numberSpellings.map((item, index) => (
            <motion.button
              key={item.number}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                delay: index * 0.03, 
                type: 'spring',
                stiffness: 200,
                damping: 15
              }}
              whileHover={{ scale: 1.02, x: 10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => speak(item.number, item.word)}
              className={`relative w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all ${
                activeNumber === item.number ? 'ring-4 ring-purple-400' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Number Badge */}
                <motion.div
                  animate={activeNumber === item.number ? { 
                    scale: [1, 1.2, 1],
                    rotate: [0, -10, 10, 0]
                  } : {}}
                  transition={{ duration: 0.5 }}
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}
                >
                  <span className="text-white text-2xl">{item.number}</span>
                </motion.div>

                {/* Word */}
                <div className="flex-1 text-left">
                  <div className="text-slate-900 text-xl tracking-wider">{item.word}</div>
                  <div className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                    <span className="text-purple-600">{item.word.split('').join(', ')}</span>
                    <span>=</span>
                    <span className="text-blue-600">{item.number}</span>
                  </div>
                </div>

                {/* Sound Icon */}
                <div className={`p-3 rounded-full bg-gradient-to-br ${item.color}`}>
                  <Volume2 className="size-5 text-white" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}