import crypto from "node:crypto";
import { ServiceError } from "../types/error";
import { User, UserBase } from "../types/user";

export class UserStorage {
  private users: User[];

  constructor() {
    this.users = [];
  }

  async getList(): Promise<User[]> {
    return this.users;
  }

  async create(userBase: UserBase): Promise<User["id"]> {
    const user = {
      id: crypto.randomUUID(),
      ...userBase,
    };
    this.users.push(user);
    return user.id;
  }

  async get(id: User["id"]): Promise<User> {
    const user = this.users.find((user) => user.id === id);
    if (!user) {
      throw new ServiceError(`User not found with id: ${id}`);
    }
    return user;
  }

  async update(id: User["id"], delta: Partial<UserBase>): Promise<User["id"]> {
    const userIndex = this.users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new ServiceError(`User not found with id: ${id}`);
    }
    this.users[userIndex] = { ...this.users[userIndex], ...delta };
    return id;
  }

  async delete(id: User["id"]): Promise<User["id"]> {
    this.users = this.users.filter((user) => user.id !== id);
    return id;
  }

  async getByChatIdOrCreate(base: UserBase): Promise<User> {
    const user = this.users.find((user) => user.telegramChatId === base.telegramChatId);
    if (user) return user;
    const id = await this.create(base);
    return await this.get(id);
  }

  async getByChatId(telegramChatId: User["telegramChatId"]): Promise<User> {
    const user = this.users.find((user) => user.telegramChatId === telegramChatId);
    if (!user) {
      throw new ServiceError(`User not found with chatId: ${telegramChatId}`);
    }
    return user;
  }
}
