import { parse, ElementNode } from "svg-parser";
import fs from "fs/promises";
import _camelCase from "lodash/camelCase";
import _upperFirst from "lodash/upperFirst";
import prettier from "prettier";

const constructReact = (name: string, body: string, header: string) => `
import React from 'react';
${header}

export interface ${name}Props {
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

const ${name}: React.FC<${name}Props> = (props) => (
  ${body}
);

export default ${name};
`;

const parser = async (rawSvg: string, componentName: string) => {
  // const rawSvg = await fs.readFile(pathName, "utf-8");
  const parsed = parse(rawSvg);
  const rawText: any = [];
  const tags = new Set(["Linejoin", "Linecap"]);
  const ignoredProps = ["id", "dataName", "xmlns", "xmlns:xlink", "version"];
  let isWidthAssigned = false;
  let isHeightAssigned = false;

  const getFillColor = (() => {
    const fillColors = {
      outer: undefined,
      inner: undefined,
    };

    return (color: any) => {
      if (
        (color !== "none" && fillColors.outer === undefined) ||
        fillColors.outer === color
      ) {
        fillColors.outer = color;
        return `props.outerFill ?? "${color}"`;
      }

      if (
        (color !== "none" && fillColors.inner === undefined) ||
        fillColors.inner === color
      ) {
        fillColors.inner = color;
        return `props.innerFill ?? "${color}"`;
      }

      return color;
    };
  })();

  const getStrokeColor = (() => {
    const strokeColors = {
      outer: undefined,
      inner: undefined,
    };

    return (color: any) => {
      if (
        (color !== "none" && strokeColors.outer === undefined) ||
        strokeColors.outer === color
      ) {
        strokeColors.outer = color;
        return `props.outerStroke ?? "${color}"`;
      }

      if (
        (color !== "none" && strokeColors.inner === undefined) ||
        strokeColors.inner === color
      ) {
        strokeColors.inner = color;
        return `props.innerStroke ?? "${color}"`;
      }

      return color;
    };
  })();

  const normalizeUnit = (unit: string | number) => {
    return String(unit).replace(/px|pt|rem|em|\%/, "");
  };

  const walker = (items: ElementNode[]) => {
    return items.map((item) => {
      if (item.tagName) {
        item.tagName = _upperFirst(_camelCase(item.tagName));
        rawText.push("<" + item.tagName);
        tags.add(item.tagName);
      }

      if (item.properties) {
        const props: string[] = [""];
        Object.keys(item.properties).forEach((key) => {
          let val = item.properties![key];
          if (key.match(/\-/g)) {
            key = _camelCase(key);
          }

          switch (key) {
            case "width": {
              if (!isWidthAssigned) {
                val = `props.width ?? ${normalizeUnit(val)}`;
                isWidthAssigned = true;
              }
              break;
            }
            case "height": {
              if (!isHeightAssigned) {
                val = `props.height ?? ${normalizeUnit(val)}`;
                isHeightAssigned = true;
              }
              break;
            }
            case "strokeWidth": {
              val = `props.strokeWidth ?? ${normalizeUnit(val)}`;
              break;
            }
            case "strokeLinecap": {
              val = `props.strokeLinecap ?? "${normalizeUnit(val)}"`;
              break;
            }
            case "strokeLinejoin": {
              val = `props.strokeLinejoin ?? "${normalizeUnit(val)}"`;
              break;
            }
            case "fill": {
              val = getFillColor(val);
              break;
            }
            case "stroke": {
              val = getStrokeColor(val);
              break;
            }
            default:
          }

          if (!ignoredProps.includes(key)) {
            if (typeof val === "string" && !val.match(/^props/)) {
              props.push(`${key}="${val}"`);
            } else {
              props.push(`${key}={${val}}`);
            }
          }
        });
        rawText.push(props.join(" "));
      }

      if (item.children?.length > 0) {
        rawText.push(">");
        item.children = walker(item.children as ElementNode[]);
        rawText.push(`</${item.tagName}>`);
      } else {
        rawText.push(" />");
      }

      return item;
    });
  };

  walker(parsed.children as ElementNode[]);

  const bodyText = rawText.join("");
  const headerText = `import {${Array.from(tags).join(
    ","
  )}} from "react-native-svg";`;
  const reactText = constructReact(componentName, bodyText, headerText);

  return prettier.format(reactText, {
    parser: "babel-ts",
  });
};

export default parser;
