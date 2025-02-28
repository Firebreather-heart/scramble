import React from 'react';

interface HelpCardProps {
  showHelp: boolean;
  toggleHelp: () => void;
}

const HelpCard: React.FC<HelpCardProps> = ({ showHelp, toggleHelp }) => {
  return (
    <>
      {showHelp && (
        <div className="mt-4 p-4 text-secondary bg-white rounded-lg shadow-md w-72 border ">
          <h2 className="text-3xl text-center font-bold mb-4">Help</h2>
          <p className='-mt-4'>Welcome to the Word Scramble game! Here are the rules:</p>
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
    </>
  );
};

export default HelpCard;