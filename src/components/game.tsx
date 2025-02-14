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

export function Game() {
  const [gameState, setGameState] = useState<GameState>({
    currentWord: wordList[0],
    scrambledWord: '',
    score: 0,
    showHint: false,
    timeLeft: 30,
  });
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setGameState(state => ({
      ...state,
      scrambledWord: scrambleWord(state.currentWord.word),
    }));
  }, [gameState.currentWord]);

  useEffect(() => {
    setGameState(s => ({ ...s, timeLeft: 30 }));
    const interval = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          clearInterval(interval);
          return { ...prev, timeLeft: 0, feedback: "Time's up!" };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState.currentWord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.toLowerCase() === gameState.currentWord.word) {
      setFeedback('Correct!');
      setGameState(state => ({
        ...state,
        score: state.score + 10,
        currentWord: wordList[Math.floor(Math.random() * wordList.length)],
        showHint: false,
      }));
      setUserInput('');
    } else {
      setFeedback('Try again!');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
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

            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
                Score: {gameState.score}
              </span>
              <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground">
                Time: {gameState.timeLeft}s
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="game-input"
              placeholder="Type your guess here..."
              autoComplete="off"
              autoFocus
            />
            
            <div className="flex gap-2">
              <button type="submit" className="primary-button flex-1">
                Submit
              </button>
              <button 
                type="button"
                onClick={() => setGameState(s => ({ ...s, showHint: true }))}
                className="secondary-button"
              >
                Hint
              </button>
            </div>
          </form>

          {feedback && (
            <div className="scramble-animation text-center font-medium">
              <p className={feedback === 'Correct!' ? 'text-green-600' : 'text-primary'}>
                {feedback}
              </p>
            </div>
          )}
          
          {gameState.showHint && (
            <div className="scramble-animation text-center">
              <p className="text-secondary-foreground/80 text-sm">
                Hint: {gameState.currentWord.hint}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
