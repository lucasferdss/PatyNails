
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from '@/components/BottomNavigation';
import HomePage from '@/components/HomePage';
import AgendaPage from '@/components/AgendaPage';
import FinanceiroPage from '@/components/FinanceiroPage';
import ServicosPage from '@/components/ServicosPage';
import { AppProvider } from '@/contexts/AppContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { InstallPWA } from '@/components/InstallPWA';

const Index = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return <HomePage />;
      case 'agenda':
        return <AgendaPage />;
      case 'financeiro':
        return <FinanceiroPage />;
      case 'servicos':
        return <ServicosPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="min-h-screen">
          {renderContent()}
        </div>
        <InstallPWA />
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </AppProvider>
  );
};

export default Index;
