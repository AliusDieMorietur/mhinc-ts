import { milliseconds } from "../types/common";
import { ContextError } from "../types/error";
import { HttpJsonResult, HttpResult, HttpServiceI } from "../types/http";
import { JSONValue } from "../types/json";
import { safeParseJson } from "../utils/safeParseJson";
import { Buffer } from "node:buffer";
import streamWeb from "node:stream/web";
import { setTimeout } from "node:timers";
import { URL } from "node:url";

import { Readable } from "stream";

export interface HttpClientOptions {
  defaultTimeout?: milliseconds;
  // logger?: Logger;
}

export interface RequestOptions {
  method?: string;
  body?: JSONValue;
  headers?: Record<string, string>;
  query?: Record<string, string>;
  timeout?: milliseconds;
  keepalive?: boolean;
}

export async function* streamAsyncIterator<T>(stream: ReadableStream<T>): AsyncIterable<T> {
  // Get a lock on the stream
  const reader = stream.getReader();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

export class HttpService implements HttpServiceI {
  private readonly defaultTimeout?: milliseconds;
  // private readonly logger?: Logger;

  constructor({ defaultTimeout }: HttpClientOptions) {
    this.defaultTimeout = defaultTimeout;
  }

  requestBase = async (
    url: string | URL,
    { query, headers, timeout, body, ...requestOptions }: RequestOptions,
  ): Promise<{
    data: Body;
    statusCode: number;
    ok: boolean;
  }> => {
    // TODO: add retries
    let bodyString: string | null = null;
    if (body) {
      headers = headers ? { ...headers } : {};
      bodyString = JSON.stringify(body);
      headers["Content-type"] = "application/json";
      headers["Content-length"] = String(Buffer.byteLength(bodyString));
    }

    let done = false;
    let abortController: AbortController | null = null;
    if (timeout ?? this.defaultTimeout) {
      abortController = new AbortController();
      setTimeout(() => {
        if (done) return;
        done = true;
        abortController?.abort(new Error("Request timed out"));
      }, timeout ?? this.defaultTimeout).unref();
    }

    let hostname = null;
    try {
      const fullUrl = new URL(url.toString());
      hostname = fullUrl.hostname;
      if (query) {
        for (const [key, value] of Object.entries(query)) {
          fullUrl.searchParams.set(key, value);
        }
      }

      // if (!this.logger?.isLevelEnabled?.("debug")) {
      //   this.logger?.info({ hostname }, "outgoing http request started");
      // } else {
      //   this.logger?.debug(
      //     { fullUrl, body },
      //     "outgoing http request started (debug)"
      //   );
      // }

      const res = await fetch(fullUrl, {
        ...requestOptions,
        headers,
        body: bodyString,
        signal: abortController?.signal,
      });

      done = true;

      // if (!this.logger?.isLevelEnabled?.("debug")) {
      //   this.logger?.info(
      //     { hostname, statusCode: res.status, ok: res.ok },
      //     "outgoing http request finished"
      //   );
      // } else {
      //   this.logger?.debug(
      //     { fullUrl, body, statusCode: res.status, ok: res.ok },
      //     "outgoing http request finished (debug)"
      //   );
      // }

      return { data: res, statusCode: res.status, ok: res.ok };
    } catch (err: unknown) {
      // this.logger?.info({ hostname, err }, "outgoing http request failed");
      throw new ContextError("Http request failed", { cause: err });
    }
  };

  request = async (url: string | URL, options: RequestOptions): Promise<HttpResult> => {
    const res = await this.requestBase(url, options);

    return {
      data: res.data.body && Readable.fromWeb(res.data.body as streamWeb.ReadableStream),
      statusCode: res.statusCode,
      ok: res.ok,
    };
  };

  requestJson = async <T = JSONValue>(
    url: string | URL,
    options: RequestOptions,
  ): Promise<HttpJsonResult<T>> => {
    const res = await this.requestBase(url, options);
    const data = await res.data.text();
    const json = safeParseJson<T>(data);

    return { data, json, statusCode: res.statusCode, ok: res.ok };
  };
}
