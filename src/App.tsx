import { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { AuthScreen } from './components/AuthScreen';
import { ProfileCreationScreen } from './components/ProfileCreationScreen';
import { HomeScreen } from './components/HomeScreen';
import { AlphabetScreen } from './components/AlphabetScreen';
import { NumbersScreen } from './components/NumbersScreen';
import { FruitsScreen } from './components/FruitsScreen';
import { AnimalsScreen } from './components/AnimalsScreen';
import { VegetablesScreen } from './components/VegetablesScreen';
import { VideosScreen } from './components/VideosScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { EnhancedQuizScreen } from './components/EnhancedQuizScreen';
import { AccountSettingsScreen } from './components/AccountSettingsScreen';
import { HelpSupportScreen } from './components/HelpSupportScreen';
import { StoriesScreen } from './components/StoriesScreen';
import { PoetryScreen } from './components/PoetryScreen';
import { ShapesScreen } from './components/ShapesScreen';
import { NumberSpellingScreen } from './components/NumberSpellingScreen';
import { PuzzlesScreen } from './components/PuzzlesScreen';
import { MusicRhythmScreen } from './components/MusicRhythmScreen';
import { GamesScreen } from './components/GamesScreen';
import { TwoLetterWordsScreen } from './components/TwoLetterWordsScreen';
import { ThreeLetterWordsScreen } from './components/ThreeLetterWordsScreen';
import { SEOHead } from './components/SEOHead';
import { projectId, publicAnonKey } from './utils/supabase/info.tsx';

export type Screen = 'splash' | 'auth' | 'profileCreation' | 'home' | 'alphabet' | 'numbers' | 'fruits' | 'animals' | 'vegetables' | 'videos' | 'profile' | 'quiz' | 'accountSettings' | 'helpSupport' | 'stories' | 'poetry' | 'shapes' | 'numberSpelling' | 'puzzles' | 'musicRhythm' | 'games' | 'twoLetterWords' | 'threeLetterWords';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  age?: number;
  dob?: string;
  profileCompleted?: boolean;
  coursesCompleted: number;
  totalPoints: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Check for saved session on mount
  useEffect(() => {
    const checkSavedSession = async () => {
      const savedToken = localStorage.getItem('educare_access_token');
      const savedUserId = localStorage.getItem('educare_user_id');
      
      if (savedToken && savedUserId) {
        try {
          // Verify token and get user profile
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-97f4c85e/profile/${savedUserId}`,
            {
              headers: {
                'Authorization': `Bearer ${publicAnonKey}`,
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.user) {
              setAccessToken(savedToken);
              setUser(data.user);
              setCurrentScreen('home');
              return;
            }
          }
        } catch (error) {
          console.error('Error restoring session:', error);
        }
        
        // Clear invalid session
        localStorage.removeItem('educare_access_token');
        localStorage.removeItem('educare_user_id');
      }
    };

    checkSavedSession();
  }, []);

  useEffect(() => {
    // Splash screen duration
    const timer = setTimeout(() => {
      // Only navigate to auth if no user is logged in
      if (!user) {
        setCurrentScreen('auth');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [user]);

  // Initialize quiz data on first load (call once to populate database)
  useEffect(() => {
    const initQuizData = async () => {
      const hasInitialized = localStorage.getItem('quiz_data_initialized');
      if (!hasInitialized) {
        try {
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-97f4c85e/init-quiz-data`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${publicAnonKey}`,
              },
            }
          );
          
          if (response.ok) {
            localStorage.setItem('quiz_data_initialized', 'true');
            console.log('Quiz data initialized successfully');
          }
        } catch (error) {
          console.error('Error initializing quiz data:', error);
        }
      }
    };

    initQuizData();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-97f4c85e/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      setAccessToken(data.accessToken);
      setUser(data.user);
      
      // Save session to localStorage
      localStorage.setItem('educare_access_token', data.accessToken);
      localStorage.setItem('educare_user_id', data.user.id);
      
      // Check if profile is completed
      if (data.user.profileCompleted) {
        setCurrentScreen('home');
      } else {
        setCurrentScreen('profileCreation');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-97f4c85e/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Signup failed');
        setLoading(false);
        return;
      }

      setUser(data.user);
      setCurrentScreen('profileCreation');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async (avatar: string, age: number, dob: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-97f4c85e/complete-profile`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ avatar, age, dob }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Profile update failed');
        setLoading(false);
        return;
      }

      setUser(data.user);
      // Profile creation screen will show success and then redirect
    } catch (error) {
      console.error('Profile completion error:', error);
      alert('Profile update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear saved session
    localStorage.removeItem('educare_access_token');
    localStorage.removeItem('educare_user_id');
    
    setUser(null);
    setAccessToken(null);
    setCurrentScreen('auth');
  };

  const navigateToScreen = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const updateUserPoints = (points: number) => {
    if (user) {
      setUser({
        ...user,
        totalPoints: user.totalPoints + points
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SEOHead />
      {/* Mobile App Container */}
      <div className="mx-auto max-w-md min-h-screen bg-white shadow-xl relative">
        {currentScreen === 'splash' && <SplashScreen />}
        
        {currentScreen === 'auth' && (
          <AuthScreen onLogin={handleLogin} onSignup={handleSignup} />
        )}
        
        {currentScreen === 'profileCreation' && user && (
          <ProfileCreationScreen
            userId={user.id}
            userName={user.name}
            onComplete={handleCompleteProfile}
          />
        )}
        
        {currentScreen === 'home' && user && (
          <HomeScreen 
            user={user} 
            onNavigate={navigateToScreen}
          />
        )}
        
        {currentScreen === 'alphabet' && (
          <AlphabetScreen onNavigate={navigateToScreen} />
        )}
        
        {currentScreen === 'numbers' && (
          <NumbersScreen onNavigate={navigateToScreen} />
        )}
        
        {currentScreen === 'fruits' && (
          <FruitsScreen onNavigate={navigateToScreen} />
        )}
        
        {currentScreen === 'animals' && (
          <AnimalsScreen onNavigate={navigateToScreen} />
        )}
        
        {currentScreen === 'vegetables' && (
          <VegetablesScreen onNavigate={navigateToScreen} />
        )}
        
        {currentScreen === 'videos' && (
          <VideosScreen onNavigate={navigateToScreen} />
        )}
        
        {currentScreen === 'profile' && user && (
          <ProfileScreen 
            user={user} 
            onNavigate={navigateToScreen}
            onLogout={handleLogout}
          />
        )}
        
        {currentScreen === 'quiz' && user && (
          <EnhancedQuizScreen 
            user={user} 
            onNavigate={navigateToScreen}
            onUpdatePoints={updateUserPoints}
            accessToken={accessToken || undefined}
          />
        )}

        {currentScreen === 'accountSettings' && user && (
          <AccountSettingsScreen 
            user={user} 
            accessToken={accessToken}
            onNavigate={navigateToScreen}
            onUpdateUser={setUser}
            onLogout={handleLogout}
          />
        )}

        {currentScreen === 'helpSupport' && (
          <HelpSupportScreen 
            onNavigate={navigateToScreen}
          />
        )}

        {currentScreen === 'stories' && (
          <StoriesScreen onNavigate={navigateToScreen} />
        )}

        {currentScreen === 'poetry' && (
          <PoetryScreen onNavigate={navigateToScreen} />
        )}

        {currentScreen === 'shapes' && (
          <ShapesScreen onNavigate={navigateToScreen} />
        )}

        {currentScreen === 'numberSpelling' && (
          <NumberSpellingScreen onNavigate={navigateToScreen} />
        )}

        {currentScreen === 'puzzles' && user && (
          <PuzzlesScreen 
            onNavigate={navigateToScreen}
            userId={user.id}
            accessToken={accessToken || undefined}
          />
        )}

        {currentScreen === 'musicRhythm' && user && (
          <MusicRhythmScreen 
            onNavigate={navigateToScreen}
            userId={user.id}
            accessToken={accessToken || undefined}
          />
        )}

        {currentScreen === 'games' && user && (
          <GamesScreen 
            onNavigate={navigateToScreen}
            userId={user.id}
            accessToken={accessToken || undefined}
          />
        )}

        {currentScreen === 'twoLetterWords' && (
          <TwoLetterWordsScreen onNavigate={navigateToScreen} />
        )}

        {currentScreen === 'threeLetterWords' && (
          <ThreeLetterWordsScreen onNavigate={navigateToScreen} />
        )}

        {/* Bottom Navigation - Only show when logged in and profile completed */}
        {user && user.profileCompleted && currentScreen !== 'splash' && currentScreen !== 'auth' && currentScreen !== 'profileCreation' && (
          <BottomNavigation 
            currentScreen={currentScreen} 
            onNavigate={navigateToScreen}
          />
        )}
      </div>
    </div>
  );
}

function BottomNavigation({ 
  currentScreen, 
  onNavigate 
}: { 
  currentScreen: Screen; 
  onNavigate: (screen: string) => void;
}) {
  const navItems = [
    { screen: 'home', icon: '🏠', label: 'Home' },
    { screen: 'quiz', icon: '🎯', label: 'Quiz' },
    { screen: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-200 px-4 py-3 safe-area-inset-bottom z-20">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.screen}
            onClick={() => onNavigate(item.screen)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
              currentScreen === item.screen
                ? 'text-blue-600 bg-blue-50'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}