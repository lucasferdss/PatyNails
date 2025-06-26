
export interface Service {
  id: string;
  name: string;
  price: number;
}

export interface Appointment {
  id: string;
  clientName: string;
  date: string;
  time: string;
  serviceId: string;
  serviceName: string;
  price: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}
