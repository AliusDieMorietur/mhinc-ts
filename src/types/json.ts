export type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JSONValue }
  | JSONValue[];

export type JSONObject = {
  [key: string]: JSONValue;
};

export type JSONArray = JSONValue[];

export type RawJSONString = string;
