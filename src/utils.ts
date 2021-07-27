import path from "path";
import { PathLike } from "fs";
import fs from "fs";
import _camelCase from "lodash/camelCase";
import { flow } from "fp-ts/lib/function";

const IGNORED_UNITS_RE = /px|pt|rem|em|\%/;
const NIL_COLORS_IN_CSS = ["none"];

type MemoizedColors = {
  outer?: string;
  inner?: string;
};

export const readdir = (path: PathLike) => {
  try {
    return fs.readdirSync(path, { withFileTypes: true });
  } catch {
    return [];
  }
};

export const getSvgFiles = (
  sourcePath: string,
  recursive: boolean = true
): string[] => {
  const dirents = readdir(sourcePath);
  const files = dirents.map((file) => {
    const resource = path.resolve(sourcePath, file.name);
    return recursive && file.isDirectory() ? getSvgFiles(resource) : resource;
  });

  return Array.prototype
    .concat(...files)
    .filter((file) => path.extname(file) === ".svg");
};

export const normalizePropsKey = (key: string) =>
  key.match(/\-/g) ? _camelCase(key) : key;

/**
 * create memoized function for
 * color assignment, inner / outer / not assigned to both
 * @returns
 */
export const createColorMemoizer = () => {
  const colors: MemoizedColors = { inner: undefined, outer: undefined };
  return (color: string) => {
    const result = { outer: false, inner: false };

    if (
      (!NIL_COLORS_IN_CSS.includes(color) && colors.outer === undefined) ||
      colors.outer === color
    ) {
      colors.outer = color;
      result.outer = true;
      return result;
    }

    if (
      (!NIL_COLORS_IN_CSS.includes(color) && colors.inner === undefined) ||
      colors.inner === color
    ) {
      colors.inner = color;
      result.inner = true;
      return result;
    }

    return result;
  };
};

/**
 * remove any units in a number
 * eg: 10px become 10
 * @returns
 */
export const normalizeUnit = (val: string | number) =>
  String(val).replace(IGNORED_UNITS_RE, "").trim();

export const wrapReactPropsValue = (val: unknown) => {
  if (typeof val !== "string") return val;

  if (isNaN(Number(val))) {
    return `"${val}"`;
  }

  return val;
};

export const stringifyProps = (
  props: Record<string, unknown>,
  programmableKeys: string[] = [],
  ignoredKeys: string[] = []
) => {
  return Object.keys(props).reduce((acc, value) => {
    const propsVal = flow(
      normalizeUnit,
      wrapReactPropsValue
    )(props[value] as string);
    const normalizedKey = normalizePropsKey(value);

    if (ignoredKeys.includes(normalizedKey)) {
      return acc;
    }

    const hasFallback = programmableKeys.includes(normalizedKey);

    if (hasFallback) {
      return acc.concat(
        `${normalizedKey}={props.${normalizedKey} ?? ${propsVal}}\n`
      );
    }

    return acc.concat(`${normalizedKey}={${propsVal}}\n`);
  }, "");
};
