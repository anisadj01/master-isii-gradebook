import { useState, useCallback } from 'react';
import WelcomeIntro from '@/components/WelcomeIntro';
import MainDashboard from '@/components/MainDashboard';
import SemesterView from '@/components/SemesterView';

type AppView = 'intro' | 'dashboard' | 'semester';

const Index = () => {
  const [currentView, setCurrentView] = useState<AppView>('intro');

  const handleIntroComplete = useCallback(() => {
    setCurrentView('dashboard');
  }, []);

  const handleNavigateToSemester = useCallback(() => {
    setCurrentView('semester');
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setCurrentView('dashboard');
  }, []);

  return (
    <>
      {currentView === 'intro' && (
        <WelcomeIntro onComplete={handleIntroComplete} />
      )}
      
      {currentView === 'dashboard' && (
        <MainDashboard onNavigateToSemester={handleNavigateToSemester} />
      )}
      
      {currentView === 'semester' && (
        <SemesterView onBack={handleBackToDashboard} />
      )}
    </>
  );
};

export default Index;
