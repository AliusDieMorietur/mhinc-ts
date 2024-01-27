import { Readable } from "node:stream";
import { URL } from "node:url";

import { milliseconds } from "./common.js";
import { ContextError } from "./error.js";
import { JSONValue } from "./json.js";

export type HttpRequestOptions = {
  method: string;
  body?: JSONValue;
  headers?: Record<string, string>;
  query?: Record<string, string>;
  timeout?: milliseconds;
};

export type HttpJsonResult<T = JSONValue> = {
  data?: string;
  json?: T;
  ok: boolean;
  statusCode: number;
};

export type HttpResult = {
  data?: Readable | null;
  ok: boolean;
  statusCode: number;
};

export const assertRequestOk = <T>(
  msg: string,
  res: HttpJsonResult<T>,
  context?: Record<string, unknown>,
): asserts res is HttpJsonResult<T> & { ok: true; json: T } => {
  if (!res.ok) {
    throw new ContextError(`Request failed ${msg}`, {
      data: res.json ? null : res.data,
      json: res.json,
      statusCode: res.statusCode,
      ...context,
    });
  }
};

export interface HttpServiceI {
  request(url: string | URL, options: HttpRequestOptions): Promise<HttpResult>;

  requestJson<T = JSONValue>(
    url: string | URL,
    options: HttpRequestOptions,
  ): Promise<HttpJsonResult<T>>;
}
