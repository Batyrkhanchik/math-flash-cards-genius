
import { useState, useEffect } from 'react';
import { Formula } from '../utils/mathFormulas';
import { Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FlashCardProps {
  formula: Formula;
  onShowHint: (hint: string) => void;
  isAnswerChecked: boolean;
  onAnswered: (correct: boolean) => void;
}

const FlashCard = ({ formula, onShowHint, isAnswerChecked, onAnswered }: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);

  // Reset card state when formula changes
  useEffect(() => {
    setIsFlipped(false);
    setHasCheckedAnswer(false);
  }, [formula]);

  // Check if user has viewed the answer when tracking progress
  useEffect(() => {
    if (isFlipped && isAnswerChecked && !hasCheckedAnswer) {
      setHasCheckedAnswer(true);
      onAnswered(true); // Mark as answered when flipped
    }
  }, [isFlipped, isAnswerChecked, hasCheckedAnswer, onAnswered]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleHint = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card flip
    if (formula.hint) {
      onShowHint(formula.hint);
    }
  };

  return (
    <div 
      className={`flip-card w-full max-w-md h-80 mx-auto cursor-pointer ${isFlipped ? 'flipped' : ''}`}
      onClick={handleFlip}
    >
      <div className="flip-card-inner rounded-xl shadow-lg">
        {/* Front of card */}
        <div className="flip-card-front bg-white p-6 rounded-xl flex flex-col">
          <div className="flex justify-between items-start">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-neutral-gray hover:text-math-purple flex items-center gap-1 p-1"
              onClick={handleHint}
            >
              <Lightbulb size={16} />
              <span className="text-xs">Get a hint</span>
            </Button>
          </div>

          <div className="flex-grow flex flex-col items-center justify-center">
            <h3 className="text-xl font-semibold text-dark-purple mb-4">{formula.title}</h3>
            <p className="text-lg text-center">{formula.question}</p>
          </div>

          <div className="text-xs text-neutral-gray text-center">
            Нажмите, чтобы увидеть ответ
          </div>
        </div>

        {/* Back of card */}
        <div className="flip-card-back bg-gradient-to-br from-light-purple to-math-purple p-6 rounded-xl flex flex-col">
          <div className="flex justify-between items-start">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:text-white/80 flex items-center gap-1 p-1"
              onClick={handleHint}
            >
              <Lightbulb size={16} />
              <span className="text-xs">Get a hint</span>
            </Button>
          </div>
          
          <div className="flex-grow flex flex-col items-center justify-center">
            <h3 className="text-xl font-semibold text-white mb-4">{formula.title}</h3>
            <p className="text-2xl font-bold text-white text-center">{formula.answer}</p>
          </div>
          
          <div className="text-xs text-white/80 text-center">
            Нажмите, чтобы вернуться к вопросу
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
