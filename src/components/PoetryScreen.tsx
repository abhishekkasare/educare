import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles, Play, Pause } from 'lucide-react';

interface PoetryScreenProps {
  onNavigate: (screen: string) => void;
}

const poems = [
  {
    id: 1,
    title: 'Twinkle Twinkle Little Star',
    emoji: '⭐',
    color: 'from-yellow-400 to-amber-600',
    videoUrl: 'https://www.youtube.com/embed/yCjJyiqpAuU',
    content: `Twinkle, twinkle, little star,
How I wonder what you are!
Up above the world so high,
Like a diamond in the sky.

Twinkle, twinkle, little star,
How I wonder what you are!`
  },
  {
    id: 2,
    title: 'Humpty Dumpty',
    emoji: '🥚',
    color: 'from-orange-400 to-red-600',
    videoUrl: 'https://www.youtube.com/embed/QHON6KhvKSY',
    content: `Humpty Dumpty sat on a wall,
Humpty Dumpty had a great fall.
All the king's horses and all the king's men,
Couldn't put Humpty together again!`
  },
  {
    id: 3,
    title: 'Mary Had a Little Lamb',
    emoji: '🐑',
    color: 'from-pink-400 to-rose-600',
    videoUrl: 'https://www.youtube.com/embed/eFX1nVCLXLY',
    content: `Mary had a little lamb,
Little lamb, little lamb,
Mary had a little lamb,
Its fleece was white as snow.

And everywhere that Mary went,
Mary went, Mary went,
Everywhere that Mary went,
The lamb was sure to go!`
  },
  {
    id: 4,
    title: 'Jack and Jill',
    emoji: '🪣',
    color: 'from-blue-400 to-cyan-600',
    videoUrl: 'https://www.youtube.com/embed/MZ_v1a7xRRo',
    content: `Jack and Jill went up the hill,
To fetch a pail of water.
Jack fell down and broke his crown,
And Jill came tumbling after!`
  },
  {
    id: 5,
    title: 'Baa Baa Black Sheep',
    emoji: '🐑',
    color: 'from-slate-600 to-slate-800',
    videoUrl: 'https://www.youtube.com/embed/d1TgG4w0BkU',
    content: `Baa, baa, black sheep,
Have you any wool?
Yes sir, yes sir,
Three bags full.

One for the master,
One for the dame,
And one for the little boy,
Who lives down the lane!`
  },
  {
    id: 6,
    title: 'Itsy Bitsy Spider',
    emoji: '🕷️',
    color: 'from-purple-400 to-indigo-600',
    videoUrl: 'https://www.youtube.com/embed/jSN0rCIlSpw',
    content: `The itsy bitsy spider,
Climbed up the water spout.
Down came the rain,
And washed the spider out.

Out came the sun,
And dried up all the rain.
And the itsy bitsy spider,
Climbed up the spout again!`
  },
  {
    id: 7,
    title: 'Row Row Row Your Boat',
    emoji: '🚣',
    color: 'from-teal-400 to-blue-600',
    videoUrl: 'https://www.youtube.com/embed/R_B6oeN-MTs',
    content: `Row, row, row your boat,
Gently down the stream.
Merrily, merrily, merrily, merrily,
Life is but a dream!`
  },
  {
    id: 8,
    title: 'Five Little Ducks',
    emoji: '🦆',
    color: 'from-yellow-400 to-green-600',
    videoUrl: 'https://www.youtube.com/embed/_Ir0Mc6Qilo',
    content: `Five little ducks went out one day,
Over the hills and far away.
Mother duck said, "Quack, quack, quack, quack,"
But only four little ducks came back!`
  },
  {
    id: 9,
    title: 'Old MacDonald Had a Farm',
    emoji: '🚜',
    color: 'from-green-400 to-lime-600',
    videoUrl: 'https://www.youtube.com/embed/qPbB2Ky0mRk',
    content: `Old MacDonald had a farm,
E-I-E-I-O!
And on his farm he had a cow,
E-I-E-I-O!

With a moo-moo here,
And a moo-moo there,
Here a moo, there a moo,
Everywhere a moo-moo!

Old MacDonald had a farm,
E-I-E-I-O!`
  },
  {
    id: 10,
    title: 'Wheels on the Bus',
    emoji: '🚌',
    color: 'from-orange-400 to-amber-600',
    videoUrl: 'https://www.youtube.com/embed/e_04ZrNroTo',
    content: `The wheels on the bus go round and round,
Round and round, round and round.
The wheels on the bus go round and round,
All through the town!

The wipers on the bus go swish, swish, swish,
Swish, swish, swish, swish, swish, swish.
The wipers on the bus go swish, swish, swish,
All through the town!`
  }
];

export function PoetryScreen({ onNavigate }: PoetryScreenProps) {
  const [selectedPoem, setSelectedPoem] = useState<typeof poems[0] | null>(null);
  const [isReading, setIsReading] = useState(false);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      if (isReading) {
        setIsReading(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7;
      utterance.pitch = 1.3;
      utterance.onend = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
      setIsReading(true);
    }
  };

  if (selectedPoem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6 pb-8 rounded-b-3xl shadow-lg sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => {
                window.speechSynthesis.cancel();
                setIsReading(false);
                setSelectedPoem(null);
              }}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft className="size-6" />
            </button>
            <button
              onClick={() => speak(selectedPoem.content)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors"
            >
              {isReading ? <Pause className="size-5" /> : <Play className="size-5" />}
              <span className="text-sm">{isReading ? 'Pause' : 'Recite'}</span>
            </button>
          </div>
        </div>

        {/* Poem Content */}
        <div className="p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${selectedPoem.color} mb-4`}>
              <span className="text-5xl">{selectedPoem.emoji}</span>
            </div>
            <h2 className="text-2xl text-slate-900 mb-6">{selectedPoem.title}</h2>
            
            {/* Video Section */}
            <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
              <div className="relative pb-[56.25%] h-0">
                <iframe
                  src={selectedPoem.videoUrl}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedPoem.title}
                />
              </div>
            </div>
            
            {/* Poem Text */}
            <div className="text-slate-700 text-lg leading-relaxed whitespace-pre-line font-serif">
              {selectedPoem.content}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-6 pb-8 rounded-b-3xl shadow-lg sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-2">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="size-6" />
          </button>
          <div>
            <h1 className="text-2xl">Poetry 🎵</h1>
            <p className="text-pink-100 text-sm">Enjoy beautiful poems</p>
          </div>
        </div>
      </div>

      {/* Poems List */}
      <div className="p-6 space-y-4">
        {poems.map((poem, index) => (
          <motion.button
            key={poem.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedPoem(poem)}
            className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${poem.color}`}>
                <span className="text-3xl">{poem.emoji}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-slate-900 mb-1">{poem.title}</h3>
                <div className="flex items-center gap-2 text-purple-600 text-sm">
                  <Sparkles className="size-4" />
                  <span>Tap to listen</span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
