import { normalizeUnit } from "../src/utils";

const testCases = [
  ["10px", "10"],
  ["100rem", "100"],
  [" 50 em", "50"],
  ["20", "20"],
];

describe("unit normalizer", () => {
  it.each(testCases)(`should remove unit %s in %s`, (input, expected) => {
    expect(normalizeUnit(input)).toEqual(expected);
  });
});
