import { Role } from '../enums/role.enum';

export interface User {
  id: string;
  email: string;
  role: Role;
  verified?: boolean;
  firstName?: string;
  lastName?: string;
  picture?: string | null;
}

export interface LoginResponse {
  message: string;
  user?: User;
  token?: string;
  expiresIn?: string;
}
