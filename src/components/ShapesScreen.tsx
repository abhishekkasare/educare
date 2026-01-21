import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Volume2 } from 'lucide-react';

interface ShapesScreenProps {
  onNavigate: (screen: string) => void;
}

const shapes = [
  { 
    name: 'Circle', 
    color: 'from-blue-400 to-blue-600',
    description: 'Round and smooth',
    emoji: '⭕',
    svgPath: 'M 50 10 A 40 40 0 1 1 49.9 10 Z'
  },
  { 
    name: 'Square', 
    color: 'from-red-400 to-red-600',
    description: 'Four equal sides',
    emoji: '🟦',
    svgPath: 'M 15 15 L 85 15 L 85 85 L 15 85 Z'
  },
  { 
    name: 'Triangle', 
    color: 'from-green-400 to-green-600',
    description: 'Three corners',
    emoji: '🔺',
    svgPath: 'M 50 10 L 90 90 L 10 90 Z'
  },
  { 
    name: 'Rectangle', 
    color: 'from-purple-400 to-purple-600',
    description: 'Four sides, two long',
    emoji: '▭',
    svgPath: 'M 10 25 L 90 25 L 90 75 L 10 75 Z'
  },
  { 
    name: 'Star', 
    color: 'from-yellow-400 to-amber-600',
    description: 'Five points',
    emoji: '⭐',
    svgPath: 'M 50 10 L 61 39 L 91 39 L 68 57 L 79 86 L 50 68 L 21 86 L 32 57 L 9 39 L 39 39 Z'
  },
  { 
    name: 'Heart', 
    color: 'from-pink-400 to-rose-600',
    description: 'Symbol of love',
    emoji: '❤️',
    svgPath: 'M 50 85 C 20 65, 10 40, 25 25 C 35 15, 45 15, 50 25 C 55 15, 65 15, 75 25 C 90 40, 80 65, 50 85 Z'
  },
  { 
    name: 'Hexagon', 
    color: 'from-cyan-400 to-teal-600',
    description: 'Six equal sides',
    emoji: '⬡',
    svgPath: 'M 50 10 L 85 30 L 85 70 L 50 90 L 15 70 L 15 30 Z'
  },
  { 
    name: 'Pentagon', 
    color: 'from-orange-400 to-red-600',
    description: 'Five equal sides',
    emoji: '⬠',
    svgPath: 'M 50 10 L 90 40 L 75 85 L 25 85 L 10 40 Z'
  },
  { 
    name: 'Oval', 
    color: 'from-indigo-400 to-purple-600',
    description: 'Stretched circle',
    emoji: '⬭',
    svgPath: 'M 50 15 A 35 45 0 1 1 49.9 15 Z'
  },
  { 
    name: 'Diamond', 
    color: 'from-emerald-400 to-green-600',
    description: 'Square standing up',
    emoji: '💎',
    svgPath: 'M 50 10 L 90 50 L 50 90 L 10 50 Z'
  },
  { 
    name: 'Crescent', 
    color: 'from-slate-400 to-slate-600',
    description: 'Like the moon',
    emoji: '🌙',
    svgPath: 'M 60 10 A 40 40 0 1 1 60 90 A 30 30 0 1 0 60 10 Z'
  },
  { 
    name: 'Arrow', 
    color: 'from-lime-400 to-green-600',
    description: 'Points direction',
    emoji: '➡️',
    svgPath: 'M 10 40 L 10 60 L 70 60 L 70 80 L 95 50 L 70 20 L 70 40 Z'
  }
];

export function ShapesScreen({ onNavigate }: ShapesScreenProps) {
  const [activeShape, setActiveShape] = useState<string | null>(null);

  const speak = (shapeName: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(shapeName);
      utterance.rate = 0.7;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
      setActiveShape(shapeName);
      setTimeout(() => setActiveShape(null), 1000);
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
            <h1 className="text-2xl">Shapes 🔷</h1>
            <p className="text-blue-100 text-sm">Learn different shapes</p>
          </div>
        </div>
      </div>

      {/* Shapes Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {shapes.map((shape, index) => (
            <motion.button
              key={shape.name}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: index * 0.1, 
                type: 'spring',
                stiffness: 200,
                damping: 15
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => speak(shape.name)}
              className={`relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all ${
                activeShape === shape.name ? 'ring-4 ring-purple-400' : ''
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                {/* Shape SVG */}
                <motion.div
                  animate={activeShape === shape.name ? { 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  } : {}}
                  transition={{ duration: 0.5 }}
                  className={`w-20 h-20 rounded-xl bg-gradient-to-br ${shape.color} p-2 flex items-center justify-center`}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path 
                      d={shape.svgPath} 
                      fill="white" 
                      stroke="white" 
                      strokeWidth="2"
                    />
                  </svg>
                </motion.div>
                
                {/* Shape Info */}
                <div className="text-center">
                  <div className="text-slate-900 mb-1">{shape.name}</div>
                  <div className="text-slate-600 text-xs">{shape.description}</div>
                </div>

                {/* Sound Icon */}
                <div className={`absolute top-2 right-2 p-1.5 rounded-full bg-gradient-to-br ${shape.color}`}>
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
