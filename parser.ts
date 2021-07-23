import { parse } from "svg-parser";
import fs from "fs/promises";
import _camelCase from "lodash/camelCase";
import _upperFirst from "lodash/upperFirst";
import prettier from "prettier";

type Defs = {
  tagName: string;
  properties: Record<string, any>;
  children: Defs[];
};

const parser = async (pathName: string, componentName: string) => {
  const rawSvg = await fs.readFile(pathName, "utf-8");
  const parsed = parse(rawSvg);
  const rawText: any = [];
  const tags = new Set();

  const getFillColor = (() => {
    const fillColors = {
      outer: undefined,
      inner: undefined,
    };

    return (color: any) => {
      if (fillColors.outer === undefined || fillColors.outer === color) {
        fillColors.outer = color;
        return `props.outerFill ?? "${color}"`;
      }

      fillColors.inner = color;
      return `props.innerFill ?? "${color}"`;
    };
  })();

  const getStrokeColor = (() => {
    const strokeColors = {
      outer: undefined,
      inner: undefined,
    };

    return (color: any) => {
      if (strokeColors.outer === undefined || strokeColors.outer === color) {
        strokeColors.outer = color;
        return `props.outerStroke ?? "${color}"`;
      }

      strokeColors.inner = color;
      return `props.innerStroke ?? "${color}"`;
    };
  })();

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
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin: 'arcs' | 'bevel' | 'miter' | 'miter-clip' | 'round';
}

const ${name}: React.FC<${name}Props> = (props) => (
  ${body}
);

export default ${name};
`;

  const walker = (items: Defs[]) => {
    return items.map((item) => {
      if (item.tagName) {
        item.tagName = _upperFirst(_camelCase(item.tagName));
        rawText.push("<" + item.tagName);
        tags.add(item.tagName);
      }

      if (item.properties) {
        const props: string[] = [""];
        Object.keys(item.properties).forEach((key) => {
          let val = item.properties[key];
          if (key.match(/\-/g)) {
            key = _camelCase(key);
          }

          switch (key) {
            case "width": {
              val = `props.width ?? ${val}`;
              break;
            }
            case "height": {
              val = `props.height ?? ${val}`;
              break;
            }
            case "strokeWidth": {
              val = `props.strokeWidth ?? ${val}`;
              break;
            }
            case "strokeLinecap": {
              val = `props.strokeLinecap ?? "${val}"`;
              break;
            }
            case "strokeLinejoin": {
              val = `props.strokeLinejoin ?? "${val}"`;
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

          if (typeof val === "string" && !val.match(/^props/)) {
            props.push(`${key}="${val}"`);
          } else {
            props.push(`${key}={${val}}`);
          }
        });
        rawText.push(props.join(" "));
      }

      if (item.children?.length > 0) {
        rawText.push(">");
        item.children = walker(item.children);
        rawText.push(`</${item.tagName}>`);
      } else {
        rawText.push(" />");
      }

      return item;
    });
  };

  // @ts-ignore
  walker(parsed.children);

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
