export interface TravelPackage {
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

export enum Sender {
  User = 'user',
  Bot = 'bot'
}

export interface ChatMessage {
  text?: string;
  sender: Sender;
  isLoading?: boolean;
  packages?: TravelPackage[];
}
