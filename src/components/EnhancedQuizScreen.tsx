import { useState, useEffect } from 'react';
import { 
  Star, 
  Trophy,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Volume2,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { User } from '../App';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { projectId, publicAnonKey } from '../utils/supabase/info.tsx';

interface EnhancedQuizScreenProps {
  user: User;
  onNavigate: (screen: string) => void;
  onUpdatePoints: (points: number) => void;
  accessToken?: string;
}

type Difficulty = 'easy' | 'medium' | 'hard';
type Category = 'all' | 'alphabet' | 'numbers' | 'fruits' | 'animals' | 'vegetables' | 'twoLetterWords' | 'threeLetterWords';

interface Question {
  id: string;
  category: string;
  difficulty: Difficulty;
  points: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

type QuizState = 'category' | 'playing' | 'result';

export function EnhancedQuizScreen({ user, onNavigate, onUpdatePoints, accessToken }: EnhancedQuizScreenProps) {
  const [quizState, setQuizState] = useState<QuizState>('category');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [celebration, setCelebration] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'all' as Category, name: 'All Topics', emoji: '🎯', color: 'from-purple-500 to-pink-500' },
    { id: 'alphabet' as Category, name: 'Alphabets', emoji: '🔤', color: 'from-blue-500 to-cyan-500' },
    { id: 'numbers' as Category, name: 'Numbers', emoji: '🔢', color: 'from-green-500 to-emerald-500' },
    { id: 'fruits' as Category, name: 'Fruits', emoji: '🍎', color: 'from-red-500 to-orange-500' },
    { id: 'animals' as Category, name: 'Animals', emoji: '🐘', color: 'from-amber-500 to-yellow-500' },
    { id: 'vegetables' as Category, name: 'Vegetables', emoji: '🥕', color: 'from-lime-500 to-green-500' },
    { id: 'twoLetterWords' as Category, name: 'Two Letter Words', emoji: '📚', color: 'from-indigo-500 to-violet-500' },
    { id: 'threeLetterWords' as Category, name: 'Three Letter Words', emoji: '📚', color: 'from-indigo-500 to-violet-500' },
  ];

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    window.speechSynthesis.speak(utterance);
  };

  const fetchQuizQuestions = async (category: Category) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-97f4c85e/quiz-questions?category=${category}&count=10`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      const data = await response.json();
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(null));
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      speak('Sorry, there was an error loading the quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async (category: Category) => {
    setSelectedCategory(category);
    await fetchQuizQuestions(category);
    setQuizState('playing');
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    speak('Let\'s start the quiz! Good luck!');
  };

  const handleSelectAnswer = (answer: string) => {
    if (!showFeedback) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null || questions.length === 0) return;
    
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);
    setShowFeedback(true);

    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    
    if (isCorrect) {
      speak('Great job! That\'s correct!');
      setCelebration(true);
      setTimeout(() => setCelebration(false), 1000);
    } else {
      speak('Oops! Try again next time!');
    }

    setTimeout(async () => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        // Submit quiz results to backend
        const pointsEarned = calculateTotalPoints(newAnswers);
        
        if (accessToken) {
          try {
            await fetch(
              `https://${projectId}.supabase.co/functions/v1/make-server-97f4c85e/submit-quiz`,
              {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  category: selectedCategory,
                  score: pointsEarned,
                  totalQuestions: questions.length,
                  difficulty: 'mixed'
                }),
              }
            );
          } catch (error) {
            console.error('Error submitting quiz results:', error);
          }
        }
        
        onUpdatePoints(pointsEarned);
        setQuizState('result');
        
        const finalScore = newAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length;
        if (finalScore >= questions.length * 0.7) {
          speak('Wow! You did amazing! You\'re a superstar!');
        } else {
          speak('Good try! Keep practicing and you\'ll do even better!');
        }
      }
    }, 2000);
  };

  const handleRetakeQuiz = () => {
    setQuizState('category');
  };

  const calculateScore = (answersArray: (string | null)[] = answers) => {
    if (questions.length === 0) return 0;
    return answersArray.filter((answer, index) => answer === questions[index].correctAnswer).length;
  };

  const calculateTotalPoints = (answersArray: (string | null)[] = answers) => {
    return answersArray.reduce((total, answer, index) => {
      if (answer === questions[index].correctAnswer) {
        return total + questions[index].points;
      }
      return total;
    }, 0);
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
    }
  };

  const getDifficultyLabel = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy': return '⭐ Easy';
      case 'medium': return '⭐⭐ Medium';
      case 'hard': return '⭐⭐⭐ Hard';
    }
  };

  // Category Selection Screen
  if (quizState === 'category') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 pb-24">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 pb-8 rounded-b-3xl shadow-lg">
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft className="size-6" />
            </button>
            <div>
              <h1 className="text-2xl">Choose Quiz Category</h1>
              <p className="text-purple-100 text-sm">Select a topic to test your knowledge</p>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleStartQuiz(category.id)}
                disabled={loading}
                className={`bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${category.color}`}>
                    <span className="text-4xl">{category.emoji}</span>
                  </div>
                  <h3 className="text-slate-900">{category.name}</h3>
                </div>
              </button>
            ))}
          </div>

          {/* Info Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xl mt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl p-4">
                <Sparkles className="size-8 text-white" />
              </div>
              <div>
                <p className="text-slate-900 text-lg">10 Questions</p>
                <p className="text-slate-600">Mixed difficulty levels!</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge className="bg-green-500">⭐ Easy</Badge>
                <span className="text-slate-600 text-sm">50 points each</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-yellow-500">⭐⭐ Medium</Badge>
                <span className="text-slate-600 text-sm">75 points each</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-red-500">⭐⭐⭐ Hard</Badge>
                <span className="text-slate-600 text-sm">100 points each</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Result Screen
  if (quizState === 'result') {
    const score = calculateScore();
    const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const earnedPoints = calculateTotalPoints();

    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 flex flex-col p-6 pb-24">
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Animated Trophy */}
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-3xl opacity-50 animate-pulse"></div>
            <div className={`relative rounded-full p-8 shadow-2xl animate-bounce ${
              percentage >= 70 
                ? 'bg-gradient-to-br from-yellow-400 to-orange-400' 
                : 'bg-gradient-to-br from-blue-400 to-purple-400'
            }`}>
              <Trophy className="size-20 text-white" />
            </div>
          </div>

          <h1 className="text-slate-900 text-4xl mb-2">
            {percentage >= 70 ? 'Awesome! 🎉' : 'Great Try! 🌟'}
          </h1>
          <p className="text-slate-600 text-center mb-8 text-lg">
            {percentage >= 70 
              ? 'You\'re a superstar!' 
              : 'Keep learning, you\'re doing great!'}
          </p>

          <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-xl mb-8">
            <div className="text-center mb-6">
              <div className="text-7xl mb-4">{percentage >= 70 ? '⭐' : '🌟'}</div>
              <div className="text-6xl mb-2">{score}/{questions.length}</div>
              <p className="text-slate-600 text-lg">Correct Answers!</p>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-4 flex justify-between items-center">
                <span className="text-slate-700 flex items-center gap-2">
                  <Star className="size-6 fill-yellow-500 text-yellow-500" />
                  <span className="text-lg">Points Earned</span>
                </span>
                <span className="text-orange-600 text-2xl">+{earnedPoints}</span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm space-y-3">
            <Button
              onClick={handleRetakeQuiz}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-6 text-lg rounded-2xl"
              size="lg"
            >
              <RotateCcw className="size-6 mr-2" />
              Take Another Quiz
            </Button>
            <Button
              onClick={() => onNavigate('home')}
              variant="outline"
              className="w-full py-6 text-lg rounded-2xl"
              size="lg"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  if (loading || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎯</div>
          <p className="text-slate-600 text-lg">Loading quiz...</p>
        </div>
      </div>
    );
  }
  
  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-24">
      {/* Celebration Confetti */}
      {celebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-8xl animate-ping">🎉</div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 pt-8 pb-6 rounded-b-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-white/90 text-sm">Question {currentQuestion + 1} of {questions.length}</p>
              <Badge className={getDifficultyColor(question.difficulty)}>
                {getDifficultyLabel(question.difficulty)}
              </Badge>
            </div>
            <h2 className="text-white text-xl flex items-center gap-2">
              <span>Quiz Time!</span>
              <Zap className="size-5 text-yellow-300" />
            </h2>
          </div>
          <button
            onClick={() => speak(question.question)}
            className="bg-white/20 backdrop-blur-sm rounded-full p-3 hover:bg-white/30 transition-colors"
          >
            <Volume2 className="size-6 text-white" />
          </button>
        </div>
        
        <Progress value={progress} className="h-3 bg-white/20 rounded-full" />
        
        {/* Star Progress */}
        <div className="flex gap-2 mt-3 justify-center flex-wrap">
          {questions.map((q, index) => (
            <div
              key={index}
              className={`size-7 rounded-full flex items-center justify-center transition-all ${
                index < currentQuestion
                  ? answers[index] === questions[index].correctAnswer
                    ? 'bg-yellow-400 scale-110'
                    : 'bg-slate-300'
                  : index === currentQuestion
                  ? 'bg-white scale-125'
                  : 'bg-white/50'
              }`}
            >
              {index < currentQuestion && answers[index] === questions[index].correctAnswer && (
                <Star className="size-4 fill-white text-white" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="px-6 py-6">
        <div className="bg-white rounded-3xl p-6 shadow-xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 text-2xl text-center flex-1">{question.question}</h3>
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl px-3 py-2 ml-2">
              <p className="text-purple-700 text-sm">+{question.points}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === option;
              const isCorrectOption = option === question.correctAnswer;
              
              let buttonClass = 'p-6 rounded-3xl border-4 transition-all text-2xl ';
              
              if (showFeedback) {
                if (isSelected && isCorrect) {
                  buttonClass += 'border-green-500 bg-green-100 text-green-900 scale-105';
                } else if (isSelected && !isCorrect) {
                  buttonClass += 'border-red-500 bg-red-100 text-red-900';
                } else if (isCorrectOption) {
                  buttonClass += 'border-green-500 bg-green-100 text-green-900 scale-105';
                } else {
                  buttonClass += 'border-slate-200 bg-slate-50 text-slate-400';
                }
              } else {
                if (isSelected) {
                  buttonClass += 'border-purple-500 bg-purple-100 text-purple-900 scale-105';
                } else {
                  buttonClass += 'border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-900 hover:scale-105';
                }
              }

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(option)}
                  className={buttonClass}
                  disabled={showFeedback}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">{option}</span>
                    {showFeedback && isCorrectOption && (
                      <span className="text-2xl">⭐</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {!showFeedback && (
          <Button
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 py-6 text-xl rounded-3xl"
            size="lg"
          >
            <span>Check Answer</span>
            <ArrowRight className="size-6 ml-2" />
          </Button>
        )}

        {showFeedback && (
          <div className={`p-6 rounded-3xl text-center ${
            isCorrect 
              ? 'bg-gradient-to-r from-green-400 to-emerald-400' 
              : 'bg-gradient-to-r from-orange-400 to-yellow-400'
          }`}>
            <p className="text-white text-2xl mb-2">
              {isCorrect ? '🎉 Correct!' : '💪 Keep trying!'}
            </p>
            <p className="text-white">
              {isCorrect ? `You earned ${question.points} points!` : 'You\'ll get it next time!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}