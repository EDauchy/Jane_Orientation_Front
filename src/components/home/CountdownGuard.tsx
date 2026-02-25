import { useState, useEffect } from 'react';
import type { CountdownGuardProps, TimeLeft } from '../../shard/types';


const CountdownGuard = ({ 
  targetDate, 
  children, 
  containerClass = "w-full aspect-video",
  color = "white" 
}: CountdownGuardProps) => {
  
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: TimeLeft = {};

    if (difference > 0) {
      timeLeft = {
        j: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const isExpired = Object.keys(timeLeft).length === 0;

  // NOTE: avoid dynamic tailwind classes like `text-${color}` because they won't be picked up by JIT.
  // We fallback to common colors or a provided color string (when explicit classes are used).
  const textColorClass = color === 'white' ? 'text-white' : color === 'black' ? 'text-black' : '';
  const bgColorClass = color === 'white' ? 'bg-white/10' : color === 'black' ? 'bg-black/10' : '';
  const borderColorClass = color === 'white' ? 'border-white/10' : color === 'black' ? 'border-black/20' : '';

  return (
    <div className={`relative overflow-hidden rounded-xl shadow-2xl ${containerClass}`}>
      
      {/* 1. LE CONTENU RÉEL */}
      <div className="w-full h-full">
        {children}
      </div>

      {/* 2. L'OVERLAY DE PROTECTION */}
      {!isExpired && (
        <div className="absolute inset-0 z-10 bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center border border-white/10">
          
          <span className={`${textColorClass} text-[10px] md:text-xs uppercase tracking-[0.4em] mb-6 font-bold drop-shadow-lg`}>
            Disponible dans
          </span>
          
          <div className="flex gap-3 md:gap-5">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <div key={unit} className="flex flex-col items-center">
                {/* Application du fond et de la bordure dynamiques sur la case */}
                <div className={`${bgColorClass} ${borderColorClass} backdrop-blur-lg border w-12 h-14 md:w-16 md:h-20 flex items-center justify-center rounded-xl shadow-2xl`}>
                  <span className={`text-xl md:text-3xl font-black ${textColorClass} drop-shadow-md`}>
                    {String(value || 0).padStart(2, '0')}
                  </span>
                </div>
                <span className={`text-[10px] mt-2 uppercase ${textColorClass} font-semibold drop-shadow-sm opacity-80`}>
                  {unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountdownGuard;