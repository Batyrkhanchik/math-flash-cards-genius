
import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Shuffle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import FlashCard from './FlashCard';
import HintModal from './HintModal';
import { Formula } from '../utils/mathFormulas';

interface FlashCardDeckProps {
  formulas: Formula[];
}

const FlashCardDeck = ({ formulas }: FlashCardDeckProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledFormulas, setShuffledFormulas] = useState<Formula[]>([...formulas]);
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [currentHint, setCurrentHint] = useState('');
  const [answeredCards, setAnsweredCards] = useState<Record<number, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [trackProgress, setTrackProgress] = useState(false);
  
  // Calculate progress
  const totalAnswered = Object.values(answeredCards).filter(Boolean).length;
  const progressPercentage = formulas.length > 0 ? Math.round((totalAnswered / formulas.length) * 100) : 0;

  // Reset progress when formulas change
  useEffect(() => {
    setShuffledFormulas([...formulas]);
    setAnsweredCards({});
    setCurrentIndex(0);
    setIsFinished(false);
  }, [formulas]);

  // Check if deck is completed
  useEffect(() => {
    if (trackProgress && totalAnswered === formulas.length && formulas.length > 0) {
      setIsFinished(true);
      
      // Show result toast
      if (progressPercentage >= 70) {
        toast.success("Отличная работа! Результат: " + progressPercentage + "%");
      } else {
        toast.info("Попробуй еще раз! Результат: " + progressPercentage + "%");
      }
    }
  }, [answeredCards, formulas.length, progressPercentage, trackProgress, totalAnswered]);

  const handleNext = () => {
    if (currentIndex < shuffledFormulas.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleShuffle = () => {
    const newShuffled = [...shuffledFormulas]
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    
    setShuffledFormulas(newShuffled);
    setCurrentIndex(0);
    setAnsweredCards({});
    setIsFinished(false);
    toast.info("Карточки перемешаны!");
  };

  const handleShowHint = (hint: string) => {
    setCurrentHint(hint);
    setIsHintOpen(true);
  };

  const handleAnswered = (correct: boolean) => {
    const formula = shuffledFormulas[currentIndex];
    
    // Only track if we're not already tracking this card
    if (!answeredCards[formula.id]) {
      setAnsweredCards(prev => ({
        ...prev,
        [formula.id]: correct
      }));
    }
  };

  const startTracking = () => {
    setTrackProgress(true);
    setAnsweredCards({});
    setIsFinished(false);
    toast.info("Начинаем отслеживать прогресс!");
  };

  const resetProgress = () => {
    setAnsweredCards({});
    setTrackProgress(false);
    setIsFinished(false);
    setCurrentIndex(0);
  };

  // Handle the case when formulas array is empty
  if (shuffledFormulas.length === 0) {
    return <div className="text-center p-8">Карточки не найдены</div>;
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-neutral-gray hover:text-math-purple flex items-center gap-1"
          onClick={() => handleShowHint(shuffledFormulas[currentIndex].hint || "Подсказка недоступна")}
        >
          <Lightbulb size={20} />
          <span className="hidden sm:inline">Get a hint</span>
        </Button>

        <div className="flex space-x-2">
          {!trackProgress ? (
            <Button 
              variant="outline" 
              onClick={startTracking}
              className="text-xs sm:text-sm"
            >
              Начать тест
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={resetProgress}
              className="text-xs sm:text-sm"
            >
              Сбросить
            </Button>
          )}
        </div>
      </div>
      
      {/* Current card */}
      <FlashCard 
        formula={shuffledFormulas[currentIndex]} 
        onShowHint={handleShowHint}
        isAnswerChecked={trackProgress}
        onAnswered={handleAnswered}
      />
      
      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="ghost"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          aria-label="Предыдущая карточка"
          className="flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          <span className="hidden sm:inline">Назад</span>
        </Button>
        
        <div className="flex items-center gap-2">
          <span className="text-neutral-gray">
            {currentIndex + 1} / {shuffledFormulas.length}
          </span>
          
          {trackProgress && (
            <div className="hidden sm:block text-sm font-medium ml-4 text-neutral-gray">
              Прогресс: {progressPercentage}%
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={handleShuffle}
            aria-label="Перемешать карточки"
            className="text-neutral-gray hover:text-math-purple"
          >
            <Shuffle size={20} />
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleNext}
            disabled={currentIndex === shuffledFormulas.length - 1}
            aria-label="Следующая карточка"
            className="flex items-center gap-2"
          >
            <span className="hidden sm:inline">Вперед</span>
            <ArrowRight size={20} />
          </Button>
        </div>
      </div>

      {/* Results */}
      {isFinished && (
        <div className="mt-8 p-6 rounded-lg bg-soft-gray border border-light-purple">
          <h3 className="text-xl font-bold mb-2 text-center">
            {progressPercentage >= 70 ? "Отличная работа! 🎉" : "Попробуй еще раз! 📚"}
          </h3>
          <p className="text-center text-lg mb-4">
            Ваш результат: <span className="font-bold">{progressPercentage}%</span>
          </p>
          <div className="flex justify-center">
            <Button onClick={resetProgress} variant="default">
              Начать заново
            </Button>
          </div>
        </div>
      )}
      
      {/* Hint modal */}
      <HintModal 
        isOpen={isHintOpen}
        setIsOpen={setIsHintOpen}
        hint={currentHint}
      />
    </div>
  );
};

export default FlashCardDeck;
