import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Music, Play, Trophy } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info.tsx';

interface MusicRhythmScreenProps {
  onNavigate: (screen: string) => void;
  userId?: string;
  accessToken?: string;
}

const notes = [
  { id: 'C', emoji: '🎵', color: 'from-red-400 to-red-600', frequency: 261.63 },
  { id: 'D', emoji: '🎶', color: 'from-orange-400 to-orange-600', frequency: 293.66 },
  { id: 'E', emoji: '🎼', color: 'from-yellow-400 to-yellow-600', frequency: 329.63 },
  { id: 'F', emoji: '🎹', color: 'from-green-400 to-green-600', frequency: 349.23 },
  { id: 'G', emoji: '🎸', color: 'from-blue-400 to-blue-600', frequency: 392.00 },
  { id: 'A', emoji: '🎺', color: 'from-indigo-400 to-indigo-600', frequency: 440.00 },
  { id: 'B', emoji: '🎻', color: 'from-purple-400 to-purple-600', frequency: 493.88 },
  { id: 'C2', emoji: '🥁', color: 'from-pink-400 to-pink-600', frequency: 523.25 },
];

const rhythmPatterns = [
  { id: 1, name: 'Simple Beat', pattern: ['C', 'D', 'E'], difficulty: 'easy' },
  { id: 2, name: 'Happy Tune', pattern: ['C', 'E', 'G', 'E'], difficulty: 'easy' },
  { id: 3, name: 'Scale Up', pattern: ['C', 'D', 'E', 'F', 'G'], difficulty: 'medium' },
  { id: 4, name: 'Jump Around', pattern: ['C', 'E', 'C', 'G', 'E'], difficulty: 'medium' },
  { id: 5, name: 'Complex Rhythm', pattern: ['C', 'E', 'G', 'A', 'G', 'E', 'C'], difficulty: 'hard' },
];

export function MusicRhythmScreen({ onNavigate, userId, accessToken }: MusicRhythmScreenProps) {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [gameMode, setGameMode] = useState<'free' | 'pattern'>('free');
  const [selectedPattern, setSelectedPattern] = useState<typeof rhythmPatterns[0] | null>(null);
  const [userPattern, setUserPattern] = useState<string[]>([]);
  const [showingPattern, setShowingPattern] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize Web Audio API
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playNote = (frequency: number, duration: number = 0.3) => {
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  };

  const handleNoteClick = (note: typeof notes[0]) => {
    playNote(note.frequency);
    setActiveNote(note.id);
    setTimeout(() => setActiveNote(null), 300);

    if (gameMode === 'pattern' && selectedPattern) {
      const newUserPattern = [...userPattern, note.id];
      setUserPattern(newUserPattern);

      // Check if pattern is complete
      if (newUserPattern.length === selectedPattern.pattern.length) {
        const isCorrect = JSON.stringify(newUserPattern) === JSON.stringify(selectedPattern.pattern);
        
        if (isCorrect) {
          const points = selectedPattern.difficulty === 'easy' ? 50 : selectedPattern.difficulty === 'medium' ? 75 : 100;
          setScore(score + points);
          
          if (userId && accessToken) {
            saveScore(selectedPattern.name, points);
          }

          setTimeout(() => {
            alert(`🎉 Perfect! You earned ${points} points!`);
            setUserPattern([]);
          }, 500);
        } else {
          setTimeout(() => {
            alert('Not quite right. Try again!');
            setUserPattern([]);
          }, 500);
        }
      }
    }
  };

  const playPattern = async (pattern: string[]) => {
    setShowingPattern(true);
    
    for (let i = 0; i < pattern.length; i++) {
      const noteId = pattern[i];
      const note = notes.find(n => n.id === noteId);
      
      if (note) {
        setActiveNote(noteId);
        playNote(note.frequency, 0.5);
        await new Promise(resolve => setTimeout(resolve, 600));
        setActiveNote(null);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    setShowingPattern(false);
  };

  const startPatternMode = (pattern: typeof rhythmPatterns[0]) => {
    setSelectedPattern(pattern);
    setUserPattern([]);
    setGameMode('pattern');
    playPattern(pattern.pattern);
  };

  const saveScore = async (patternName: string, points: number) => {
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
            activityType: 'music',
            activityName: patternName,
            score: points
          }),
        }
      );
    } catch (error) {
      console.error('Error saving music score:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 pb-8 rounded-b-3xl shadow-lg sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setGameMode('free');
                setSelectedPattern(null);
                setUserPattern([]);
                onNavigate('home');
              }}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft className="size-6" />
            </button>
            <div>
              <h1 className="text-2xl">Music Rhythm 🎵</h1>
              <p className="text-purple-100 text-sm">Make music & learn rhythms</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="size-5" />
            <span>{score}</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Mode Toggle */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              setGameMode('free');
              setSelectedPattern(null);
              setUserPattern([]);
            }}
            className={`flex-1 py-3 rounded-xl transition-all ${
              gameMode === 'free'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-white text-slate-700 shadow-md'
            }`}
          >
            Free Play
          </button>
          <button
            onClick={() => setGameMode('pattern')}
            className={`flex-1 py-3 rounded-xl transition-all ${
              gameMode === 'pattern'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-white text-slate-700 shadow-md'
            }`}
          >
            Learn Pattern
          </button>
        </div>

        {gameMode === 'free' ? (
          <>
            {/* Free Play Instructions */}
            <div className="bg-white rounded-2xl p-4 shadow-md text-center">
              <p className="text-slate-700">Tap any note to play music! 🎶</p>
            </div>

            {/* Musical Notes */}
            <div className="grid grid-cols-2 gap-3">
              {notes.map((note, index) => (
                <motion.button
                  key={note.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNoteClick(note)}
                  className={`relative h-24 bg-gradient-to-br ${note.color} rounded-2xl shadow-lg transition-all ${
                    activeNote === note.id ? 'ring-4 ring-yellow-400 scale-95' : ''
                  }`}
                >
                  <div className="flex flex-col items-center justify-center h-full text-white">
                    <span className="text-4xl mb-1">{note.emoji}</span>
                    <span className="text-sm">{note.id}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        ) : (
          <>
            {selectedPattern ? (
              <>
                {/* Current Pattern */}
                <div className="bg-white rounded-2xl p-5 shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-900">{selectedPattern.name}</h3>
                    <button
                      onClick={() => playPattern(selectedPattern.pattern)}
                      disabled={showingPattern}
                      className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50"
                    >
                      <Play className="size-4" />
                      <span className="text-sm">Play Again</span>
                    </button>
                  </div>
                  
                  <div className="flex justify-center gap-2 mb-4">
                    {selectedPattern.pattern.map((noteId, index) => (
                      <div key={index} className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span>{noteId}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-center text-slate-600 text-sm">
                    Your pattern: {userPattern.join(' - ') || 'Start playing...'}
                  </div>
                </div>

                {/* Musical Notes */}
                <div className="grid grid-cols-2 gap-3">
                  {notes.map((note) => (
                    <motion.button
                      key={note.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => !showingPattern && handleNoteClick(note)}
                      disabled={showingPattern}
                      className={`relative h-24 bg-gradient-to-br ${note.color} rounded-2xl shadow-lg transition-all disabled:opacity-50 ${
                        activeNote === note.id ? 'ring-4 ring-yellow-400 scale-95' : ''
                      }`}
                    >
                      <div className="flex flex-col items-center justify-center h-full text-white">
                        <span className="text-4xl mb-1">{note.emoji}</span>
                        <span className="text-sm">{note.id}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setSelectedPattern(null);
                    setUserPattern([]);
                  }}
                  className="w-full bg-white text-slate-700 py-3 rounded-xl shadow-md hover:shadow-lg"
                >
                  Back to Patterns
                </button>
              </>
            ) : (
              <>
                {/* Pattern Selection */}
                <div className="bg-white rounded-2xl p-4 shadow-md text-center">
                  <p className="text-slate-700">Choose a rhythm pattern to learn! 🎵</p>
                </div>

                <div className="space-y-3">
                  {rhythmPatterns.map((pattern) => (
                    <motion.button
                      key={pattern.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => startPatternMode(pattern)}
                      className="w-full bg-white rounded-2xl p-5 shadow-md hover:shadow-xl transition-all text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-slate-900 mb-1">{pattern.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            pattern.difficulty === 'easy' 
                              ? 'bg-green-100 text-green-700' 
                              : pattern.difficulty === 'medium'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {pattern.difficulty}
                          </span>
                        </div>
                        <Music className="size-6 text-purple-500" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
