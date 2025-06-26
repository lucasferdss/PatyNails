
import { Home, Calendar, DollarSign, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    { id: 'inicio', label: 'Início', icon: Home },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'servicos', label: 'Serviços', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200",
                  isActive 
                    ? "text-primary-500" 
                    : "text-gray-500 hover:text-primary-400"
                )}
              >
                <Icon 
                  size={20} 
                  className={cn(
                    "transition-all duration-200",
                    isActive && "scale-110"
                  )} 
                />
                <span className="text-xs mt-1 font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
