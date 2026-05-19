export type UserRole = "user_reconversion" | "professional" | (string & {});

export type Availability = Record<string, string[]>;

export interface ProfileDetails {
  availability?: Availability;
  [key: string]: unknown;
}

export interface Profile {
  id?: string;
  role?: UserRole;
  details?: ProfileDetails;
  [key: string]: unknown;
}
