import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ScratchCard } from 'next-scratchcard';
import { toast } from 'react-hot-toast';

interface ScratchCardAmount {
  $numberDecimal: string;
}

interface ScratchCard {
  _id: string;
  phone: string;
  coupon_code: string;
  amount: ScratchCardAmount;
  validity: number;
  isActive: number;
  scratched: number;
  redeemed: number;
  createdAt: string;
  updatedAt: string;
}

export default function ScratchCards() {
  const [cards, setCards] = useState<ScratchCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Fetch scratch cards data
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('/api/scratch-cards', {
          credentials: 'include'
        });
        const data = await response.json();

        if (data.success) {
          setCards(data.data);
        }
      } catch (error) {
        console.error('Error fetching scratch cards:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  const handleRedeem = async (cardId: string) => {
    try {
      const response = await fetch(`/api/scratch-cards/${cardId}/redeem`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setCards(cards.map(card =>
          card._id === cardId ? { ...card, redeemed: 1 } : card
        ));
        // Open redeem URL in new tab
        window.open('https://repaykaro.rewardzpromo.com/', '_blank');
      }
    } catch (error) {
      console.error('Error redeeming card:', error);
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback method using textarea
        const textarea = document.createElement('textarea');
        textarea.value = code;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedCode(code);
      toast.success('Coupon code copied!');
      setTimeout(() => setCopiedCode(null), 3000); // Reset copy state after 3 seconds
    } catch (err) {
      console.error('Failed to copy code:', err);
      toast.error('Failed to copy code');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-48"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 relative z-0">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
        Your Scratch Cards
      </h2>

      {cards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div
              key={card._id}
              className="relative rounded-xl border shadow-sm bg-white dark:bg-gray-800 overflow-hidden"
            >
              {card.scratched === 0 ? (
                <div className="p-4 relative z-10">
                  <ScratchCard
                    width={280}
                    height={180}
                    image="/images/scratch-cover.svg"
                    finishPercent={70}
                    onComplete={() => {
                      // Update card as scratched in backend
                      fetch(`/api/scratch-cards/${card._id}/scratch`, {
                        method: 'POST',
                        credentials: 'include'
                      });
                      // Update local state
                      setCards(cards.map(c =>
                        c._id === card._id ? { ...c, scratched: 1 } : c
                      ));
                    }}
                    brushSize={30}
                  >
                    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-r from-brand-100 to-brand-50 dark:from-brand-900 dark:to-brand-800">
                      <div className="text-4xl font-bold text-brand-600 dark:text-brand-400 mb-2">
                        ₹{parseFloat(card.amount.$numberDecimal).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Scratch to reveal your reward!
                      </div>
                    </div>
                  </ScratchCard>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="text-3xl font-bold text-brand-600 dark:text-brand-400">
                      ₹{parseFloat(card.amount.$numberDecimal).toFixed(2)}
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                        card.redeemed === 1
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                      }`}
                    >
                      {card.redeemed === 1 ? 'Redeemed' : 'Ready to Redeem'}
                    </span>

                    {card.redeemed === 0 && (
                      <button
                        onClick={() => handleRedeem(card._id)}
                        className="flex items-center space-x-1 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <span>₹</span>
                        <span>Redeem Now</span>
                      </button>
                    )}
                  </div>

                  <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center justify-center space-x-2">
                      <span>Coupon Code: </span>
                      <div className="relative flex items-center">
                        <span className="font-mono text-gray-800 dark:text-gray-100">
                          {card.coupon_code}
                        </span>
                        <button
                          onClick={() => handleCopyCode(card.coupon_code)}
                          className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {copiedCode === card.coupon_code ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div>Valid for {card.validity} days</div>
                    <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                      Created: {new Date(card.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="mb-4">
            <Image
              src="/images/empty-rewards.svg"
              alt="No Rewards"
              width={120}
              height={120}
              className="mx-auto"
            />
          </div>
          <p className="text-lg font-medium">No scratch cards yet</p>
          <p className="text-sm mt-2">Start participating in rewards to earn scratch cards!</p>
        </div>
      )}
    </div>
  );
} 