import { motion } from 'motion/react';
import { User as UserType } from '../App';
import { BookA, Hash, Apple, Cat, Carrot, Youtube, Trophy, BookOpen, Music2, Shapes, Gamepad2, Puzzle, Sparkles, Type } from 'lucide-react';

interface HomeScreenProps {
  user: UserType;
  onNavigate: (screen: string) => void;
}

export function HomeScreen({ user, onNavigate }: HomeScreenProps) {
  const categories = [
    { 
      id: 'alphabet', 
      title: 'Alphabets', 
      icon: BookA, 
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: 'Learn A to Z'
    },
    { 
      id: 'numbers', 
      title: 'Numbers', 
      icon: Hash, 
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      description: 'Count 1 to 100'
    },
    { 
      id: 'numberSpelling', 
      title: 'Spell Numbers', 
      icon: Hash, 
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      description: 'Spell 1 to 30'
    },
    { 
      id: 'twoLetterWords', 
      title: '2-Letter Words', 
      icon: Type, 
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: 'Simple Words'
    },
    { 
      id: 'threeLetterWords', 
      title: '3-Letter Words', 
      icon: Type, 
      color: 'from-green-500 to-blue-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      description: 'Easy Words'
    },
    { 
      id: 'shapes', 
      title: 'Shapes', 
      icon: Shapes, 
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      description: 'Learn Shapes'
    },
    { 
      id: 'stories', 
      title: 'Stories', 
      icon: BookOpen, 
      color: 'from-blue-500 to-purple-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      description: 'Read & Listen'
    },
    { 
      id: 'poetry', 
      title: 'Poetry', 
      icon: Sparkles, 
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      description: 'Rhymes & Poems'
    },
    { 
      id: 'fruits', 
      title: 'Fruits', 
      icon: Apple, 
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      description: 'Tasty & Healthy'
    },
    { 
      id: 'animals', 
      title: 'Animals', 
      icon: Cat, 
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      description: 'Meet the Animals'
    },
    { 
      id: 'vegetables', 
      title: 'Vegetables', 
      icon: Carrot, 
      color: 'from-amber-500 to-yellow-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      description: 'Good for You'
    },
    { 
      id: 'puzzles', 
      title: 'Puzzles', 
      icon: Puzzle, 
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      description: 'Solve & Learn'
    },
    { 
      id: 'musicRhythm', 
      title: 'Music', 
      icon: Music2, 
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      description: 'Make Music'
    },
    { 
      id: 'games', 
      title: 'Games', 
      icon: Gamepad2, 
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-600',
      description: 'Play & Win'
    },
    { 
      id: 'videos', 
      title: 'Videos', 
      icon: Youtube, 
      color: 'from-rose-500 to-red-600',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-600',
      description: 'Watch & Learn'
    },
    { 
      id: 'types', 
      title: 'Types', 
      icon: Type, 
      color: 'from-gray-500 to-gray-700',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-600',
      description: 'Learn Types'
    },
  ];

  const getAvatarEmoji = (avatar?: string) => {
    const avatarMap: { [key: string]: string } = {
      'boy1': '👦',
      'boy2': '🧒',
      'boy3': '👨',
      'girl1': '👧',
      'girl2': '👩',
      'girl3': '🧑',
    };
    return avatarMap[avatar || ''] || '👤';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, 0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-4xl"
            >
              {getAvatarEmoji(user.avatar)}
            </motion.div>
            <div>
              <h2 className="text-xl">Hello, {user.name}! 👋</h2>
              <p className="text-blue-100 text-sm">Ready to learn today?</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-yellow-300">
              <Trophy className="size-5" />
              <span className="text-lg">{user.totalPoints}</span>
            </div>
            <p className="text-xs text-blue-100">Points</p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="p-6 space-y-4">
        <h3 className="text-slate-900 text-lg">Explore & Learn</h3>
        
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <motion.button
                key={category.id}
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
                onClick={() => onNavigate(category.id)}
                className={`${category.bgColor} rounded-2xl p-5 shadow-md hover:shadow-xl transition-all text-left`}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${category.color} mb-3`}>
                  <IconComponent className="size-6 text-white" />
                </div>
                <h4 className={`${category.textColor} mb-1`}>{category.title}</h4>
                <p className="text-slate-600 text-xs">{category.description}</p>
              </motion.button>
            );
          })}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-md p-5 mt-6"
        >
          <h4 className="text-slate-900 mb-4">Your Progress</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl text-blue-600">{user.coursesCompleted}</div>
              <p className="text-xs text-slate-600">Completed</p>
            </div>
            <div>
              <div className="text-2xl text-purple-600">{user.totalPoints}</div>
              <p className="text-xs text-slate-600">Points</p>
            </div>
            <div>
              <div className="text-2xl text-green-600">{user.age || 0}</div>
              <p className="text-xs text-slate-600">Years Old</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}