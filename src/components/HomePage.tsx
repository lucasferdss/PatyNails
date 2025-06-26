
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HomePage = () => {
  return (
    <div className="p-4 pb-20 max-w-md mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-primary-600 mb-2">PatyNails</h1>
      </div>

      {/* Welcome Section */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Bem-vinda!</h2>
        <p className="text-gray-600">Gerencie seus agendamentos facilmente.</p>
      </div>

      {/* Today's Appointments */}
      <Card className="mb-6 border-primary-100 bg-primary-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-primary-700 flex items-center gap-2">
            <Calendar size={20} />
            Agendamentos de hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-gray-500">Nenhum agendamento para hoje</p>
          </div>
        </CardContent>
      </Card>

      {/* Tomorrow's Appointments */}
      <Card className="mb-6 border-primary-100 bg-primary-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-primary-700 flex items-center gap-2">
            <Clock size={20} />
            Agendamentos de amanhã
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-gray-500">Nenhum agendamento para amanhã</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
