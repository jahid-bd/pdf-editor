// types.ts
export interface UserProfile {
  id: number;
  username: string;
  email: string;
  // Add other properties as needed
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  // Add other properties as needed
}
