type Difficulty = 'easy' | 'medium' | 'hard';
type Category = 'all' | 'alphabet' | 'numbers' | 'fruits' | 'animals' | 'vegetables' | 'twoLetterWords' | 'threeLetterWords';

export interface Question {
  id: string;
  category: string;
  difficulty: Difficulty;
  points: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export const allQuizQuestions: Question[] = [
  // Alphabet Questions (Easy)
  { id: 'q1', category: 'alphabet', difficulty: 'easy', points: 50, question: 'Which letter comes after A?', options: ['B', 'C', 'D', 'E'], correctAnswer: 'B' },
  { id: 'q2', category: 'alphabet', difficulty: 'easy', points: 50, question: 'What is the first letter of the alphabet?', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A' },
  { id: 'q3', category: 'alphabet', difficulty: 'easy', points: 50, question: 'Which letter comes before Z?', options: ['X', 'Y', 'W', 'V'], correctAnswer: 'Y' },
  { id: 'q4', category: 'alphabet', difficulty: 'easy', points: 50, question: 'What letter comes after C?', options: ['D', 'E', 'F', 'G'], correctAnswer: 'D' },
  { id: 'q5', category: 'alphabet', difficulty: 'easy', points: 50, question: 'Which is a vowel?', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A' },
  
  // Alphabet Questions (Medium)
  { id: 'q6', category: 'alphabet', difficulty: 'medium', points: 75, question: 'How many letters are in the alphabet?', options: ['24', '25', '26', '27'], correctAnswer: '26' },
  { id: 'q7', category: 'alphabet', difficulty: 'medium', points: 75, question: 'Which letter is between M and O?', options: ['L', 'N', 'P', 'K'], correctAnswer: 'N' },
  { id: 'q8', category: 'alphabet', difficulty: 'medium', points: 75, question: 'How many vowels are there?', options: ['3', '4', '5', '6'], correctAnswer: '5' },
  { id: 'q9', category: 'alphabet', difficulty: 'medium', points: 75, question: 'Which letter comes after P?', options: ['O', 'Q', 'R', 'S'], correctAnswer: 'Q' },
  
  // Alphabet Questions (Hard)
  { id: 'q10', category: 'alphabet', difficulty: 'hard', points: 100, question: 'What is the 10th letter of the alphabet?', options: ['I', 'J', 'K', 'L'], correctAnswer: 'J' },
  { id: 'q11', category: 'alphabet', difficulty: 'hard', points: 100, question: 'What is the 5th letter of the alphabet?', options: ['D', 'E', 'F', 'G'], correctAnswer: 'E' },
  { id: 'q12', category: 'alphabet', difficulty: 'hard', points: 100, question: 'What is the 20th letter?', options: ['S', 'T', 'U', 'V'], correctAnswer: 'T' },
  
  // Number Questions (Easy)
  { id: 'q13', category: 'numbers', difficulty: 'easy', points: 50, question: 'What comes after 5?', options: ['4', '6', '7', '8'], correctAnswer: '6' },
  { id: 'q14', category: 'numbers', difficulty: 'easy', points: 50, question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correctAnswer: '4' },
  { id: 'q15', category: 'numbers', difficulty: 'easy', points: 50, question: 'Count: 1, 2, 3, __?', options: ['4', '5', '6', '7'], correctAnswer: '4' },
  { id: 'q16', category: 'numbers', difficulty: 'easy', points: 50, question: 'What is 1 + 1?', options: ['1', '2', '3', '4'], correctAnswer: '2' },
  { id: 'q17', category: 'numbers', difficulty: 'easy', points: 50, question: 'What comes before 10?', options: ['8', '9', '11', '12'], correctAnswer: '9' },
  
  // Number Questions (Medium)
  { id: 'q18', category: 'numbers', difficulty: 'medium', points: 75, question: 'What is 5 + 3?', options: ['6', '7', '8', '9'], correctAnswer: '8' },
  { id: 'q19', category: 'numbers', difficulty: 'medium', points: 75, question: 'What is 10 - 4?', options: ['5', '6', '7', '8'], correctAnswer: '6' },
  { id: 'q20', category: 'numbers', difficulty: 'medium', points: 75, question: 'What is 3 + 4?', options: ['6', '7', '8', '9'], correctAnswer: '7' },
  { id: 'q21', category: 'numbers', difficulty: 'medium', points: 75, question: 'What is 9 - 3?', options: ['5', '6', '7', '8'], correctAnswer: '6' },
  
  // Number Questions (Hard)
  { id: 'q22', category: 'numbers', difficulty: 'hard', points: 100, question: 'What is 7 × 2?', options: ['12', '13', '14', '15'], correctAnswer: '14' },
  { id: 'q23', category: 'numbers', difficulty: 'hard', points: 100, question: 'What is 15 - 8?', options: ['6', '7', '8', '9'], correctAnswer: '7' },
  { id: 'q24', category: 'numbers', difficulty: 'hard', points: 100, question: 'What is 4 × 3?', options: ['10', '11', '12', '13'], correctAnswer: '12' },
  
  // Fruits Questions (Easy)
  { id: 'q25', category: 'fruits', difficulty: 'easy', points: 50, question: 'What color is an apple usually?', options: ['Red', 'Blue', 'Green', 'Red or Green'], correctAnswer: 'Red or Green' },
  { id: 'q26', category: 'fruits', difficulty: 'easy', points: 50, question: 'Which fruit is yellow and long?', options: ['Apple', 'Banana', 'Orange', 'Grape'], correctAnswer: 'Banana' },
  { id: 'q27', category: 'fruits', difficulty: 'easy', points: 50, question: 'What fruit is orange in color?', options: ['Apple', 'Banana', 'Orange', 'Strawberry'], correctAnswer: 'Orange' },
  { id: 'q28', category: 'fruits', difficulty: 'easy', points: 50, question: 'Which fruit is red and round?', options: ['Banana', 'Apple', 'Pear', 'Lemon'], correctAnswer: 'Apple' },
  { id: 'q29', category: 'fruits', difficulty: 'easy', points: 50, question: 'Which fruit is small and purple?', options: ['Apple', 'Grape', 'Orange', 'Banana'], correctAnswer: 'Grape' },
  
  // Fruits Questions (Medium)
  { id: 'q30', category: 'fruits', difficulty: 'medium', points: 75, question: 'Which fruit has seeds on the outside?', options: ['Apple', 'Banana', 'Strawberry', 'Orange'], correctAnswer: 'Strawberry' },
  { id: 'q31', category: 'fruits', difficulty: 'medium', points: 75, question: 'Which fruit is known as the king of fruits?', options: ['Apple', 'Mango', 'Banana', 'Grape'], correctAnswer: 'Mango' },
  { id: 'q32', category: 'fruits', difficulty: 'medium', points: 75, question: 'Which fruit is sour and yellow?', options: ['Lemon', 'Banana', 'Mango', 'Apple'], correctAnswer: 'Lemon' },
  { id: 'q33', category: 'fruits', difficulty: 'medium', points: 75, question: 'Which fruit has a fuzzy skin?', options: ['Peach', 'Apple', 'Orange', 'Banana'], correctAnswer: 'Peach' },
  
  // Fruits Questions (Hard)
  { id: 'q34', category: 'fruits', difficulty: 'hard', points: 100, question: 'Which fruit is also called a Chinese gooseberry?', options: ['Kiwi', 'Lychee', 'Dragon Fruit', 'Papaya'], correctAnswer: 'Kiwi' },
  { id: 'q35', category: 'fruits', difficulty: 'hard', points: 100, question: 'Which fruit is used to make wine?', options: ['Apple', 'Grape', 'Orange', 'Lemon'], correctAnswer: 'Grape' },
  { id: 'q36', category: 'fruits', difficulty: 'hard', points: 100, question: 'Which fruit is native to South America?', options: ['Pineapple', 'Apple', 'Orange', 'Grape'], correctAnswer: 'Pineapple' },
  
  // Animals Questions (Easy)
  { id: 'q37', category: 'animals', difficulty: 'easy', points: 50, question: 'What sound does a dog make?', options: ['Meow', 'Bark', 'Moo', 'Quack'], correctAnswer: 'Bark' },
  { id: 'q38', category: 'animals', difficulty: 'easy', points: 50, question: 'What sound does a cat make?', options: ['Meow', 'Bark', 'Moo', 'Quack'], correctAnswer: 'Meow' },
  { id: 'q39', category: 'animals', difficulty: 'easy', points: 50, question: 'Which animal has a long trunk?', options: ['Lion', 'Elephant', 'Tiger', 'Bear'], correctAnswer: 'Elephant' },
  { id: 'q40', category: 'animals', difficulty: 'easy', points: 50, question: 'What sound does a cow make?', options: ['Meow', 'Bark', 'Moo', 'Quack'], correctAnswer: 'Moo' },
  { id: 'q41', category: 'animals', difficulty: 'easy', points: 50, question: 'What sound does a duck make?', options: ['Meow', 'Bark', 'Moo', 'Quack'], correctAnswer: 'Quack' },
  
  // Animals Questions (Medium)
  { id: 'q42', category: 'animals', difficulty: 'medium', points: 75, question: 'Which animal is known as the king of the jungle?', options: ['Tiger', 'Lion', 'Bear', 'Elephant'], correctAnswer: 'Lion' },
  { id: 'q43', category: 'animals', difficulty: 'medium', points: 75, question: 'Which bird cannot fly?', options: ['Sparrow', 'Eagle', 'Penguin', 'Parrot'], correctAnswer: 'Penguin' },
  { id: 'q44', category: 'animals', difficulty: 'medium', points: 75, question: 'Which animal has black and white stripes?', options: ['Lion', 'Zebra', 'Elephant', 'Bear'], correctAnswer: 'Zebra' },
  { id: 'q45', category: 'animals', difficulty: 'medium', points: 75, question: 'Which animal has a long neck?', options: ['Giraffe', 'Elephant', 'Lion', 'Bear'], correctAnswer: 'Giraffe' },
  
  // Animals Questions (Hard)
  { id: 'q46', category: 'animals', difficulty: 'hard', points: 100, question: 'What is a baby kangaroo called?', options: ['Cub', 'Joey', 'Pup', 'Kit'], correctAnswer: 'Joey' },
  { id: 'q47', category: 'animals', difficulty: 'hard', points: 100, question: 'Which animal can change its color?', options: ['Lion', 'Chameleon', 'Bear', 'Dog'], correctAnswer: 'Chameleon' },
  { id: 'q48', category: 'animals', difficulty: 'hard', points: 100, question: 'What is a group of lions called?', options: ['Pack', 'Herd', 'Pride', 'Flock'], correctAnswer: 'Pride' },
  
  // Vegetables Questions (Easy)
  { id: 'q49', category: 'vegetables', difficulty: 'easy', points: 50, question: 'What color is a carrot?', options: ['Red', 'Orange', 'Blue', 'Purple'], correctAnswer: 'Orange' },
  { id: 'q50', category: 'vegetables', difficulty: 'easy', points: 50, question: 'Which vegetable makes you cry when you cut it?', options: ['Potato', 'Onion', 'Tomato', 'Carrot'], correctAnswer: 'Onion' },
  { id: 'q51', category: 'vegetables', difficulty: 'easy', points: 50, question: 'What color is broccoli?', options: ['Red', 'Yellow', 'Green', 'Orange'], correctAnswer: 'Green' },
  { id: 'q52', category: 'vegetables', difficulty: 'easy', points: 50, question: 'What color is a tomato?', options: ['Red', 'Yellow', 'Green', 'Blue'], correctAnswer: 'Red' },
  { id: 'q53', category: 'vegetables', difficulty: 'easy', points: 50, question: 'Which vegetable is long and orange?', options: ['Carrot', 'Potato', 'Onion', 'Peas'], correctAnswer: 'Carrot' },
  
  // Vegetables Questions (Medium)
  { id: 'q54', category: 'vegetables', difficulty: 'medium', points: 75, question: 'Which vegetable is used to make French fries?', options: ['Carrot', 'Potato', 'Tomato', 'Onion'], correctAnswer: 'Potato' },
  { id: 'q55', category: 'vegetables', difficulty: 'medium', points: 75, question: 'Which vegetable is long and green?', options: ['Carrot', 'Potato', 'Cucumber', 'Onion'], correctAnswer: 'Cucumber' },
  { id: 'q56', category: 'vegetables', difficulty: 'medium', points: 75, question: 'Which vegetable grows underground?', options: ['Tomato', 'Potato', 'Broccoli', 'Lettuce'], correctAnswer: 'Potato' },
  { id: 'q57', category: 'vegetables', difficulty: 'medium', points: 75, question: 'Which vegetable is in a salad?', options: ['Candy', 'Lettuce', 'Cookie', 'Cake'], correctAnswer: 'Lettuce' },
  
  // Vegetables Questions (Hard)
  { id: 'q58', category: 'vegetables', difficulty: 'hard', points: 100, question: 'Which vegetable is also known as aubergine?', options: ['Zucchini', 'Eggplant', 'Bell Pepper', 'Squash'], correctAnswer: 'Eggplant' },
  { id: 'q59', category: 'vegetables', difficulty: 'hard', points: 100, question: 'Which vegetable is used to make pickles?', options: ['Tomato', 'Cucumber', 'Carrot', 'Onion'], correctAnswer: 'Cucumber' },
  { id: 'q60', category: 'vegetables', difficulty: 'hard', points: 100, question: 'Which vegetable looks like a tiny tree?', options: ['Carrot', 'Broccoli', 'Onion', 'Potato'], correctAnswer: 'Broccoli' },
  
  // Two Letter Words Questions (Easy)
  { id: 'q61', category: 'twoLetterWords', difficulty: 'easy', points: 50, question: 'What word means "in or to a place"?', options: ['AT', 'BY', 'OR', 'UP'], correctAnswer: 'AT' },
  { id: 'q62', category: 'twoLetterWords', difficulty: 'easy', points: 50, question: 'What word means "to move"?', options: ['DO', 'GO', 'BE', 'IS'], correctAnswer: 'GO' },
  { id: 'q63', category: 'twoLetterWords', difficulty: 'easy', points: 50, question: 'What word means "inside"?', options: ['IN', 'ON', 'UP', 'BY'], correctAnswer: 'IN' },
  { id: 'q64', category: 'twoLetterWords', difficulty: 'easy', points: 50, question: 'What word means "on top of"?', options: ['IN', 'ON', 'UP', 'BY'], correctAnswer: 'ON' },
  { id: 'q65', category: 'twoLetterWords', difficulty: 'easy', points: 50, question: 'What word means "toward a higher position"?', options: ['IN', 'ON', 'UP', 'BY'], correctAnswer: 'UP' },
  
  // Two Letter Words Questions (Medium)
  { id: 'q66', category: 'twoLetterWords', difficulty: 'medium', points: 75, question: 'What word means "not any"?', options: ['NO', 'OR', 'SO', 'IF'], correctAnswer: 'NO' },
  { id: 'q67', category: 'twoLetterWords', difficulty: 'medium', points: 75, question: 'What word means "you and I"?', options: ['US', 'WE', 'ME', 'MY'], correctAnswer: 'WE' },
  { id: 'q68', category: 'twoLetterWords', difficulty: 'medium', points: 75, question: 'What word means "me and others"?', options: ['US', 'WE', 'ME', 'MY'], correctAnswer: 'US' },
  { id: 'q69', category: 'twoLetterWords', difficulty: 'medium', points: 75, question: 'What word means "therefore"?', options: ['NO', 'OR', 'SO', 'IF'], correctAnswer: 'SO' },
  
  // Two Letter Words Questions (Hard)
  { id: 'q70', category: 'twoLetterWords', difficulty: 'hard', points: 100, question: 'Which word means "in case that"?', options: ['IF', 'AS', 'OR', 'BY'], correctAnswer: 'IF' },
  { id: 'q71', category: 'twoLetterWords', difficulty: 'hard', points: 100, question: 'Which word means "in the same way"?', options: ['IF', 'AS', 'OR', 'BY'], correctAnswer: 'AS' },
  { id: 'q72', category: 'twoLetterWords', difficulty: 'hard', points: 100, question: 'Which word means "next to"?', options: ['IF', 'AS', 'OR', 'BY'], correctAnswer: 'BY' },
  
  // Three Letter Words Questions (Easy)
  { id: 'q73', category: 'threeLetterWords', difficulty: 'easy', points: 50, question: 'What is the 3-letter word for a small pet animal?', options: ['DOG', 'CAT', 'BAT', 'COW'], correctAnswer: 'CAT' },
  { id: 'q74', category: 'threeLetterWords', difficulty: 'easy', points: 50, question: 'What is the 3-letter word for a friendly pet?', options: ['DOG', 'CAT', 'FOX', 'COW'], correctAnswer: 'DOG' },
  { id: 'q75', category: 'threeLetterWords', difficulty: 'easy', points: 50, question: 'What is the 3-letter word for a bright star in sky?', options: ['SUN', 'SKY', 'TOP', 'BOX'], correctAnswer: 'SUN' },
  { id: 'q76', category: 'threeLetterWords', difficulty: 'easy', points: 50, question: 'What is the 3-letter word for a farm animal?', options: ['DOG', 'CAT', 'COW', 'FOX'], correctAnswer: 'COW' },
  { id: 'q77', category: 'threeLetterWords', difficulty: 'easy', points: 50, question: 'What is the 3-letter word for "a flying animal that hunts at night"?', options: ['DOG', 'CAT', 'BAT', 'COW'], correctAnswer: 'BAT' },
  
  // Three Letter Words Questions (Medium)
  { id: 'q78', category: 'threeLetterWords', difficulty: 'medium', points: 75, question: 'What is the 3-letter word for "to move fast"?', options: ['RUN', 'JOY', 'FAN', 'NET'], correctAnswer: 'RUN' },
  { id: 'q79', category: 'threeLetterWords', difficulty: 'medium', points: 75, question: 'What is the 3-letter word for "happiness"?', options: ['JOY', 'RUN', 'TOY', 'KEY'], correctAnswer: 'JOY' },
  { id: 'q80', category: 'threeLetterWords', difficulty: 'medium', points: 75, question: 'What is the 3-letter word for "something to play with"?', options: ['JOY', 'RUN', 'TOY', 'KEY'], correctAnswer: 'TOY' },
  { id: 'q81', category: 'threeLetterWords', difficulty: 'medium', points: 75, question: 'What is the 3-letter word for "something that opens doors"?', options: ['JOY', 'RUN', 'TOY', 'KEY'], correctAnswer: 'KEY' },
  
  // Three Letter Words Questions (Hard)
  { id: 'q82', category: 'threeLetterWords', difficulty: 'hard', points: 100, question: 'What 3-letter word means "the highest part"?', options: ['TOP', 'NET', 'MAP', 'BOX'], correctAnswer: 'TOP' },
  { id: 'q83', category: 'threeLetterWords', difficulty: 'hard', points: 100, question: 'What 3-letter word means "a drawing of an area"?', options: ['TOP', 'NET', 'MAP', 'BOX'], correctAnswer: 'MAP' },
  { id: 'q84', category: 'threeLetterWords', difficulty: 'hard', points: 100, question: 'What 3-letter word means "a container"?', options: ['TOP', 'NET', 'MAP', 'BOX'], correctAnswer: 'BOX' },
];

export function getQuizQuestions(category: Category, count: number = 10): Question[] {
  let filteredQuestions = category === 'all' 
    ? allQuizQuestions 
    : allQuizQuestions.filter(q => q.category === category);

  // Shuffle questions
  const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
  
  // Return requested count
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
