"use client";

import { useState, useEffect } from 'react';
import { wordList, scrambleWord } from '@/lib/words';

interface GameState {
  currentWord: typeof wordList[number];
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
  const [gameState, setGameState] = useState<GameState>({
    currentWord: wordList[Math.floor(Math.random() * wordList.length)],
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
        const nextWord = wordList[Math.floor(Math.random() * wordList.length)];
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.toLowerCase() === gameState.currentWord.word) {
      const score = gameState.showHint ? 5 : 10;
      setFeedback('Correct!');
      setResults(prevResults => [...prevResults, { word: gameState.currentWord.word, score }]);
      setGameState(state => ({
        ...state,
        score: state.score + score,
        currentWord: wordList[Math.floor(Math.random() * wordList.length)],
        scrambledWord: scrambleWord(state.currentWord.word),
        timeLeft: 30,
        showHint: false,
      }));
      setUserInput('');
    } else {
      setFeedback('Try again!');
    }
  };

  const handleStart = () => {
    setGameStarted(true);
  };

  const handleEnd = () => {
    setGameStarted(false);
    setFeedback('Game Ended');
    setTimeout(() => {
      setGameState({
        currentWord: wordList[Math.floor(Math.random() * wordList.length)],
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

  return (
    <div className="w-full max-w-md mx-auto">
      {!gameStarted ? (
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
            Word Scramble
          </h1>
          <button onClick={handleStart} className="w-full p-4 mb-4 text-white bg-green-500 rounded-lg">
            Start Game
          </button>
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
      <button onClick={toggleHelp} className="w-full p-4 mt-4 bg-gray-500 rounded-lg">
        {showHelp ? 'Hide Help' : 'Show Help'}
      </button>
      {showHelp && (
        <div className="mt-4 p-4 text-secondary bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Help</h2>
          <p>Welcome to the Word Scramble game! Here are the rules:</p>
          <ul className="list-disc list-inside">
            <li>Unscramble the word shown on the screen.</li>
            <li>Type your answer in the input box and press Enter.</li>
            <li>If you need a hint, click the "Show Hint" button. Using a hint will reduce the score for that word to 5 points.</li>
            <li>If you answer correctly without using a hint, you will earn 10 points.</li>
            <li>If the timer runs out and you haven't answered, you will lose 5 points.</li>
            <li>Click "End Game" to stop the game and see your results.</li>
          </ul>
        </div>
      )}
    </div>
  );
}