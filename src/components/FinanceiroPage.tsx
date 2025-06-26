
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const FinanceiroPage = () => {
  const [activeTab, setActiveTab] = useState('semana');
  const { appointments, updateAppointmentStatus } = useApp();

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const getRevenueForPeriod = (start: Date, end: Date) => {
    return appointments
      .filter(apt => {
        const aptDate = new Date(apt.date);
        return apt.status === 'completed' && isWithinInterval(aptDate, { start, end });
      })
      .reduce((total, apt) => total + apt.price, 0);
  };

  const weeklyRevenue = getRevenueForPeriod(weekStart, weekEnd);
  const monthlyRevenue = getRevenueForPeriod(monthStart, monthEnd);

  const getAppointmentsForPeriod = (start: Date, end: Date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return isWithinInterval(aptDate, { start, end });
    });
  };

  const periodAppointments = activeTab === 'semana' 
    ? getAppointmentsForPeriod(weekStart, weekEnd)
    : getAppointmentsForPeriod(monthStart, monthEnd);

  const formatPeriod = () => {
    if (activeTab === 'semana') {
      return `${format(weekStart, 'dd/MM')} - ${format(weekEnd, 'dd/MM')}`;
    } else {
      return format(monthStart, "MMMM 'de' yyyy", { locale: ptBR });
    }
  };

  const handleStatusChange = (appointmentId: string, newStatus: 'completed' | 'cancelled') => {
    updateAppointmentStatus(appointmentId, newStatus);
  };

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
            <div className="text-2xl font-bold text-orange-800">R$ {weeklyRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card className="bg-primary-100 border-primary-200">
          <CardContent className="p-4">
            <div className="text-primary-600 text-sm font-medium mb-1">Este mês</div>
            <div className="text-2xl font-bold text-primary-800">R$ {monthlyRevenue.toFixed(2)}</div>
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
        <p className="text-gray-600 text-sm">Período: {formatPeriod()}</p>
      </div>

      {/* Services History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-primary-700">Histórico de serviços</CardTitle>
        </CardHeader>
        <CardContent>
          {periodAppointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum serviço no período selecionado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {periodAppointments.map((appointment) => (
                <div key={appointment.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-800">{appointment.clientName}</h4>
                      <p className="text-sm text-gray-600">{appointment.serviceName}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(appointment.date), "dd/MM/yyyy", { locale: ptBR })} às {appointment.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">R$ {appointment.price.toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {appointment.status === 'completed' ? 'Concluído' :
                         appointment.status === 'cancelled' ? 'Cancelado' :
                         'Agendado'}
                      </span>
                    </div>
                  </div>
                  {appointment.status === 'scheduled' && (
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(appointment.id, 'completed')}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        Concluir
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceiroPage;
