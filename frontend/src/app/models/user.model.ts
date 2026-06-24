// Shape of the logged-in user (matches the backend response)
export interface User {
  id: string;
  _id?: string;          // list/admin endpoints return Mongo's _id
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'staff' | 'patient';
  createdAt?: string;
}

// login/register response -> token + user
export interface AuthResponse {
  token: string;
  user: User;
}
