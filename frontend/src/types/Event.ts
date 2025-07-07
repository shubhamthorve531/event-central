export interface Event {
  id?: number;
  title: string;
  description: string;
  category: string;
  location: string;
  date: string; // ISO format
  creatorName:string;
  creatorEmail: string;
  registrationCount?: number;
}