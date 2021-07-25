import _camelCase from "lodash/camelCase";
import _upperFirst from "lodash/upperFirst";
import path from "path";
import fs from "fs";
import parser from "./parser";
import { Command } from "commander";
import { readdir } from "fs/promises";
import ora from "ora";

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

const program = new Command();
program.argument("<sourceDir>").requiredOption("-o --output <value>");

program.action(async (sourcePath: string, { output }) => {
  const spinner = ora("generating components").start();
  const cwd = process.cwd();
  const outputPath = output.match(/^(\~|\/)/) ? output : path.join(cwd, output);
  sourcePath = sourcePath.match(/^(\~|\/)/)
    ? sourcePath
    : path.join(cwd, sourcePath);

  const files = await getFiles(sourcePath);
  const filesIterator = files[Symbol.iterator]();

  const iterate = () => {
    const filePath = filesIterator.next().value;

    if (!filePath) {
      spinner.stop();
      process.exit(0);
    }

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
        (error) => {
          if (error) {
            console.warn(`error converting: ${filePath}`);
          } else {
            spinner.text = `${componentName + ".tsx"} generated`;
          }
        }
      );

      iterate();
    });
  };

  iterate();
  // files.forEach((filePath) => {

  // });
});

program.parse(process.argv);
