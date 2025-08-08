import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  isRunning: boolean;
  elapsedTime: number;
  onTimeUpdate: (time: number) => void;
}

const Timer: React.FC<TimerProps> = ({ isRunning, elapsedTime, onTimeUpdate }) => {
  const [time, setTime] = useState(elapsedTime);

  useEffect(() => {
    let interval: number | undefined;
    
    if (isRunning) {
      interval = window.setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + 1;
          onTimeUpdate(newTime);
          return newTime;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, onTimeUpdate]);

  // Format time as minutes:seconds
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center bg-white rounded-lg shadow-sm p-3 mb-4">
      <Clock className={`h-6 w-6 mr-2 ${isRunning ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} />
      <div className="text-xl font-mono font-semibold">{formatTime(time)}</div>
    </div>
  );
};

export default Timer;