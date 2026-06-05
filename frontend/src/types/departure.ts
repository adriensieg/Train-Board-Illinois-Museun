export interface Departure {
  id: string;
  thumbnail: string;
  description: string;
  platform: string;
  departure: string; // "HH:MM" 24h
}

export type DepartureCreate = Omit<Departure, "id">;
export type DepartureUpdate = Partial<DepartureCreate>;

export interface AuthStatus {
  authenticated: boolean;
  user: string | null;
}
