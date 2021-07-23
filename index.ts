import _camelCase from "lodash/camelCase";
import _upperFirst from "lodash/upperFirst";
import path from "path";
import fs from "fs/promises";
import parser from "./parser";

const iconPath = path.resolve(__dirname, "icon.svg");
const dirname = path.dirname(iconPath);
const componentName = _upperFirst(_camelCase(path.basename(iconPath, ".svg")));

parser(iconPath, componentName).then((text) => {
  fs.writeFile(path.join(dirname, componentName + ".tsx"), text, "utf-8");
});
