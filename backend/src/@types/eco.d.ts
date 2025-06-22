export interface Eco {
  id: string;
  user_id: string;
  thread_1: string;
  tags: string[];
  thread_2?: string | null;
  thread_3?: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}
