export interface User {

  id: string;
  name: string;
  email: string;
  document: string; 
  phone: string;
  active: boolean;
  role: 'ADMIN' | 'CLIENT'; 
  
}