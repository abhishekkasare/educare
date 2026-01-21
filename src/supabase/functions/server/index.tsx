import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Create Supabase client for auth operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Health check endpoint
app.get("/make-server-97f4c85e/health", (c) => {
  return c.json({ status: "ok" });
});

// Signup endpoint - creates user and initial profile
app.post("/make-server-97f4c85e/signup", async (c) => {
  try {
    const { name, email, password } = await c.req.json();
    
    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (authError) {
      console.error('Signup auth error:', authError);
      return c.json({ error: `Auth error during signup: ${authError.message}` }, 400);
    }

    // Create initial user profile in KV store
    const userId = authData.user.id;
    const userProfile = {
      id: userId,
      name,
      email,
      avatar: null,
      age: null,
      dob: null,
      profileCompleted: false,
      coursesCompleted: 0,
      totalPoints: 0,
      quizzesTaken: [],
      createdAt: new Date().toISOString()
    };

    await kv.set(`user:${userId}`, userProfile);

    return c.json({ 
      success: true, 
      userId,
      user: userProfile 
    });
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: `Server error during signup: ${error.message}` }, 500);
  }
});

// Login endpoint - returns user profile
app.post("/make-server-97f4c85e/login", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    // Sign in with Supabase Auth (this is handled on frontend)
    // This endpoint is for retrieving profile after login
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Login auth error:', authError);
      return c.json({ error: `Auth error during login: ${authError.message}` }, 400);
    }

    const userId = authData.user.id;
    const userProfile = await kv.get(`user:${userId}`);

    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    return c.json({ 
      success: true,
      accessToken: authData.session.access_token,
      user: userProfile 
    });
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ error: `Server error during login: ${error.message}` }, 500);
  }
});

// Complete profile endpoint - updates avatar, age, DOB
app.post("/make-server-97f4c85e/complete-profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { avatar, age, dob } = await c.req.json();
    
    const userProfile = await kv.get(`user:${user.id}`);
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    const updatedProfile = {
      ...userProfile,
      avatar,
      age,
      dob,
      profileCompleted: true
    };

    await kv.set(`user:${user.id}`, updatedProfile);

    return c.json({ 
      success: true,
      user: updatedProfile 
    });
  } catch (error) {
    console.error('Complete profile error:', error);
    return c.json({ error: `Server error completing profile: ${error.message}` }, 500);
  }
});

// Get user profile endpoint
app.get("/make-server-97f4c85e/profile/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const userProfile = await kv.get(`user:${userId}`);

    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    return c.json({ success: true, user: userProfile });
  } catch (error) {
    console.error('Get profile error:', error);
    return c.json({ error: `Server error getting profile: ${error.message}` }, 500);
  }
});

// Submit quiz endpoint - updates user points and quiz history
app.post("/make-server-97f4c85e/submit-quiz", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { category, score, totalQuestions, difficulty } = await c.req.json();
    
    const userProfile = await kv.get(`user:${user.id}`);
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    const quizResult = {
      category,
      score,
      totalQuestions,
      difficulty,
      date: new Date().toISOString()
    };

    const updatedProfile = {
      ...userProfile,
      totalPoints: userProfile.totalPoints + score,
      quizzesTaken: [...(userProfile.quizzesTaken || []), quizResult]
    };

    await kv.set(`user:${user.id}`, updatedProfile);

    return c.json({ 
      success: true,
      user: updatedProfile 
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    return c.json({ error: `Server error submitting quiz: ${error.message}` }, 500);
  }
});

// Get quiz questions endpoint - returns random questions by category
app.get("/make-server-97f4c85e/quiz-questions", async (c) => {
  try {
    const category = c.req.query('category') || 'all';
    const count = parseInt(c.req.query('count') || '10');

    // Get all quiz questions from KV store
    const allQuestions = await kv.getByPrefix('quiz:');
    
    let questions = allQuestions
      .filter(q => category === 'all' || q.category === category)
      .sort(() => Math.random() - 0.5)
      .slice(0, count);

    return c.json({ 
      success: true,
      questions 
    });
  } catch (error) {
    console.error('Get quiz questions error:', error);
    return c.json({ error: `Server error getting quiz questions: ${error.message}` }, 500);
  }
});

// Initialize quiz questions in database (call this once)
app.post("/make-server-97f4c85e/init-quiz-data", async (c) => {
  try {
    const quizQuestions = [
      // Alphabet Questions (Easy)
      { id: 'q1', category: 'alphabet', difficulty: 'easy', points: 50, question: 'Which letter comes after A?', options: ['B', 'C', 'D', 'E'], correctAnswer: 'B' },
      { id: 'q2', category: 'alphabet', difficulty: 'easy', points: 50, question: 'What is the first letter of the alphabet?', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A' },
      { id: 'q3', category: 'alphabet', difficulty: 'easy', points: 50, question: 'Which letter comes before Z?', options: ['X', 'Y', 'W', 'V'], correctAnswer: 'Y' },
      
      // Alphabet Questions (Medium)
      { id: 'q4', category: 'alphabet', difficulty: 'medium', points: 75, question: 'How many letters are in the alphabet?', options: ['24', '25', '26', '27'], correctAnswer: '26' },
      { id: 'q5', category: 'alphabet', difficulty: 'medium', points: 75, question: 'Which letter is between M and O?', options: ['L', 'N', 'P', 'K'], correctAnswer: 'N' },
      
      // Alphabet Questions (Hard)
      { id: 'q6', category: 'alphabet', difficulty: 'hard', points: 100, question: 'What is the 10th letter of the alphabet?', options: ['I', 'J', 'K', 'L'], correctAnswer: 'J' },
      
      // Number Questions (Easy)
      { id: 'q7', category: 'numbers', difficulty: 'easy', points: 50, question: 'What comes after 5?', options: ['4', '6', '7', '8'], correctAnswer: '6' },
      { id: 'q8', category: 'numbers', difficulty: 'easy', points: 50, question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correctAnswer: '4' },
      { id: 'q9', category: 'numbers', difficulty: 'easy', points: 50, question: 'Count: 1, 2, 3, __?', options: ['4', '5', '6', '7'], correctAnswer: '4' },
      
      // Number Questions (Medium)
      { id: 'q10', category: 'numbers', difficulty: 'medium', points: 75, question: 'What is 5 + 3?', options: ['6', '7', '8', '9'], correctAnswer: '8' },
      { id: 'q11', category: 'numbers', difficulty: 'medium', points: 75, question: 'What is 10 - 4?', options: ['5', '6', '7', '8'], correctAnswer: '6' },
      
      // Number Questions (Hard)
      { id: 'q12', category: 'numbers', difficulty: 'hard', points: 100, question: 'What is 7 × 2?', options: ['12', '13', '14', '15'], correctAnswer: '14' },
      
      // Fruits Questions (Easy)
      { id: 'q13', category: 'fruits', difficulty: 'easy', points: 50, question: 'What color is an apple usually?', options: ['Red', 'Blue', 'Green', 'Both Red and Green'], correctAnswer: 'Both Red and Green' },
      { id: 'q14', category: 'fruits', difficulty: 'easy', points: 50, question: 'Which fruit is yellow and long?', options: ['Apple', 'Banana', 'Orange', 'Grape'], correctAnswer: 'Banana' },
      { id: 'q15', category: 'fruits', difficulty: 'easy', points: 50, question: 'What fruit is orange in color?', options: ['Apple', 'Banana', 'Orange', 'Strawberry'], correctAnswer: 'Orange' },
      
      // Fruits Questions (Medium)
      { id: 'q16', category: 'fruits', difficulty: 'medium', points: 75, question: 'Which fruit has seeds on the outside?', options: ['Apple', 'Banana', 'Strawberry', 'Orange'], correctAnswer: 'Strawberry' },
      { id: 'q17', category: 'fruits', difficulty: 'medium', points: 75, question: 'Which fruit is known as the king of fruits?', options: ['Apple', 'Mango', 'Banana', 'Grape'], correctAnswer: 'Mango' },
      
      // Fruits Questions (Hard)
      { id: 'q18', category: 'fruits', difficulty: 'hard', points: 100, question: 'Which fruit is also called a Chinese gooseberry?', options: ['Kiwi', 'Lychee', 'Dragon Fruit', 'Papaya'], correctAnswer: 'Kiwi' },
      
      // Animals Questions (Easy)
      { id: 'q19', category: 'animals', difficulty: 'easy', points: 50, question: 'What sound does a dog make?', options: ['Meow', 'Bark', 'Moo', 'Quack'], correctAnswer: 'Bark' },
      { id: 'q20', category: 'animals', difficulty: 'easy', points: 50, question: 'What sound does a cat make?', options: ['Meow', 'Bark', 'Moo', 'Quack'], correctAnswer: 'Meow' },
      { id: 'q21', category: 'animals', difficulty: 'easy', points: 50, question: 'Which animal has a long trunk?', options: ['Lion', 'Elephant', 'Tiger', 'Bear'], correctAnswer: 'Elephant' },
      
      // Animals Questions (Medium)
      { id: 'q22', category: 'animals', difficulty: 'medium', points: 75, question: 'Which animal is known as the king of the jungle?', options: ['Tiger', 'Lion', 'Bear', 'Elephant'], correctAnswer: 'Lion' },
      { id: 'q23', category: 'animals', difficulty: 'medium', points: 75, question: 'Which bird cannot fly?', options: ['Sparrow', 'Eagle', 'Penguin', 'Parrot'], correctAnswer: 'Penguin' },
      
      // Animals Questions (Hard)
      { id: 'q24', category: 'animals', difficulty: 'hard', points: 100, question: 'What is a baby kangaroo called?', options: ['Cub', 'Joey', 'Pup', 'Kit'], correctAnswer: 'Joey' },
      
      // Vegetables Questions (Easy)
      { id: 'q25', category: 'vegetables', difficulty: 'easy', points: 50, question: 'What color is a carrot?', options: ['Red', 'Orange', 'Blue', 'Purple'], correctAnswer: 'Orange' },
      { id: 'q26', category: 'vegetables', difficulty: 'easy', points: 50, question: 'Which vegetable makes you cry when you cut it?', options: ['Potato', 'Onion', 'Tomato', 'Carrot'], correctAnswer: 'Onion' },
      { id: 'q27', category: 'vegetables', difficulty: 'easy', points: 50, question: 'What color is broccoli?', options: ['Red', 'Yellow', 'Green', 'Orange'], correctAnswer: 'Green' },
      
      // Vegetables Questions (Medium)
      { id: 'q28', category: 'vegetables', difficulty: 'medium', points: 75, question: 'Which vegetable is used to make French fries?', options: ['Carrot', 'Potato', 'Tomato', 'Onion'], correctAnswer: 'Potato' },
      { id: 'q29', category: 'vegetables', difficulty: 'medium', points: 75, question: 'Which vegetable is long and green?', options: ['Carrot', 'Potato', 'Cucumber', 'Onion'], correctAnswer: 'Cucumber' },
      
      // Vegetables Questions (Hard)
      { id: 'q30', category: 'vegetables', difficulty: 'hard', points: 100, question: 'Which vegetable is also known as aubergine?', options: ['Zucchini', 'Eggplant', 'Bell Pepper', 'Squash'], correctAnswer: 'Eggplant' },
      
      // Two Letter Words Questions (Easy)
      { id: 'q31', category: 'twoLetterWords', difficulty: 'easy', points: 50, question: 'What word means "in or to a place"?', options: ['AT', 'BY', 'OR', 'UP'], correctAnswer: 'AT' },
      { id: 'q32', category: 'twoLetterWords', difficulty: 'easy', points: 50, question: 'What word means "to move"?', options: ['DO', 'GO', 'BE', 'IS'], correctAnswer: 'GO' },
      { id: 'q33', category: 'twoLetterWords', difficulty: 'easy', points: 50, question: 'What word means "inside"?', options: ['IN', 'ON', 'UP', 'BY'], correctAnswer: 'IN' },
      
      // Two Letter Words Questions (Medium)
      { id: 'q34', category: 'twoLetterWords', difficulty: 'medium', points: 75, question: 'What word means "not any"?', options: ['NO', 'OR', 'SO', 'IF'], correctAnswer: 'NO' },
      { id: 'q35', category: 'twoLetterWords', difficulty: 'medium', points: 75, question: 'What word means "you and I"?', options: ['US', 'WE', 'ME', 'MY'], correctAnswer: 'WE' },
      
      // Two Letter Words Questions (Hard)
      { id: 'q36', category: 'twoLetterWords', difficulty: 'hard', points: 100, question: 'Which word means "in case that"?', options: ['IF', 'AS', 'OR', 'BY'], correctAnswer: 'IF' },
      
      // Three Letter Words Questions (Easy)
      { id: 'q37', category: 'threeLetterWords', difficulty: 'easy', points: 50, question: 'What is the 3-letter word for a small pet animal?', options: ['DOG', 'CAT', 'BAT', 'COW'], correctAnswer: 'CAT' },
      { id: 'q38', category: 'threeLetterWords', difficulty: 'easy', points: 50, question: 'What is the 3-letter word for a friendly pet?', options: ['DOG', 'CAT', 'FOX', 'COW'], correctAnswer: 'DOG' },
      { id: 'q39', category: 'threeLetterWords', difficulty: 'easy', points: 50, question: 'What is the 3-letter word for a bright star in sky?', options: ['SUN', 'SKY', 'TOP', 'BOX'], correctAnswer: 'SUN' },
      
      // Three Letter Words Questions (Medium)
      { id: 'q40', category: 'threeLetterWords', difficulty: 'medium', points: 75, question: 'What is the 3-letter word for "to move fast"?', options: ['RUN', 'JOY', 'FAN', 'NET'], correctAnswer: 'RUN' },
      { id: 'q41', category: 'threeLetterWords', difficulty: 'medium', points: 75, question: 'What is the 3-letter word for "happiness"?', options: ['JOY', 'RUN', 'TOY', 'KEY'], correctAnswer: 'JOY' },
      
      // Three Letter Words Questions (Hard)
      { id: 'q42', category: 'threeLetterWords', difficulty: 'hard', points: 100, question: 'What 3-letter word means "the highest part"?', options: ['TOP', 'NET', 'MAP', 'BOX'], correctAnswer: 'TOP' },
    ];

    // Store each question in KV store
    for (const question of quizQuestions) {
      await kv.set(`quiz:${question.id}`, question);
    }

    return c.json({ 
      success: true,
      message: `${quizQuestions.length} quiz questions initialized` 
    });
  } catch (error) {
    console.error('Init quiz data error:', error);
    return c.json({ error: `Server error initializing quiz data: ${error.message}` }, 500);
  }
});

// Update profile endpoint - updates name and profile photo
app.post("/make-server-97f4c85e/update-profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const body = await c.req.formData();
    const name = body.get('name') as string;
    const photo = body.get('photo') as File | null;
    
    const userProfile = await kv.get(`user:${user.id}`);
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    let photoUrl = userProfile.photoUrl;

    // Handle photo upload (store as base64 in KV for simplicity)
    if (photo) {
      const arrayBuffer = await photo.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      photoUrl = `data:${photo.type};base64,${base64}`;
    }

    const updatedProfile = {
      ...userProfile,
      name: name || userProfile.name,
      photoUrl: photoUrl
    };

    await kv.set(`user:${user.id}`, updatedProfile);

    return c.json({ 
      success: true,
      user: updatedProfile 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return c.json({ error: `Server error updating profile: ${error.message}` }, 500);
  }
});

// Change password endpoint
app.post("/make-server-97f4c85e/change-password", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { currentPassword, newPassword } = await c.req.json();

    // Verify current password by attempting to sign in
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const userProfile = await kv.get(`user:${user.id}`);
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    const { error: signInError } = await supabaseClient.auth.signInWithPassword({
      email: userProfile.email,
      password: currentPassword,
    });

    if (signInError) {
      return c.json({ error: 'Current password is incorrect' }, 400);
    }

    // Update password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('Password update error:', updateError);
      return c.json({ error: `Error updating password: ${updateError.message}` }, 400);
    }

    return c.json({ 
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return c.json({ error: `Server error changing password: ${error.message}` }, 500);
  }
});

// Delete account endpoint
app.delete("/make-server-97f4c85e/delete-account", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Delete user profile from KV store
    await kv.del(`user:${user.id}`);

    // Delete user quizzes if any
    const userQuizzes = await kv.getByPrefix(`userquiz:${user.id}:`);
    for (const quiz of userQuizzes) {
      await kv.del(quiz.key);
    }

    // Delete user from Supabase Auth
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
    
    if (deleteError) {
      console.error('User deletion error:', deleteError);
      return c.json({ error: `Error deleting user: ${deleteError.message}` }, 400);
    }

    return c.json({ 
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    return c.json({ error: `Server error deleting account: ${error.message}` }, 500);
  }
});

// Save activity score endpoint - for puzzles, music, and games
app.post("/make-server-97f4c85e/save-activity-score", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (!user?.id || authError) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { activityType, activityName, score } = await c.req.json();
    
    const userProfile = await kv.get(`user:${user.id}`);
    if (!userProfile) {
      return c.json({ error: 'User profile not found' }, 404);
    }

    const activityResult = {
      activityType,
      activityName,
      score,
      date: new Date().toISOString()
    };

    // Initialize activities array if it doesn't exist
    const activities = userProfile.activities || [];
    activities.push(activityResult);

    const updatedProfile = {
      ...userProfile,
      totalPoints: userProfile.totalPoints + score,
      activities: activities
    };

    await kv.set(`user:${user.id}`, updatedProfile);

    return c.json({ 
      success: true,
      user: updatedProfile 
    });
  } catch (error) {
    console.error('Save activity score error:', error);
    return c.json({ error: `Server error saving activity score: ${error.message}` }, 500);
  }
});

Deno.serve(app.fetch);