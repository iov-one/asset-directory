import stringify = require("json-stable-stringify");
import { Asset } from "./types/asset";

const fs = require("fs");

const jsonFileWritter = (file: string, assets: Array<Asset>) => {
  fs.writeFileSync(
    file,
    stringify(
      assets.sort((a, b) => a.symbol.localeCompare(b.symbol)),
      { space: "  " },
    ) + "\n",
  );
};
const typescriptFileWriter = (file: string, assets: Array<Asset>) => {
  fs.writeFileSync(
    file,
    "export default " +
      stringify(
        assets.sort((a, b) => a.symbol.localeCompare(b.symbol)),
        { space: "  " },
      ) +
      "\n",
  );
};

export { jsonFileWritter, typescriptFileWriter };
