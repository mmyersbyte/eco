export interface Register {
  id: string;
  email: string;
  senha: string;
  codinome: string;
  genero: 'M' | 'F' | 'O';
  avatar_url: string;
  created_at: string;
  updated_at: string;
}
