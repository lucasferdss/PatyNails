
export interface Service {
  id: string;
  name: string;
  price: number;
  created_at?: string;
}

export interface Appointment {
  id: string;
  client_name: string;
  date: string;
  time: string;
  service_id: string;
  service_name: string;
  price: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
  updated_at?: string;
}
