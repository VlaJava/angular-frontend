export interface User {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string;
  active: boolean;
  role: 'ADMIN' | 'CLIENT';
  password?: string;
  birthdate?: string;
  documentType?: string;
  documentNumber?: string;
  imageUrl?: string;
}