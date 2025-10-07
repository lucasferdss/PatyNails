
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
import { z } from 'zod';

const appointmentSchema = z.object({
  client_name: z.string().trim().min(1, "Nome do cliente é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  date: z.date({ required_error: "Data é obrigatória" }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Horário inválido"),
  service_id: z.string().uuid("Selecione um serviço válido"),
});

export const NewAppointmentDialog = () => {
  const [open, setOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  
  const { services, addAppointment } = useApp();
  const { toast } = useToast();

  const formatDateForStorage = (date: Date) => {
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    const day = String(localDate.getDate()).padStart(2, '0');
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const year = localDate.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const adjustedDate = new Date(selectedDate);
      adjustedDate.setHours(12, 0, 0, 0);
      setDate(adjustedDate);
    } else {
      setDate(undefined);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate using Zod schema
    const validation = appointmentSchema.safeParse({
      client_name: clientName,
      date: date,
      time: time,
      service_id: selectedServiceId,
    });

    if (!validation.success) {
      const errorMessage = validation.error.errors[0]?.message || "Dados inválidos";
      toast({
        title: "Erro de Validação",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    const selectedService = services.find(s => s.id === selectedServiceId);
    if (!selectedService) return;

    const formattedDate = formatDateForStorage(validation.data.date);

    await addAppointment({
      client_name: validation.data.client_name,
      date: formattedDate,
      time: validation.data.time,
      service_id: validation.data.service_id,
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
