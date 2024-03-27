export type UserType = {
  id: number;
  name: string;
  email: string;
  status: "active" | "blocked" | null;
  role: "user" | "admin" | null;
  createdAt: Date | null;
};

export type AuthType = UserType & {
  access_token: string;
};
