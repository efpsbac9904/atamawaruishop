import React, { useEffect, useState } from 'react';
import { XPGain } from '../types/ranking';
import { Star, TrendingUp } from 'lucide-react';

interface XPGainDisplayProps {
  gains: XPGain[];
  onComplete?: () => void;
}

const XPGainDisplay: React.FC<XPGainDisplayProps> = ({ gains, onComplete }) => {
  const [visibleGains, setVisibleGains] = useState<XPGain[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < gains.length) {
      const timer = setTimeout(() => {
        setVisibleGains(prev => [...prev, gains[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    } else if (currentIndex === gains.length && onComplete) {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, gains, onComplete]);

  const totalXP = gains.reduce((sum, gain) => sum + gain.amount, 0);

  return (
    <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg p-6 text-white">
      <div className="flex items-center justify-center mb-4">
        <Star className="h-8 w-8 text-yellow-300 mr-2" />
        <h3 className="text-2xl font-bold">XP獲得!</h3>
      </div>
      
      <div className="space-y-3 mb-6">
        {visibleGains.map((gain, index) => (
          <div 
            key={`${gain.source}-${index}`}
            className="flex justify-between items-center bg-white/20 rounded-lg p-3 animate-fade-in"
          >
            <span className="text-sm">{gain.description}</span>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="font-bold">+{gain.amount} XP</span>
            </div>
          </div>
        ))}
      </div>
      
      {currentIndex >= gains.length && (
        <div className="text-center border-t border-white/30 pt-4">
          <div className="text-3xl font-bold text-yellow-300 animate-pulse">
            合計: +{totalXP} XP
          </div>
        </div>
      )}
    </div>
  );
};

export default XPGainDisplay;