import { ServiceError } from "../types/error";
import { State } from "../types/runner";
import { User } from "../types/user";

export class StateManager {
  private states: Record<User["id"], State>;
  constructor() {
    this.states = {};
  }

  async get(id: User["id"]) {
    const state = this.states[id];
    if (!state) {
      throw new ServiceError(`State not found for id: "${id}"`);
    }
    return state;
  }

  async create(id: User["id"], state: State) {
    this.states[id] = state;
    return id;
  }

  async getOrCreate(id: User["id"], fallback: State) {
    const state = this.states[id];
    if (state) return state;
    await this.create(id, fallback);
    return await this.get(id);
  }
}
