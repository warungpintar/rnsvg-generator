import path from "path";
import { PathLike } from "fs";
import fs from "fs";

export const readdir = (path: PathLike) => {
  try {
    return fs.readdirSync(path, { withFileTypes: true });
  } catch {
    return [];
  }
};

export const getSvgFiles = (sourcePath: string): string[] => {
  const dirents = readdir(sourcePath);
  const files = dirents.map((file) => {
    const resource = path.resolve(sourcePath, file.name);
    return file.isDirectory() ? getSvgFiles(resource) : resource;
  });

  return Array.prototype
    .concat(...files)
    .filter((file) => path.extname(file) === ".svg");
};
