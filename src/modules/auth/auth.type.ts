export type RegisterResponse = {
  id: number;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

export type LoginResponse = {
  id: number;
  token: string;
};