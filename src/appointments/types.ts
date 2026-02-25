export interface Appointment {
  id: string;
  date: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'RESCHEDULED' | 'COMPLETED';
  meeting_link?: string;
  user_a?: { id: string; first_name: string; last_name: string; email: string };
  user_b?: { id: string; first_name: string; last_name: string; email: string; user_b_details: { profession: string; availability?: any, years_experience: string } };
  has_review?: boolean;
  review?: { rating: number; comment?: string };
  proposed_date?: string;
  proposed_by?: string;
}