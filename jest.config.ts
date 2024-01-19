export default {
  preset: "ts-jest/presets/js-with-ts",
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  // transform: {
  //   '^.+\\.[tj]sx?$': ['ts-jest', { useESM: true }],
  // },
  testEnvironment: "node",
  testRegex: ".*\\.spec\\.ts$",
  modulePathIgnorePatterns: ["<rootDir>/dist"],
  collectCoverageFrom: ["src/**/*.(t|j)s"],
  testTimeout: 20000,
  rootDir: ".",
};
