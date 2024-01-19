export const safeParseJson = <T>(s: string): T | undefined => {
  try {
    return JSON.parse(s) as T;
  } catch (error) {}
};
