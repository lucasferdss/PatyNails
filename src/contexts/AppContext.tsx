import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '@/integrations/firebase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Service, Appointment } from '@/types';
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
  const { user } = useAuth();
  const { toast } = useToast();

  const loadServices = useCallback(async () => {
    if (!user) {
      setServices([]);
      return;
    }

    try {
      const servicesQuery = query(
        collection(db, 'services'),
        where('user_id', '==', user.uid)
      );
      const snapshot = await getDocs(servicesQuery);
      const loadedServices = snapshot.docs.map((serviceDoc) => ({
        id: serviceDoc.id,
        ...serviceDoc.data(),
      })) as Service[];

      setServices(loadedServices.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os serviços.",
        variant: "destructive",
      });
    }
  }, [toast, user]);

  const loadAppointments = useCallback(async () => {
    if (!user) {
      setAppointments([]);
      return;
    }

    try {
      const appointmentsQuery = query(
        collection(db, 'appointments'),
        where('user_id', '==', user.uid)
      );
      const snapshot = await getDocs(appointmentsQuery);
      const loadedAppointments = snapshot.docs.map((appointmentDoc) => {
        const data = appointmentDoc.data();

        return {
          id: appointmentDoc.id,
          ...data,
          status: data.status as 'scheduled' | 'completed' | 'cancelled',
        };
      }) as Appointment[];

      setAppointments(loadedAppointments.sort((a, b) => a.date.localeCompare(b.date)));
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os agendamentos.",
        variant: "destructive",
      });
    }
  }, [toast, user]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadServices(), loadAppointments()]);
    setLoading(false);
  }, [loadAppointments, loadServices]);

  useEffect(() => {
    if (user) {
      refreshData();
    } else {
      setServices([]);
      setAppointments([]);
      setLoading(false);
    }
  }, [refreshData, user]);

  const addService = async (service: Omit<Service, 'id'>) => {
    if (!user) return;

    try {
      const serviceData = {
        ...service,
        user_id: user.uid,
        created_at: new Date().toISOString(),
      };
      const serviceRef = await addDoc(collection(db, 'services'), serviceData);

      setServices(prev => [...prev, { id: serviceRef.id, ...service }]);
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
    if (!user) {
      return {
        success: false,
        message: "Usuário não autenticado.",
      };
    }

    try {
      const appointmentsQuery = query(
        collection(db, 'appointments'),
        where('user_id', '==', user.uid),
        where('service_id', '==', id)
      );
      const appointmentsSnapshot = await getDocs(appointmentsQuery);

      if (!appointmentsSnapshot.empty) {
        return {
          success: false,
          message: `Não é possível excluir este serviço pois existem ${appointmentsSnapshot.size} agendamento(s) associado(s) a ele.`,
        };
      }

      await deleteDoc(doc(db, 'services', id));

      setServices(prev => prev.filter(service => service.id !== id));
      return {
        success: true,
        message: "Serviço excluído com sucesso!",
      };
    } catch (error) {
      console.error('Erro ao excluir serviço:', error);
      return {
        success: false,
        message: "Erro inesperado ao excluir o serviço.",
      };
    }
  };

  const addAppointment = async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const created_at = new Date().toISOString();
      const appointmentData = {
        ...appointment,
        user_id: user.uid,
        created_at,
        updated_at: created_at,
      };
      const appointmentRef = await addDoc(collection(db, 'appointments'), appointmentData);

      const typedAppointment: Appointment = {
        id: appointmentRef.id,
        ...appointment,
        created_at,
        updated_at: created_at,
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
      await updateDoc(doc(db, 'appointments', id), {
        status,
        updated_at: new Date().toISOString(),
      });

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
      await updateDoc(doc(db, 'appointments', id), {
        price,
        updated_at: new Date().toISOString(),
      });

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
