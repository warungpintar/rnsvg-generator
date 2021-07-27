import convert from "../src/convert";

const input = `
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="48" height="48" fill="white" fill-opacity="0.01"/>
<path d="M18 23.9372V10C18 6.68629 20.6863 4 24 4C27.3137 4 30 6.68629 30 10V12.0057" stroke="black" stroke-width="4" stroke-linecap="round"/>
<path d="M30 24.0035V38C30 41.3137 27.3137 44 24 44C20.6863 44 18 41.3137 18 38V35.97" stroke="black" stroke-width="4" stroke-linecap="round"/>
<path d="M24 30H9.98415C6.67919 30 4 27.3137 4 24C4 20.6863 6.67919 18 9.98415 18H11.9886" stroke="black" stroke-width="4" stroke-linecap="round"/>
<path d="M24 18H37.9888C41.3087 18 44 20.6863 44 24C44 27.3137 41.3087 30 37.9888 30H36.0663" stroke="black" stroke-width="4" stroke-linecap="round"/>
</svg>
`;

const expected = `import React from "react";
import { Linejoin, Linecap, Svg, Rect, Path } from "react-native-svg";

export interface ApiAppProps {
  outerFill?: string;
  innerFill?: string;
  outerStroke?: string;
  innerStroke?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
  strokeLinecap?: Linecap;
  strokeLinejoin?: Linejoin;
}

const ApiApp: React.FC<ApiAppProps> = (props) => (
  <Svg
    width={props.width ?? 48}
    height={props.height ?? 48}
    viewBox={"0 0 48 48"}
    fill="none"
  >
    <Rect
      width={48}
      height={48}
      fillOpacity={0.01}
      fill={props.outerFill ?? "white"}
    />
    <Path
      d={
        "M18 23.9372V10C18 6.68629 20.6863 4 24 4C27.3137 4 30 6.68629 30 10V12.0057"
      }
      strokeWidth={props.strokeWidth ?? 4}
      strokeLinecap={props.strokeLinecap ?? "round"}
      stroke={props.outerStroke ?? "black"}
    />
    <Path
      d={
        "M30 24.0035V38C30 41.3137 27.3137 44 24 44C20.6863 44 18 41.3137 18 38V35.97"
      }
      strokeWidth={props.strokeWidth ?? 4}
      strokeLinecap={props.strokeLinecap ?? "round"}
      stroke={props.outerStroke ?? "black"}
    />
    <Path
      d={
        "M24 30H9.98415C6.67919 30 4 27.3137 4 24C4 20.6863 6.67919 18 9.98415 18H11.9886"
      }
      strokeWidth={props.strokeWidth ?? 4}
      strokeLinecap={props.strokeLinecap ?? "round"}
      stroke={props.outerStroke ?? "black"}
    />
    <Path
      d={
        "M24 18H37.9888C41.3087 18 44 20.6863 44 24C44 27.3137 41.3087 30 37.9888 30H36.0663"
      }
      strokeWidth={props.strokeWidth ?? 4}
      strokeLinecap={props.strokeLinecap ?? "round"}
      stroke={props.outerStroke ?? "black"}
    />
  </Svg>
);

export default ApiApp;
`;

describe("converter", () => {
  it("should convert svg into react component", async () => {
    const result = await convert(input, "ApiApp");
    expect(result).toStrictEqual(expected);
  });
});
