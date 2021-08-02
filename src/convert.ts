import { parse, ElementNode } from "svg-parser";
import _camelCase from "lodash/camelCase";
import _upperFirst from "lodash/upperFirst";
import prettier from "prettier";
import { createColorMemoizer, stringifyProps, constructReact } from "./utils";

const convert = async (
  rawSvg: string,
  componentName: string,
  isWeb: boolean = false
) => {
  const parsed = parse(rawSvg);
  const tags = new Set(["Linejoin", "Linecap"]);
  const ignoredProps = [
    "id",
    "dataName",
    "xmlns",
    "xmlns:xlink",
    "version",
    "fill",
    "stroke",
  ];

  const getFillColor = createColorMemoizer();
  const getStrokeColor = createColorMemoizer();

  const walker = (items: ElementNode[]) => {
    return items.reduce((acc, value) => {
      let nodeString = "";

      if (value.tagName) {
        const normalizedTagName = isWeb
          ? _camelCase(value.tagName)
          : _upperFirst(_camelCase(value.tagName));
        tags.add(normalizedTagName);
        nodeString += "<" + normalizedTagName;
        const props = value.properties ?? {};
        const programmableProps = [
          "strokeWidth",
          "strokeLinecap",
          "strokeLinejoin",
        ];

        if (value.tagName === "svg") {
          // only assign dimension props into root / svg tag
          programmableProps.push("width", "height");
        }

        const stringifiedProps = stringifyProps(
          props,
          programmableProps,
          ignoredProps
        );

        nodeString += " " + stringifiedProps;

        if (props.fill) {
          if (getFillColor(props.fill as string).outer) {
            nodeString += `fill={props.outerFill ?? "${props.fill}"}`;
          } else if (getFillColor(props.fill as string).inner) {
            nodeString += `fill={props.innerFill ?? "${props.fill}"}`;
          } else {
            nodeString += `fill="${props.fill}"`;
          }
        }

        if (props.stroke) {
          if (getStrokeColor(props.stroke as string).outer) {
            nodeString += `stroke={props.outerStroke ?? "${props.stroke}"}`;
          } else if (getStrokeColor(props.stroke as string).inner) {
            nodeString += `stroke={props.innerStroke ?? "${props.stroke}"}`;
          } else {
            nodeString += `stroke="${props.stroke}"`;
          }
        }

        if (value.children?.length > 0) {
          nodeString +=
            ">" +
            walker(value.children as ElementNode[]) +
            "</" +
            normalizedTagName +
            ">";
        } else {
          nodeString += "/>";
        }
      }

      return acc.concat(nodeString).concat("\n");
    }, "");
  };

  const bodyText = walker(parsed.children as ElementNode[]);
  const headerText = isWeb
    ? ""
    : `import {${Array.from(tags).join(",")}} from "react-native-svg";`;
  const reactText = constructReact(componentName, bodyText, headerText);

  return prettier.format(reactText, {
    parser: "babel-ts",
  });
};

export default convert;
