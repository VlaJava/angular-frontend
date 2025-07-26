export interface User {
  id: number;
  name: string;
  email: string;
  document: string; 
  phone: string;
  active: boolean;
  role: 'ADMIN' | 'CLIENT'; 
}