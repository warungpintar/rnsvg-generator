import _camelCase from "lodash/camelCase";
import _upperFirst from "lodash/upperFirst";
import path from "path";
import fs from "fs";
import parser from "./parser";
import { Command } from "commander";
import { readdir } from "fs/promises";
import ora from "ora";

function getFile(file: string) {
  return path.resolve(process.cwd(), file);
}

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

const parseToJSXComponent = (
  filePath: string,
  outputPath: string,
  callback?: () => any
) => {
  const spinner = ora("generating components").start();

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
          if (callback) {
            callback();
          } else {
            process.exit(0);
          }
        }
      }
    );
  });
};

const program = new Command();
program.argument("<sourceDir>").requiredOption("-o --output <value>");

program.action(async (sourcePath: string, { output }) => {
  const stats = fs.lstatSync(sourcePath);
  const cwd = process.cwd();
  const outputPath = output.match(/^(\~|\/)/) ? output : path.join(cwd, output);
  sourcePath = sourcePath.match(/^(\~|\/)/)
    ? sourcePath
    : path.join(cwd, sourcePath);

  if (stats.isFile()) {
    const filePath = getFile(sourcePath);
    parseToJSXComponent(filePath, outputPath);
  }

  if (stats.isDirectory()) {
    const files = await getFiles(sourcePath);
    const filesIterator = files[Symbol.iterator]();

    const iterate = () => {
      const filePath = filesIterator.next().value;
      parseToJSXComponent(filePath, outputPath, iterate);
    };

    iterate();
  }
});

program.parse(process.argv);
