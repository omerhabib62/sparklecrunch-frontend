export type UserRole = 'client' | 'freelancer';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  profileCompleted?: boolean;
}
