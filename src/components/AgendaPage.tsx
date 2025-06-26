
import { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const AgendaPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formatSelectedDate = () => {
    return format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR });
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
            <Calendar size={16} />
            <span className="text-sm">
              {format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR })}
            </span>
          </div>
        </CardHeader>
      </Card>

      {/* Selected Date */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-800 capitalize">
          {formatSelectedDate()}
        </h3>
      </div>

      {/* New Appointment Button */}
      <div className="mb-6 flex justify-end">
        <Button className="bg-primary-500 hover:bg-primary-600 text-white rounded-full px-6">
          <Plus size={16} className="mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* Appointments List */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-gray-500">Nenhum agendamento para este dia</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgendaPage;
