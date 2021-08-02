import { createColorMemoizer } from "../src/utils";

describe("color memoizer", () => {
  const memoized = createColorMemoizer();

  it("should memoize color correctly", () => {
    expect(memoized("#aaaaaa")).toStrictEqual({
      outer: true,
      inner: false,
    });
    expect(memoized("#bbbbbb")).toStrictEqual({
      outer: false,
      inner: true,
    });
    expect(memoized("#aaaaaa")).toStrictEqual({
      outer: true,
      inner: false,
    });
    expect(memoized("#bbbbbb")).toStrictEqual({
      outer: false,
      inner: true,
    });
    expect(memoized("#0ff00f")).toStrictEqual({
      outer: false,
      inner: false,
    });
    expect(memoized("none")).toStrictEqual({
      outer: false,
      inner: false,
    });
  });

  it("should works in multiple initialization", () => {
    const memoized2 = createColorMemoizer();

    expect(memoized2("#aaaaaa")).toStrictEqual({
      outer: true,
      inner: false,
    });
    expect(memoized2("#bbbbbb")).toStrictEqual({
      outer: false,
      inner: true,
    });
    expect(memoized2("#aaaaaa")).toStrictEqual({
      outer: true,
      inner: false,
    });
    expect(memoized2("#bbbbbb")).toStrictEqual({
      outer: false,
      inner: true,
    });
    expect(memoized2("#ababab")).toStrictEqual({
      outer: false,
      inner: false,
    });
    expect(memoized2("none")).toStrictEqual({
      outer: false,
      inner: false,
    });
  });
});
