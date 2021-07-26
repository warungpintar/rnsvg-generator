import _camelCase from "lodash/camelCase";
import _upperFirst from "lodash/upperFirst";
import path from "path";
import fs from "fs";
import { Command } from "commander";
import ora from "ora";
import convert from "./convert";
import { getSvgFiles } from "./utils";

const parseToJSXComponent = (filePath: string, outputPath: string) => {
  const componentName = _upperFirst(
    _camelCase(path.basename(filePath, ".svg"))
  );

  return new Promise((resolve) => {
    convert(filePath, componentName).then((text) => {
      const isHasExtension = outputPath.match(/\.+[a-zA-Z]+$/);

      if (!isHasExtension) {
        fs.mkdirSync(outputPath, { recursive: true });
      }

      fs.writeFile(
        isHasExtension
          ? outputPath
          : path.join(outputPath, componentName + ".tsx"),
        text,
        {
          encoding: "utf-8",
        },
        (error) => {
          if (error) {
            console.warn(`error converting: ${filePath}`);
          }

          resolve(null);
        }
      );
    });
  });
};

const program = new Command();
program.argument("<sourceDir>").requiredOption("-o --output <value>");

program.action(async (sourcePath: string, { output }) => {
  const spinner = ora("generating components").start();
  const cwd = process.cwd();
  const outputPath = output.match(/^(\~|\/)/) ? output : path.join(cwd, output);
  sourcePath = sourcePath.match(/^(\~|\/)/)
    ? sourcePath
    : path.join(cwd, sourcePath);
  const stats = fs.lstatSync(sourcePath);

  if (stats.isFile()) {
    await parseToJSXComponent(sourcePath, outputPath);
  }

  if (stats.isDirectory()) {
    const files = getSvgFiles(sourcePath);
    const filesIterator = files[Symbol.iterator]();

    const iterate = async () => {
      const filePath = filesIterator.next().value;

      if (filePath) {
        await parseToJSXComponent(filePath, outputPath);
        spinner.text = `${path.basename(filePath)} converted successfully`;
        await iterate();
      }
    };

    await iterate();
  }

  spinner.stop();
  process.exit(0);
});

program.parse(process.argv);
