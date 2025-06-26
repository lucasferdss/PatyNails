
import { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useApp } from '@/contexts/AppContext';
import { NewAppointmentDialog } from './NewAppointmentDialog';

const AgendaPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { appointments } = useApp();

  const formatSelectedDate = () => {
    return format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR });
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return isSameDay(appointmentDate, date) && appointment.status === 'scheduled';
    });
  };

  const selectedDateAppointments = getAppointmentsForDate(selectedDate);

  // Get dates that have appointments for highlighting
  const appointmentDates = appointments
    .filter(apt => apt.status === 'scheduled')
    .map(apt => new Date(apt.date));

  const modifiers = {
    hasAppointment: appointmentDates,
  };

  const modifiersStyles = {
    hasAppointment: {
      backgroundColor: '#8B5CF6',
      color: 'white',
      borderRadius: '50%',
    },
  };

  return (
    <div className="p-4 pb-20 max-w-md mx-auto animate-fade-in">
      {/* Header */}
      <Card className="mb-6 bg-primary-500 text-white border-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center gap-2">
            Agenda de Atendimentos
          </CardTitle>
          <div className="flex items-center gap-2 text-primary-100">
            <CalendarIcon size={16} />
            <span className="text-sm">
              {format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
            </span>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="w-full pointer-events-auto"
            locale={ptBR}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
          />
        </CardContent>
      </Card>

      {/* Selected Date */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-800 capitalize">
          {formatSelectedDate()}
        </h3>
      </div>

      {/* New Appointment Button */}
      <div className="mb-6 flex justify-end">
        <NewAppointmentDialog />
      </div>

      {/* Appointments List */}
      <Card>
        <CardContent className="p-6">
          {selectedDateAppointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum agendamento para este dia</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDateAppointments.map((appointment) => (
                <div key={appointment.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">{appointment.clientName}</h4>
                      <p className="text-sm text-gray-600">{appointment.serviceName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary-600">{appointment.time}</p>
                      <p className="text-sm text-gray-600">R$ {appointment.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgendaPage;
