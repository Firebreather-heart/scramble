"use client";

import { useState, useEffect } from 'react';
import { wordList, scrambleWord, WordEntry } from '@/lib/words';
import StartButton from './startButton';
import HelpCard from './helpCard';

interface GameState {
  currentWord: WordEntry;
  scrambledWord: string;
  score: number;
  showHint: boolean;
  timeLeft: number;
}

interface QuestionResult {
  word: string;
  score: number;
}

export function Game() {
  const [selectedDomain, setSelectedDomain] = useState<keyof typeof wordList>('generalKnowledge');
  const [usedWords, setUsedWords] = useState<WordEntry[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    currentWord: wordList[selectedDomain][Math.floor(Math.random() * wordList[selectedDomain].length)],
    scrambledWord: '',
    score: 0,
    showHint: false,
    timeLeft: 30,
  });
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setGameState(state => ({
      ...state,
      scrambledWord: scrambleWord(state.currentWord.word),
    }));
  }, [gameState.currentWord]);

  useEffect(() => {
    if (gameStarted) {
      const interval = setInterval(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted, gameState.currentWord]);

  useEffect(() => {
    if (gameState.timeLeft <= 0) {
      if (userInput.trim() === '') {
        setFeedback("Penalty: -5 points!");
        const nextWord = wordList[selectedDomain][Math.floor(Math.random() * wordList[selectedDomain].length)];
        setResults(prevResults => [...prevResults, { word: gameState.currentWord.word, score: -5 }]);
        setGameState(prev => ({
          ...prev,
          score: prev.score - 5,
          currentWord: nextWord,
          scrambledWord: scrambleWord(nextWord.word),
          timeLeft: 30,
          showHint: false,
        }));
        setUserInput('');
        setTimeout(() => setFeedback(""), 2000);
      } else {
        setFeedback("Time's up!");
      }
    }
  }, [gameState.timeLeft, userInput]);

  const getRandomWord = (domain: keyof typeof wordList): WordEntry => {
    const availableWords = wordList[domain].filter(word => !usedWords.includes(word));
    if (availableWords.length === 0) {
      setUsedWords([]);
      return wordList[domain][Math.floor(Math.random() * wordList[domain].length)];
    }
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    return availableWords[randomIndex];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.toLowerCase() === gameState.currentWord.word) {
      const score = gameState.showHint ? 5 : 10;
      setFeedback('Correct!');
      setResults(prevResults => [...prevResults, { word: gameState.currentWord.word, score }]);
      setUsedWords(prev => [...prev, gameState.currentWord]);
      const newWord = getRandomWord(selectedDomain);
      setGameState(state => ({
        ...state,
        score: state.score + score,
        currentWord: newWord,
        scrambledWord: scrambleWord(newWord.word),
        timeLeft: 30,
        showHint: false,
      }));
      setUserInput('');
    } else {
      setFeedback('Try again!');
    }
  };

  const handleStart = () => {
    const newWord = getRandomWord(selectedDomain);
    setGameState(state => ({
      ...state,
      currentWord: newWord,
      scrambledWord: scrambleWord(newWord.word),
      score: 0,
      timeLeft: 30,
      showHint: false,
    }));
    setGameStarted(true);
  };

  const handleEnd = () => {
    setGameStarted(false);
    setFeedback('Game Ended');
    setTimeout(() => {
      setGameState({
        currentWord: wordList[selectedDomain][Math.floor(Math.random() * wordList[selectedDomain].length)],
        scrambledWord: '',
        score: 0,
        showHint: false,
        timeLeft: 30,
      });
      setResults([]);
      setFeedback('');
    }, 10000);
  };

  const handleShowHint = () => {
    setGameState(state => ({
      ...state,
      showHint: true,
    }));
  };

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  const handleClickOutsideHelp = () => {
    if (showHelp) {
      toggleHelp();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto" onClick={handleClickOutsideHelp}>
      {!gameStarted ? (
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
            Word Scramble
          </h1>
          <div className="flex flex-wrap justify-center">
            {Object.keys(wordList).map((domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain as keyof typeof wordList)}
                className={`m-2 p-2 border rounded-lg ${selectedDomain === domain ? 'border-green-600 text-white shadow-md shadow-lime-800' : 'border-gray-200'}`}
              >
                {domain.replace(/([A-Z])/g, ' $1')}
              </button>
            ))}
          </div>
          <StartButton onStart={handleStart} selectedDomain={selectedDomain} />
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl bg-card shadow-2xl border border-border/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="relative p-8 space-y-6">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                Word Scramble
              </h1>
              <div className="scramble-animation">
                <p className="text-5xl font-mono tracking-wider text-primary">
                  {gameState.scrambledWord}
                </p>
              </div>
              {gameState.showHint && (
                <p className="text-lg text-gray-500">Hint: {gameState.currentWord.hint}</p>
              )}
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full p-4 mb-4 text-green-500 rounded-lg focus:outline-none"
                placeholder="Your answer here"
              />
              {feedback && <p className="text-red-500 font-bold">{feedback}</p>}
            </form>
            <div className="text-center">
              <p>Score: {gameState.score}</p>
              <p>Time Left: {gameState.timeLeft}</p>
            </div>
            <div className="flex justify-between">
              <button onClick={handleShowHint} className="w-1/2 p-4 mt-4 text-white bg-blue-500 rounded-lg mr-2">
                Show Hint
              </button>
              <button onClick={handleEnd} className="w-1/2 p-4 mt-4 text-white bg-red-500 rounded-lg ml-2">
                End Game
              </button>
            </div>
          </div>
        </div>
      )}
      {!gameStarted && results.length > 0 && (
        <div className="mt-8 p-4 bg-white text-secondary rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Game Results</h2>
          <p className="mb-2">Final Score: {results.reduce((acc, result) => acc + result.score, 0)}</p>
          <ul>
            {results.map((result, index) => (
              <li key={index} className="mb-1">
                Word: {result.word}, Score: {result.score}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className='absolute top-0 right-2'>
        <button onClick={toggleHelp} className="w-full p-2 mt-4 bg-transparent rounded-lg">
          <span className="material-icons"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-info"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg></span>
        </button>
        <HelpCard showHelp={showHelp} toggleHelp={toggleHelp} />
      </div>
    </div>
  );
}