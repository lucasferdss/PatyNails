
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Service, Appointment } from '@/types';

interface AppContextType {
  services: Service[];
  appointments: Appointment[];
  addService: (service: Omit<Service, 'id'>) => void;
  deleteService: (id: string) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  updateAppointmentStatus: (id: string, status: 'completed' | 'cancelled') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedServices = localStorage.getItem('patynails-services');
    const savedAppointments = localStorage.getItem('patynails-appointments');
    
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    }
    
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('patynails-services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('patynails-appointments', JSON.stringify(appointments));
  }, [appointments]);

  const addService = (service: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...service,
      id: Date.now().toString(),
    };
    setServices(prev => [...prev, newService]);
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointmentStatus = (id: string, status: 'completed' | 'cancelled') => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === id ? { ...appointment, status } : appointment
      )
    );
  };

  return (
    <AppContext.Provider value={{
      services,
      appointments,
      addService,
      deleteService,
      addAppointment,
      updateAppointmentStatus,
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
