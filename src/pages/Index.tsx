
import { useState } from 'react';
import { mathFormulas } from '@/utils/mathFormulas';
import FlashCardDeck from '@/components/FlashCardDeck';
import { Toaster } from '@/components/ui/sonner';

const Index = () => {
  const [formulas] = useState(mathFormulas);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-soft-gray py-10">
      <div className="container mx-auto px-4">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-dark-purple mb-2">Математика 8 класс</h1>
          <p className="text-neutral-gray">Интерактивные карточки с формулами</p>
        </header>

        <main>
          <FlashCardDeck formulas={formulas} />
        </main>

        <footer className="mt-16 text-center text-sm text-neutral-gray">
          <p>© 2025 Math Flash Cards Genius</p>
        </footer>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default Index;
