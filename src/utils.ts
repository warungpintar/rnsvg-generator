import path from "path";
import { PathLike } from "fs";
import fs from "fs";

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
