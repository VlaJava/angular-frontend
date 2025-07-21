export interface UserSignup {
  name: string;
  email: string;
  password?: string; 
  phone: string;
  dateOfBirth: string;
  documentType: string;
  documentNumber: string;
}