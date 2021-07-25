# rnsvg-generator

## Usage

```bash
npx rnsvg-generator source-folder -o output-folder
```

or install it globally

```bash
npm i -g rnsvg-generator
```

## Example
this svg code

```svg
<?xml version="1.0" encoding="UTF-8"?><svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6C10 4.89543 10.8954 4 12 4H36C37.1046 4 38 4.89543 38 6V44L31 39L24 44L17 39L10 44V6Z" fill="#2F88FF" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 22L30 22" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 30L30 30" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 14L30 14" stroke="#FFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
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
