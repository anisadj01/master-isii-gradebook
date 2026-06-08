import { useState, useCallback, useEffect } from 'react';
import WelcomeIntro from '@/components/WelcomeIntro';
import MainDashboard from '@/components/MainDashboard';
import SemesterView from '@/components/SemesterView';
import OnboardingTour from '@/components/OnboardingTour';
import { semester1Units, semester2Units } from '@/lib/modules';

type AppView = 'intro' | 'dashboard' | 'semester1' | 'semester2';

const Index = () => {
  const [currentView, setCurrentView] = useState<AppView>('intro');
  const [showTour, setShowTour] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setCurrentView('dashboard');
  }, []);

  useEffect(() => {
    if (currentView !== 'dashboard') return;
    try {
      if (!localStorage.getItem('onboarding:v1')) setShowTour(true);
    } catch { /* ignore */ }
  }, [currentView]);


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
