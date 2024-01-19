export type User = {
  id: string;
  name: string;
};

export type UserBase = Omit<User, "id">;
