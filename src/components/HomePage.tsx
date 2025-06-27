
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { LoadingSpinner } from './LoadingSpinner';

const HomePage = () => {
  const { appointments, loading } = useApp();

  const parseDateFromStorage = (dateString: string): Date => {
    console.log('Parsing date from storage:', dateString);
    // Se a data está no formato dd/mm/yyyy
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      const parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      console.log('Parsed dd/mm/yyyy date:', parsedDate);
      return parsedDate;
    }
    // Se a data está no formato antigo yyyy-mm-dd
    const parsedDate = new Date(dateString);
    console.log('Parsed yyyy-mm-dd date:', parsedDate);
    return parsedDate;
  };

  console.log('All appointments:', appointments);
  console.log('Today:', new Date());

  const todayAppointments = appointments.filter(appointment => {
    const appointmentDate = parseDateFromStorage(appointment.date);
    const isTodayCheck = isToday(appointmentDate);
    const isScheduled = appointment.status === 'scheduled';
    console.log(`Appointment ${appointment.id}: date=${appointment.date}, parsed=${appointmentDate}, isToday=${isTodayCheck}, status=${appointment.status}, isScheduled=${isScheduled}`);
    return isTodayCheck && isScheduled;
  });

  const tomorrowAppointments = appointments.filter(appointment => {
    const appointmentDate = parseDateFromStorage(appointment.date);
    const isTomorrowCheck = isTomorrow(appointmentDate);
    const isScheduled = appointment.status === 'scheduled';
    console.log(`Appointment ${appointment.id}: date=${appointment.date}, parsed=${appointmentDate}, isTomorrow=${isTomorrowCheck}, status=${appointment.status}, isScheduled=${isScheduled}`);
    return isTomorrowCheck && isScheduled;
  });

  console.log('Today appointments:', todayAppointments);
  console.log('Tomorrow appointments:', tomorrowAppointments);

  const renderAppointments = (appointmentsList: typeof appointments) => {
    if (loading) {
      return <LoadingSpinner className="py-6" />;
    }

    if (appointmentsList.length === 0) {
      return (
        <div className="text-center py-6">
          <p className="text-gray-500">Nenhum agendamento</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {appointmentsList.map((appointment) => (
          <div key={appointment.id} className="bg-white p-3 rounded-lg border border-primary-100">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-gray-800">{appointment.client_name}</h4>
                <p className="text-sm text-gray-600">{appointment.service_name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-primary-600">{appointment.time}</p>
                <p className="text-sm text-gray-600">R$ {Number(appointment.price).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

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
          {renderAppointments(todayAppointments)}
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
          {renderAppointments(tomorrowAppointments)}
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
