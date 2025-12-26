import { useEffect, useState } from 'react';
import { AnimatedBackground } from './AnimatedBackground';

interface WelcomePreloaderProps {
  userName?: string;
  onComplete: () => void;
  duration?: number;
}

export function WelcomePreloader({ 
  userName = 'User', 
  onComplete, 
  duration = 2500 
}: WelcomePreloaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, duration - 500);

    const completeTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <AnimatedBackground intensity="high" />
      
      <div className="text-center relative z-10">
        <h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          Welcome, <span className="text-gradient-blue">{userName}</span>
        </h1>
        <p 
          className="text-lg md:text-xl text-muted-foreground mt-4 animate-fade-in"
          style={{ animationDelay: '0.5s' }}
        >
          Loading your dashboard...
        </p>
        
        {/* Loading indicator */}
        <div 
          className="mt-8 flex justify-center gap-2 animate-fade-in"
          style={{ animationDelay: '0.7s' }}
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}
