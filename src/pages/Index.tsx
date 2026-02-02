import { useState, useCallback } from 'react';
import WelcomeIntro from '@/components/WelcomeIntro';
import MainDashboard from '@/components/MainDashboard';
import SemesterView from '@/components/SemesterView';
import { semester1Units, semester2Units } from '@/lib/modules';

type AppView = 'intro' | 'dashboard' | 'semester1' | 'semester2';

const Index = () => {
  const [currentView, setCurrentView] = useState<AppView>('intro');

  const handleIntroComplete = useCallback(() => {
    setCurrentView('dashboard');
  }, []);

  const handleNavigateToSemester = useCallback((semester: 1 | 2) => {
    setCurrentView(semester === 1 ? 'semester1' : 'semester2');
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
      
      {currentView === 'semester1' && (
        <SemesterView 
          title="Semestre 1"
          units={semester1Units}
          onBack={handleBackToDashboard} 
        />
      )}

      {currentView === 'semester2' && (
        <SemesterView 
          title="Semestre 2"
          units={semester2Units}
          onBack={handleBackToDashboard} 
        />
      )}
    </>
  );
};

export default Index;
