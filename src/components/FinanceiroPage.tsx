
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FinanceiroPage = () => {
  const [activeTab, setActiveTab] = useState('semana');

  return (
    <div className="p-4 pb-20 max-w-md mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-primary-600">Financeiro</h1>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="text-orange-600 text-sm font-medium mb-1">Esta semana</div>
            <div className="text-2xl font-bold text-orange-800">R$ 0,00</div>
          </CardContent>
        </Card>
        <Card className="bg-primary-100 border-primary-200">
          <CardContent className="p-4">
            <div className="text-primary-600 text-sm font-medium mb-1">Este mês</div>
            <div className="text-2xl font-bold text-primary-800">R$ 0,00</div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('semana')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'semana'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setActiveTab('mes')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === 'mes'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600'
            }`}
          >
            Mês
          </button>
        </div>
      </div>

      {/* Period Info */}
      <div className="text-center mb-6">
        <p className="text-gray-600 text-sm">Período: 22/06 - 28/06</p>
      </div>

      {/* Services History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-primary-700">Histórico de serviços</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum serviço no período selecionado</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceiroPage;
