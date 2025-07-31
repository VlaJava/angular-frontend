
export interface Package {
  
  id: string; 
  
  title: string;
  source: string;
  destination: string;
  description: string;
  imageUrl: string;
  price: number;
  travelerLimit: number;
  startDate: string; 
  endDate: string;   
  available: boolean;
}
