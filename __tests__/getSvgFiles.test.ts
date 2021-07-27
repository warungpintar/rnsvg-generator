import path from "path";
import { getSvgFiles } from "../src/utils";

describe("get svg files", () => {
  const fixturesPath = path.join(__dirname, "../fixtures");
  const svgFiles = getSvgFiles(fixturesPath);
  it("should have correct length", () => {
    expect(svgFiles).toHaveLength(6);
  });

  it("should return correct items", () => {
    expect(svgFiles).toContain(
      path.join(fixturesPath, "iconPark/Abstract/api-app.svg")
    );

    expect(svgFiles).toContain(path.join(fixturesPath, "login.svg"));
  });

  it("should ignore non svg files", () => {
    expect(svgFiles.includes(path.join(fixturesPath, "non-svg.png"))).toBe(
      false
    );
  });
});
