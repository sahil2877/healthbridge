// Shape of the logged-in user (matches the backend response)
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'staff';
}

// login/register response -> token + user
export interface AuthResponse {
  token: string;
  user: User;
}
