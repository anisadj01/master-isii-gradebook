import { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';

interface WelcomeIntroProps {
  onComplete: () => void;
}

const WelcomeIntro = ({ onComplete }: WelcomeIntroProps) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1700);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center gradient-hero transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative text-center px-6 max-w-3xl">
        {/* Decorative elements */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
        
        {/* Logo */}
        <div className="relative mb-8 animate-fade-in-scale" style={{ animationDelay: '0.1s' }}>
          <div className="mx-auto w-20 h-20 rounded-2xl gradient-accent flex items-center justify-center shadow-glow animate-pulse-glow">
            <GraduationCap className="w-10 h-10 text-primary" />
          </div>
        </div>

        {/* Main text */}
        <h1 
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 leading-tight animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          Bienvenue dans l'application de calcul de moyenne
        </h1>
        
        <div 
          className="animate-fade-in-up" 
          style={{ animationDelay: '0.5s' }}
        >
          <p className="text-xl md:text-2xl text-primary-foreground/90 font-medium mb-2">
            Master ISII
          </p>
          <p className="text-lg text-primary-foreground/70">
            Université d'Alger 1
          </p>
        </div>

        {/* Loading indicator */}
        <div 
          className="mt-10 animate-fade-in-up" 
          style={{ animationDelay: '0.7s' }}
        >
          <div className="h-1 w-32 mx-auto bg-primary-foreground/20 rounded-full overflow-hidden">
            <div className="h-full gradient-accent animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeIntro;
