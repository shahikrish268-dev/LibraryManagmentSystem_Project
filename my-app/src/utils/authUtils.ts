import { jwtDecode } from 'jwt-decode';
import { TokenService } from '../services/token.service';

interface DecodedToken {
  role: string;
  username: string;
  exp: number;
}

export function getUserRole(): string | null {
  const token = TokenService.getAccessToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.role;
  } catch {
    return null;
  }
}

export function canEdit(): boolean {
  const role = getUserRole();
  return role === 'admin' || role === 'librarian';
}

export function isAdmin(): boolean {
  return getUserRole() === 'admin';
}