import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, Play, Pause } from 'lucide-react';

interface StoriesScreenProps {
  onNavigate: (screen: string) => void;
}

const stories = [
  {
    id: 1,
    title: 'The Three Little Pigs',
    emoji: '🐷',
    color: 'from-pink-400 to-pink-600',
    videoUrl: 'https://www.youtube.com/embed/QLR8LkHW0-U',
    content: `Once upon a time, there were three little pigs who built three houses. The first pig built his house with straw. The second pig built his house with sticks. The third pig built his house with bricks.

One day, a big bad wolf came and huffed and puffed and blew down the straw house! The first pig ran to the stick house. The wolf huffed and puffed and blew down the stick house too! Both pigs ran to the brick house.

The wolf tried to blow down the brick house, but he couldn't! The three little pigs were safe in the strong brick house. The wolf gave up and ran away.

The moral: Hard work and planning pay off!`
  },
  {
    id: 2,
    title: 'The Lion and the Mouse',
    emoji: '🦁',
    color: 'from-yellow-400 to-orange-600',
    videoUrl: 'https://www.youtube.com/embed/u47Qq_6txbg',
    content: `One day, a mighty lion was sleeping under a tree when a tiny mouse ran over his paw. The lion woke up and grabbed the mouse.

"Please don't eat me!" squeaked the mouse. "If you let me go, I will help you one day!"

The lion laughed. "How can a tiny mouse help a mighty lion?" But he let the mouse go.

A few days later, the lion got caught in a hunter's net. He roared for help. The little mouse heard him and came running. The mouse nibbled through the ropes and freed the lion!

"Thank you, little friend," said the lion. "I was wrong. Even small friends can be great friends!"

The moral: Everyone can help, no matter how small!`
  },
  {
    id: 3,
    title: 'The Tortoise and the Hare',
    emoji: '🐢',
    color: 'from-green-400 to-emerald-600',
    videoUrl: 'https://www.youtube.com/embed/AxU03hz50u4',
    content: `Once, a speedy hare made fun of a slow tortoise. "You're so slow!" laughed the hare.

"Let's have a race," said the tortoise calmly.

The race began. The hare ran very fast and was soon far ahead. "I'm so fast, I can take a nap!" he thought, and fell asleep under a tree.

Meanwhile, the tortoise kept walking slowly and steadily. He walked past the sleeping hare and reached the finish line!

When the hare woke up and ran to the finish line, the tortoise had already won!

The moral: Slow and steady wins the race!`
  },
  {
    id: 4,
    title: 'The Boy Who Cried Wolf',
    emoji: '🐺',
    color: 'from-blue-400 to-indigo-600',
    videoUrl: 'https://www.youtube.com/embed/fW4Aobh-B9E',
    content: `There was a shepherd boy who watched sheep on a hill. He got bored and shouted, "Wolf! Wolf! A wolf is attacking the sheep!"

The villagers ran to help, but there was no wolf. The boy laughed. A few days later, he did it again. "Wolf! Wolf!" The villagers came running again, but there was no wolf.

Then one day, a real wolf came! "Wolf! Wolf!" cried the boy. But this time, nobody came. They thought he was lying again.

The wolf ate many sheep before running away.

The moral: If you lie, people won't believe you when you tell the truth!`
  },
  {
    id: 5,
    title: 'The Ugly Duckling',
    emoji: '🦢',
    color: 'from-purple-400 to-pink-600',
    videoUrl: 'https://www.youtube.com/embed/gOaIDz0ZBSM',
    content: `In a farmyard, a mother duck's eggs hatched. All the ducklings were cute and yellow, except one who was big, gray, and ugly.

Everyone called him "the ugly duckling" and was mean to him. Sad and lonely, the duckling ran away.

He spent a cold, hard winter alone. When spring came, he saw beautiful white swans on a pond. He swam toward them, expecting them to chase him away.

But when he looked at his reflection, he saw that he had turned into a beautiful white swan! He wasn't an ugly duckling at all - he was a swan!

The other swans welcomed him warmly.

The moral: Don't judge by appearances. Everyone is special in their own way!`
  }
];

export function StoriesScreen({ onNavigate }: StoriesScreenProps) {
  const [selectedStory, setSelectedStory] = useState<typeof stories[0] | null>(null);
  const [isReading, setIsReading] = useState(false);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      if (isReading) {
        setIsReading(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      utterance.onend = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
      setIsReading(true);
    }
  };

  if (selectedStory) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 pb-8 rounded-b-3xl shadow-lg sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => {
                window.speechSynthesis.cancel();
                setIsReading(false);
                setSelectedStory(null);
              }}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft className="size-6" />
            </button>
            <button
              onClick={() => speak(selectedStory.content)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors"
            >
              {isReading ? <Pause className="size-5" /> : <Play className="size-5" />}
              <span className="text-sm">{isReading ? 'Pause' : 'Read Aloud'}</span>
            </button>
          </div>
        </div>

        {/* Story Content */}
        <div className="p-6">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${selectedStory.color} mb-4`}>
              <span className="text-5xl">{selectedStory.emoji}</span>
            </div>
            <h2 className="text-2xl text-slate-900 mb-6">{selectedStory.title}</h2>
            
            {/* Video Section */}
            <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
              <div className="relative pb-[56.25%] h-0">
                <iframe
                  src={selectedStory.videoUrl}
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={selectedStory.title}
                />
              </div>
            </div>
            
            {/* Story Text */}
            <div className="text-slate-700 leading-relaxed whitespace-pre-line">
              {selectedStory.content}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

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
            <h1 className="text-2xl">Stories 📚</h1>
            <p className="text-blue-100 text-sm">Read wonderful stories</p>
          </div>
        </div>
      </div>

      {/* Stories List */}
      <div className="p-6 space-y-4">
        {stories.map((story, index) => (
          <motion.button
            key={story.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedStory(story)}
            className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all text-left"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${story.color}`}>
                <span className="text-3xl">{story.emoji}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-slate-900 mb-1">{story.title}</h3>
                <div className="flex items-center gap-2 text-blue-600 text-sm">
                  <BookOpen className="size-4" />
                  <span>Tap to read</span>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}