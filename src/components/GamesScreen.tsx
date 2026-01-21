import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Trophy, RotateCcw, Heart } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info.tsx';

interface GamesScreenProps {
  onNavigate: (screen: string) => void;
  userId?: string;
  accessToken?: string;
}

const games = [
  { id: 1, name: 'Memory Match', emoji: '🃏', color: 'from-blue-400 to-cyan-600' },
  { id: 2, name: 'Find the Pair', emoji: '👀', color: 'from-purple-400 to-pink-600' },
  { id: 3, name: 'Count the Items', emoji: '🔢', color: 'from-green-400 to-emerald-600' },
];

const memoryCards = ['🍎', '🍌', '🍊', '🍇', '🍓', '🍉'];

export function GamesScreen({ onNavigate, userId, accessToken }: GamesScreenProps) {
  const [selectedGame, setSelectedGame] = useState<typeof games[0] | null>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<any>(null);

  const startGame = (game: typeof games[0]) => {
    setSelectedGame(game);
    
    if (game.id === 1) {
      // Memory Match
      const cards = [...memoryCards, ...memoryCards]
        .sort(() => Math.random() - 0.5)
        .map((emoji, index) => ({
          id: index,
          emoji,
          flipped: false,
          matched: false
        }));
      setGameState({
        cards,
        flippedCards: [],
        moves: 0,
        matches: 0
      });
    } else if (game.id === 2) {
      // Find the Pair
      const items = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊'];
      const target = items[Math.floor(Math.random() * items.length)];
      const allItems = [...items, target].sort(() => Math.random() - 0.5);
      setGameState({
        items: allItems,
        target,
        found: false,
        attempts: 0
      });
    } else if (game.id === 3) {
      // Count the Items
      const emoji = ['🌟', '🎈', '🎁', '🎨', '🎯'][Math.floor(Math.random() * 5)];
      const count = Math.floor(Math.random() * 8) + 3;
      setGameState({
        emoji,
        count,
        userAnswer: null,
        answered: false
      });
    }
  };

  const handleMemoryCardClick = (cardId: number) => {
    if (!gameState || gameState.flippedCards.length === 2) return;
    
    const card = gameState.cards.find((c: any) => c.id === cardId);
    if (card.flipped || card.matched) return;

    const newCards = gameState.cards.map((c: any) =>
      c.id === cardId ? { ...c, flipped: true } : c
    );

    const newFlippedCards = [...gameState.flippedCards, cardId];

    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards;
      const firstCard = newCards.find((c: any) => c.id === first);
      const secondCard = newCards.find((c: any) => c.id === second);

      if (firstCard.emoji === secondCard.emoji) {
        // Match!
        setTimeout(() => {
          const matchedCards = newCards.map((c: any) =>
            c.id === first || c.id === second ? { ...c, matched: true } : c
          );
          const newMatches = gameState.matches + 1;
          setGameState({
            ...gameState,
            cards: matchedCards,
            flippedCards: [],
            moves: gameState.moves + 1,
            matches: newMatches
          });

          if (newMatches === memoryCards.length) {
            const points = Math.max(100 - gameState.moves * 5, 50);
            setScore(score + points);
            if (userId && accessToken) {
              saveScore('Memory Match', points);
            }
            setTimeout(() => {
              alert(`🎉 You won! Score: ${points} points in ${gameState.moves + 1} moves!`);
            }, 500);
          }
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          const unflippedCards = newCards.map((c: any) =>
            c.id === first || c.id === second ? { ...c, flipped: false } : c
          );
          setGameState({
            ...gameState,
            cards: unflippedCards,
            flippedCards: [],
            moves: gameState.moves + 1
          });
        }, 1000);
      }
    }

    setGameState({
      ...gameState,
      cards: newCards,
      flippedCards: newFlippedCards
    });
  };

  const handlePairClick = (emoji: string) => {
    if (!gameState || gameState.found) return;
    
    const newAttempts = gameState.attempts + 1;
    
    if (emoji === gameState.target) {
      const points = Math.max(100 - newAttempts * 10, 50);
      setScore(score + points);
      setGameState({
        ...gameState,
        found: true,
        attempts: newAttempts
      });
      if (userId && accessToken) {
        saveScore('Find the Pair', points);
      }
      setTimeout(() => {
        alert(`🎉 Found it! ${points} points!`);
      }, 500);
    } else {
      setGameState({
        ...gameState,
        attempts: newAttempts
      });
    }
  };

  const handleCountAnswer = (answer: number) => {
    if (!gameState || gameState.answered) return;

    const isCorrect = answer === gameState.count;
    const points = isCorrect ? 100 : 0;
    
    if (isCorrect) {
      setScore(score + points);
      if (userId && accessToken) {
        saveScore('Count the Items', points);
      }
    }

    setGameState({
      ...gameState,
      userAnswer: answer,
      answered: true
    });

    setTimeout(() => {
      if (isCorrect) {
        alert('🎉 Correct! 100 points!');
      } else {
        alert(`Not quite! The answer was ${gameState.count}`);
      }
    }, 500);
  };

  const saveScore = async (gameName: string, points: number) => {
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
            activityType: 'game',
            activityName: gameName,
            score: points
          }),
        }
      );
    } catch (error) {
      console.error('Error saving game score:', error);
    }
  };

  const resetGame = () => {
    if (selectedGame) {
      startGame(selectedGame);
    }
  };

  if (selectedGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 pb-8 rounded-b-3xl shadow-lg sticky top-0 z-10">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setSelectedGame(null)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft className="size-6" />
            </button>
            <div className="flex items-center gap-4">
              <button
                onClick={resetGame}
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
          <h2 className="text-xl">{selectedGame.name}</h2>
        </div>

        <div className="p-6">
          {selectedGame.id === 1 && gameState && (
            // Memory Match
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 shadow-md text-center">
                <p className="text-slate-700">Moves: {gameState.moves} | Matches: {gameState.matches}/{memoryCards.length}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {gameState.cards.map((card: any) => (
                  <motion.button
                    key={card.id}
                    whileHover={{ scale: card.matched ? 1 : 1.05 }}
                    whileTap={{ scale: card.matched ? 1 : 0.95 }}
                    onClick={() => handleMemoryCardClick(card.id)}
                    className={`h-24 rounded-2xl shadow-lg transition-all ${
                      card.matched
                        ? 'bg-green-100'
                        : card.flipped
                        ? 'bg-blue-100'
                        : 'bg-gradient-to-br from-blue-500 to-purple-500'
                    }`}
                  >
                    <div className="flex items-center justify-center h-full">
                      {card.flipped || card.matched ? (
                        <span className="text-4xl">{card.emoji}</span>
                      ) : (
                        <span className="text-4xl">❓</span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {selectedGame.id === 2 && gameState && (
            // Find the Pair
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-4 shadow-md text-center">
                <p className="text-slate-700 mb-2">Find TWO of these:</p>
                <span className="text-6xl">{gameState.target}</span>
                <p className="text-slate-600 text-sm mt-2">Attempts: {gameState.attempts}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {gameState.items.map((item: string, index: number) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePairClick(item)}
                    disabled={gameState.found}
                    className="h-24 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    <span className="text-5xl">{item}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {selectedGame.id === 3 && gameState && (
            // Count the Items
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 shadow-md text-center">
                <p className="text-slate-700 mb-4">How many items do you see?</p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {Array.from({ length: gameState.count }).map((_, i) => (
                    <span key={i} className="text-4xl">{gameState.emoji}</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[...Array(12)].map((_, i) => {
                  const num = i + 1;
                  return (
                    <motion.button
                      key={num}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCountAnswer(num)}
                      disabled={gameState.answered}
                      className={`h-16 rounded-xl shadow-md transition-all ${
                        gameState.answered && gameState.userAnswer === num
                          ? num === gameState.count
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                          : 'bg-white hover:bg-slate-50'
                      } disabled:cursor-not-allowed`}
                    >
                      <span className="text-2xl">{num}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6 pb-8 rounded-b-3xl shadow-lg sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft className="size-6" />
            </button>
            <div>
              <h1 className="text-2xl">Games 🎮</h1>
              <p className="text-blue-100 text-sm">Play fun games</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="size-5" />
            <span>{score}</span>
          </div>
        </div>
      </div>

      {/* Games List */}
      <div className="p-6 space-y-4">
        {games.map((game, index) => (
          <motion.button
            key={game.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => startGame(game)}
            className={`w-full bg-gradient-to-br ${game.color} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all text-white`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl">{game.name}</h3>
              <span className="text-5xl">{game.emoji}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
