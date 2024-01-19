export type Brand<K, T> = K & { __brand: T };

export type UrlString = string;

export type milliseconds = number;

export const toMilliseconds = (s: seconds): milliseconds => s * 1000;

export type seconds = number;

export const toSeconds = (ms: milliseconds): seconds => ms / 1000;
