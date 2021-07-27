import { stringifyProps } from "../src/utils";

describe("stringify props", () => {
  const props = {
    fill: "#fafafa",
    lineCap: "20px",
    "string-cap": 30,
    width: "30rem",
    height: "40%",
  };

  it("should return expected string", () => {
    expect(stringifyProps(props)).toBe(
      `fill={"#fafafa"}\nlineCap={20}\nstringCap={30}\nwidth={30}\nheight={40}\n`
    );
  });

  it("should return expected string with props fallback", () => {
    expect(stringifyProps(props, ["lineCap", "width"])).toBe(
      `fill={"#fafafa"}\nlineCap={props.lineCap ?? 20}\nstringCap={30}\nwidth={props.width ?? 30}\nheight={40}\n`
    );
  });

  it("should return expected string without ignored props", () => {
    expect(stringifyProps(props, [], ["lineCap", "width"])).toBe(
      `fill={"#fafafa"}\nstringCap={30}\nheight={40}\n`
    );
  });
});
