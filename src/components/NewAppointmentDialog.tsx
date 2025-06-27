
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

export const NewAppointmentDialog = () => {
  const [open, setOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  
  const { services, addAppointment } = useApp();
  const { toast } = useToast();

  const formatDateForStorage = (date: Date) => {
    // Criar uma nova data para evitar problemas de timezone
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    const day = String(localDate.getDate()).padStart(2, '0');
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const year = localDate.getFullYear();
    
    console.log('Data original:', date);
    console.log('Data local ajustada:', localDate);
    console.log('Data formatada para storage:', `${day}/${month}/${year}`);
    
    return `${day}/${month}/${year}`;
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    console.log('Data selecionada no calendário:', selectedDate);
    if (selectedDate) {
      // Garantir que estamos trabalhando com o meio-dia para evitar problemas de timezone
      const adjustedDate = new Date(selectedDate);
      adjustedDate.setHours(12, 0, 0, 0);
      console.log('Data ajustada:', adjustedDate);
      setDate(adjustedDate);
    } else {
      setDate(undefined);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientName || !date || !time || !selectedServiceId) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    const selectedService = services.find(s => s.id === selectedServiceId);
    if (!selectedService) return;

    const formattedDate = formatDateForStorage(date);
    
    console.log('Dados do agendamento:');
    console.log('Cliente:', clientName);
    console.log('Data formatada:', formattedDate);
    console.log('Horário:', time);
    console.log('Serviço:', selectedService.name);

    await addAppointment({
      client_name: clientName,
      date: formattedDate,
      time,
      service_id: selectedServiceId,
      service_name: selectedService.name,
      price: selectedService.price,
      status: 'scheduled',
    });

    toast({
      title: "Sucesso",
      description: "Agendamento criado com sucesso!",
    });

    // Reset form
    setClientName('');
    setDate(undefined);
    setTime('');
    setSelectedServiceId('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary-500 hover:bg-primary-600 text-white rounded-full px-6">
          <Plus size={16} className="mr-2" />
          Novo Agendamento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="clientName">Nome do Cliente</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Digite o nome do cliente"
            />
          </div>
          
          <div>
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd 'de' MMMM, yyyy", { locale: ptBR }) : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="time">Horário</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div>
            <Label>Serviço</Label>
            <Select value={selectedServiceId} onValueChange={setSelectedServiceId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - R$ {Number(service.price).toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Agendar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
