# rnsvg-generator

[![npm version](https://badge.fury.io/js/rnsvg-generator.svg)](https://www.npmjs.com/package/rnsvg-generator)
[![build](https://github.com/warungpintar/rnsvg-generator/actions/workflows/ci.yml/badge.svg)](https://github.com/warungpintar/rnsvg-generator/actions/workflows/ci.yml)

convert any svg files into programmable React Component that compatible to `react-native-svg`

## Usage

```bash
npx rnsvg-generator source-path-or-folder -o output-path-or-folder
```

or install it globally

```bash
npm i -g rnsvg-generator
```

## Example

this svg code

```svg
<svg height="100" width="100">
  <circle class="circle" cx="50" cy="50" r="50" stroke-width="1" fill="#86bc25" fill-opacity="0.4" />
  <circle class="circle" cx="50" cy="50" r="35" stroke-width="1" fill="black" />
  <circle class="circle" cx="50" cy="50" r="34" stroke-width="2" fill="#86bc25" />
</svg>
```

will be converted into

```tsx
import React from "react";
import { Linejoin, Linecap, Svg, Path } from "react-native-svg";

export interface BillProps {
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

const Bill: React.FC<BillProps> = (props) => (
  <Svg
    width={props.width ?? 48}
    height={props.height ?? 48}
    viewBox="0 0 48 48"
    fill="none"
  >
    <Path
      d="M10 6C10 4.89543 10.8954 4 12 4H36C37.1046 4 38 4.89543 38 6V44L31 39L24 44L17 39L10 44V6Z"
      fill={props.outerFill ?? "#2F88FF"}
      stroke={props.outerStroke ?? "black"}
      strokeWidth={props.strokeWidth ?? 4}
      strokeLinecap={props.strokeLinecap ?? "round"}
      strokeLinejoin={props.strokeLinejoin ?? "round"}
    />
    <Path
      d="M18 22L30 22"
      stroke={props.innerStroke ?? "white"}
      strokeWidth={props.strokeWidth ?? 4}
      strokeLinecap={props.strokeLinecap ?? "round"}
      strokeLinejoin={props.strokeLinejoin ?? "round"}
    />
    <Path
      d="M18 30L30 30"
      stroke={props.innerStroke ?? "white"}
      strokeWidth={props.strokeWidth ?? 4}
      strokeLinecap={props.strokeLinecap ?? "round"}
      strokeLinejoin={props.strokeLinejoin ?? "round"}
    />
    <Path
      d="M18 14L30 14"
      stroke={props.innerStroke ?? "white"}
      strokeWidth={props.strokeWidth ?? 4}
      strokeLinecap={props.strokeLinecap ?? "round"}
      strokeLinejoin={props.strokeLinejoin ?? "round"}
    />
  </Svg>
);

export default Bill;
```

## License

MIT

![Hi-Five](https://media.giphy.com/media/JhThbOq62vwn6/giphy.gif)
