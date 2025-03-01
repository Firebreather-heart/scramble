import React, { useEffect, useRef } from 'react';

interface HelpCardProps {
  showHelp: boolean;
  toggleHelp: () => void;
}

const HelpCard: React.FC<HelpCardProps> = ({ showHelp, toggleHelp }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showHelp) {
        toggleHelp();
      }
    };

    if (showHelp) {
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showHelp, toggleHelp]);

  return (
    <div 
      className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 z-50 ${
        showHelp ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) toggleHelp();
      }}
    >
      <div 
        ref={cardRef}
        className={`
          bg-white rounded-lg shadow-lg w-80 max-w-md border border-green-100
          p-6 text-gray-700 transform transition-all duration-300 ease-out
          ${showHelp ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95 opacity-0'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-green-600">How to Play</h2>
          <button 
            onClick={toggleHelp}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Close help"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <p className="mb-4">Welcome to the Word Scramble game! Here are the rules:</p>
        
        <ul className="space-y-2 mb-4">
          {[
            "Unscramble the word shown on the screen.",
            "Type your answer in the input box and press Enter.",
            "If you need a hint, click the 'Show Hint' button. Using a hint will reduce the score for that word to 5 points.",
            "If you answer correctly without using a hint, you will earn 10 points.",
            "If the timer runs out and you haven't answered, you will lose 5 points.",
            "Click 'End Game' to stop the game and see your results."
          ].map((rule, index) => (
            <li key={index} className="flex items-start">
              <span className="inline-flex items-center justify-center bg-green-100 text-green-600 rounded-full h-5 w-5 text-xs font-bold mr-2 mt-0.5">
                {index + 1}
              </span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
        
        <button
          onClick={toggleHelp}
          className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors duration-200 mt-2"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};

export default HelpCard;