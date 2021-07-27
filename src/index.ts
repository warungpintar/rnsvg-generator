import _camelCase from "lodash/camelCase";
import _upperFirst from "lodash/upperFirst";
import path from "path";
import fs from "fs";
import { readFile, mkdir, writeFile } from "fs/promises";
import { Command } from "commander";
import ora from "ora";
import convert from "./convert";
import { getSvgFiles } from "./utils";

const writeToJsxComponent = async (filePath: string, outputPath: string) => {
  try {
    const componentName = _upperFirst(
      _camelCase(path.basename(filePath, ".svg"))
    );

    const rawSvgText = await readFile(filePath, "utf-8");
    const componentText = await convert(rawSvgText, componentName);
    const isHasExtension = outputPath.match(/\.+[a-zA-Z]+$/);

    if (!isHasExtension) {
      await mkdir(outputPath, { recursive: true });
      await writeFile(
        path.join(outputPath, componentName + ".tsx"),
        componentText,
        { encoding: "utf-8" }
      );
    } else {
      await mkdir(path.dirname(outputPath), { recursive: true });
      await writeFile(outputPath, componentText, { encoding: "utf-8" });
    }
    return true;
  } catch (error) {
    return false;
  }
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
    await writeToJsxComponent(sourcePath, outputPath);
  }

  if (stats.isDirectory()) {
    const files = getSvgFiles(sourcePath);
    const filesIterator = files[Symbol.iterator]();

    const iterate = async () => {
      const filePath = filesIterator.next().value;

      if (filePath) {
        const isSuccess = await writeToJsxComponent(filePath, outputPath);

        if (isSuccess) {
          spinner.text = `${path.basename(filePath)} converted successfully`;
        } else {
          console.error(`error converting ${filePath}`);
        }

        await iterate();
      }
    };

    await iterate();
  }

  spinner.stop();
  process.exit(0);
});

program.parse(process.argv);
