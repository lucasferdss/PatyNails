
import { useState } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import HomePage from '@/components/HomePage';
import AgendaPage from '@/components/AgendaPage';
import FinanceiroPage from '@/components/FinanceiroPage';
import ServicosPage from '@/components/ServicosPage';
import { AppProvider } from '@/contexts/AppContext';

const Index = () => {
  const [activeTab, setActiveTab] = useState('inicio');

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
        {/* Main Content */}
        <div className="min-h-screen">
          {renderContent()}
        </div>
        
        {/* Bottom Navigation */}
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </AppProvider>
  );
};

export default Index;
