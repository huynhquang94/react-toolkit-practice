export type FormData = {
  email: string
  password: string
}

export type Error = {
  message: string;
  type: 'password' | 'email';
}