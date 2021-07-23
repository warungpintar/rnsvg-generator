import _camelCase from "lodash/camelCase";
import _upperFirst from "lodash/upperFirst";
import path from "path";
import fs from "fs";
import parser from "./parser";
import { Command } from "commander";
import { readdir } from "fs/promises";

async function getFiles(dir: string): Promise<string[]> {
  const dirents = await readdir(dir, { withFileTypes: true });
  const files: any[] | Promise<any> = await Promise.all(
    // @ts-ignore
    dirents.map((dirent) => {
      const res = path.resolve(dir, dirent.name);
      return dirent.isDirectory() ? getFiles(res) : res;
    })
  );
  return Array.prototype
    .concat(...files)
    .filter((file) => path.extname(file) === ".svg");
}

// program.requiredOption("-o --output <value>");
const program = new Command();
program.argument("<sourceDir>").option("-o --output <value>");

program.action(async (sourcePath, { output }) => {
  const cwd = process.cwd();
  const outputPath = output ? path.join(cwd, output) : cwd;
  sourcePath = path.join(cwd, sourcePath);

  const files = await getFiles(sourcePath);
  const promises = files.map((filePath) => {
    return new Promise((resolve) => {
      const componentName = _upperFirst(
        _camelCase(path.basename(filePath, ".svg"))
      );
      parser(filePath, componentName).then((text) => {
        fs.mkdirSync(outputPath, { recursive: true });
        fs.writeFile(
          path.join(outputPath, componentName + ".tsx"),
          text,
          {
            encoding: "utf-8",
          },
          () => {
            console.log(
              "success generating",
              outputPath + "/" + componentName + ".tsx"
            );
            resolve(null);
          }
        );
      });
    });
  });

  await Promise.all(promises);
});

program.parse(process.argv);
