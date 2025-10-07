import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Service, Appointment } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AppContextType {
  services: Service[];
  appointments: Appointment[];
  loading: boolean;
  addService: (service: Omit<Service, 'id'>) => Promise<void>;
  deleteService: (id: string) => Promise<{ success: boolean; message: string }>;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateAppointmentStatus: (id: string, status: 'completed' | 'cancelled') => Promise<void>;
  updateAppointmentPrice: (id: string, price: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Carregar serviços do Supabase
  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name');

      if (error) {
        console.error('Erro ao carregar serviços:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os serviços.",
          variant: "destructive",
        });
        return;
      }

      setServices(data || []);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    }
  };

  // Carregar agendamentos do Supabase
  const loadAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Erro ao carregar agendamentos:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os agendamentos.",
          variant: "destructive",
        });
        return;
      }

      // Garantir que o status seja do tipo correto
      const typedAppointments: Appointment[] = (data || []).map(appointment => ({
        ...appointment,
        status: appointment.status as 'scheduled' | 'completed' | 'cancelled'
      }));

      setAppointments(typedAppointments);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    }
  };

  // Carregar todos os dados
  const refreshData = async () => {
    setLoading(true);
    await Promise.all([loadServices(), loadAppointments()]);
    setLoading(false);
  };

  // Carregar dados na inicialização
  useEffect(() => {
    refreshData();
  }, []);

  const addService = async (service: Omit<Service, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .insert([service])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar serviço:', error);
        toast({
          title: "Erro",
          description: "Não foi possível adicionar o serviço.",
          variant: "destructive",
        });
        return;
      }

      setServices(prev => [...prev, data]);
    } catch (error) {
      console.error('Erro ao adicionar serviço:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o serviço.",
        variant: "destructive",
      });
    }
  };

  const deleteService = async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      // Verificar se há agendamentos associados a este serviço
      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('id')
        .eq('service_id', id);

      if (appointmentsError) {
        console.error('Erro ao verificar agendamentos:', appointmentsError);
        return {
          success: false,
          message: "Erro ao verificar agendamentos associados."
        };
      }

      if (appointmentsData && appointmentsData.length > 0) {
        return {
          success: false,
          message: `Não é possível excluir este serviço pois existem ${appointmentsData.length} agendamento(s) associado(s) a ele.`
        };
      }

      // Se não há agendamentos, proceder com a exclusão
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao excluir serviço:', error);
        return {
          success: false,
          message: "Não foi possível excluir o serviço."
        };
      }

      setServices(prev => prev.filter(service => service.id !== id));
      return {
        success: true,
        message: "Serviço excluído com sucesso!"
      };
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      return {
        success: false,
        message: "Erro inesperado ao excluir o serviço."
      };
    }
  };

  const addAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          ...appointment,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar agendamento:', error);
        toast({
          title: "Erro",
          description: "Não foi possível criar o agendamento.",
          variant: "destructive",
        });
        return;
      }

      // Garantir que o status seja do tipo correto
      const typedAppointment: Appointment = {
        ...data,
        status: data.status as 'scheduled' | 'completed' | 'cancelled'
      };

      setAppointments(prev => [...prev, typedAppointment]);
    } catch (error) {
      console.error('Erro ao adicionar agendamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o agendamento.",
        variant: "destructive",
      });
    }
  };

  const updateAppointmentStatus = async (id: string, status: 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar status do agendamento:', error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o status do agendamento.",
          variant: "destructive",
        });
        return;
      }

      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === id ? { ...appointment, status } : appointment
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar status do agendamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do agendamento.",
        variant: "destructive",
      });
    }
  };

  const updateAppointmentPrice = async (id: string, price: number) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ price })
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar preço do agendamento:', error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o preço do agendamento.",
          variant: "destructive",
        });
        return;
      }

      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === id ? { ...appointment, price } : appointment
        )
      );
    } catch (error) {
      console.error('Erro ao atualizar preço do agendamento:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o preço do agendamento.",
        variant: "destructive",
      });
    }
  };

  return (
    <AppContext.Provider value={{
      services,
      appointments,
      loading,
      addService,
      deleteService,
      addAppointment,
      updateAppointmentStatus,
      updateAppointmentPrice,
      refreshData,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
