import React from "react";
import { Svg, Path } from "react-native-svg";

export interface IconProps {
  outerFill?: string;
  innerFill?: string;
  outerStroke?: string;
  innerStroke?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
  strokeLinecap?: "butt" | "round" | "square";
  strokeLinejoin: "arcs" | "bevel" | "miter" | "miter-clip" | "round";
}

const Icon: React.FC<IconProps> = (props) => (
  <Svg
    width={props.width ?? 24}
    height={props.height ?? 24}
    viewBox="0 0 48 48"
    fill={props.outerFill ?? "none"}
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M4 19.313V9H44V19.313C41.8815 20.068 40.3636 22.1053 40.3636 24.5C40.3636 26.8947 41.8815 28.932 44 29.687V40H4V29.687C6.11853 28.932 7.63636 26.8947 7.63636 24.5C7.63636 22.1053 6.11853 20.068 4 19.313Z"
      fill={props.innerFill ?? "#333"}
      stroke={props.outerStroke ?? "#333"}
      strokeWidth={props.strokeWidth ?? 4}
      strokeLinejoin={props.strokeLinejoin ?? "round"}
    />
    <Path
      d="M19 16L24 21L29 16"
      stroke={props.innerStroke ?? "#FFF"}
      strokeWidth={props.strokeWidth ?? 4}
      strokeLinecap={props.strokeLinecap ?? "round"}
      strokeLinejoin={props.strokeLinejoin ?? "round"}
    />
    <Path
      d="M18 22H30"
      stroke={props.innerStroke ?? "#FFF"}
      strokeWidth={props.strokeWidth ?? 4}
      strokeLinecap={props.strokeLinecap ?? "round"}
      strokeLinejoin={props.strokeLinejoin ?? "round"}
    />
    <Path
      d="M18 28.1667H30"
      stroke={props.innerStroke ?? "#FFF"}
      strokeWidth={props.strokeWidth ?? 4}
      strokeLinecap={props.strokeLinecap ?? "round"}
      strokeLinejoin={props.strokeLinejoin ?? "round"}
    />
    <Path
      d="M24 22V34"
      stroke={props.innerStroke ?? "#FFF"}
      strokeWidth={props.strokeWidth ?? 4}
      strokeLinecap={props.strokeLinecap ?? "round"}
      strokeLinejoin={props.strokeLinejoin ?? "round"}
    />
  </Svg>
);

export default Icon;
