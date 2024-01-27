import { JSONObject } from "./json.js";

export function expandError(err: Error & { toJSON?: () => Record<string, unknown> }) {
  const base = typeof err.toJSON === "function" ? err.toJSON() : { ...err };
  const name =
    Object.prototype.toString.call(err.constructor) === "[object Function]"
      ? err.constructor.name
      : err.name;
  return { ...base, name, message: err.message, stack: err.stack };
}

export function expandErrorsToJson(data: Record<string, unknown>): Record<string, unknown> {
  for (const key of Object.keys(data)) {
    const val = data[key];
    if (val instanceof Error) {
      data[key] = expandError(val);
    }
  }
  return data;
}

export class ContextError extends Error {
  public readonly name: string = "ContextError";
  private readonly context: Record<string, unknown>;

  constructor(message: string, context: Record<string, unknown> = {}) {
    super(message);
    this.context = context;
    this.name = this.constructor.name;
  }

  toJSON(): JSONObject {
    const context = expandErrorsToJson({ ...this.context });
    return { ...this, message: this.message, stack: this.stack, context };
  }
}

export class IllegalArgumentError extends ContextError {}

export class NotFoundError extends ContextError {}

export class AuthenticationError extends ContextError {}

export class ApiError extends ContextError {}

export class ServiceError extends ContextError {}

export class InitError extends ContextError {}
