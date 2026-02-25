import { useState, useEffect } from 'react';
import type { CountdownSimpleProps, TimeLeft } from '../../shard/types';


const CountdownSimple = ({ 
  targetDate, 
  color = "white",
  fontSize = "text-3xl",
  containerClass = "" 
}: CountdownSimpleProps) => {
  
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

  const formatNum = (num?: number) => String(num || 0).padStart(2, '0');

  // Si le temps est écoulé
  const isExpired = Object.keys(timeLeft).length === 0;

  const textColorClass = color === 'white' ? 'text-white' : color === 'black' ? 'text-black' : '';

  return (
    <div className={`flex items-center font-mono font-black tracking-tighter ${textColorClass} ${fontSize} ${containerClass}`}>
      {isExpired ? (
        <span></span>
      ) : (
        <>
          <span>{formatNum(timeLeft.j)}</span>
          <span className="opacity-40 animate-pulse">:</span>
          <span>{formatNum(timeLeft.h)}</span>
          <span className="opacity-40 animate-pulse">:</span>
          <span>{formatNum(timeLeft.m)}</span>
          <span className="opacity-40 animate-pulse">:</span>
          <span>{formatNum(timeLeft.s)}</span>
        </>
      )}
    </div>
  );
};

export default CountdownSimple;