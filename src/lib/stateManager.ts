import { ServiceError } from "../types/error";
import { State } from "../types/runner";
import { ChatId } from "../types/telegram";

export class StateManager {
  private states: Record<ChatId, State>;
  constructor() {
    this.states = {};
  }

  async get(chatId: ChatId) {
    const state = this.states[chatId];
    if (!state) {
      throw new ServiceError(`State not found for chatId: "${chatId}"`);
    }
    return state;
  }

  async create(chatId: ChatId, state: State) {
    this.states[chatId] = state;
    return chatId;
  }

  async getOrCreate(chatId: ChatId, fallback: State) {
    const state = this.states[chatId];
    if (state) return state;
    await this.create(chatId, fallback);
    return await this.get(chatId);
  }
}
