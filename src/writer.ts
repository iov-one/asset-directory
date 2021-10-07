import { Asset } from "./types/asset";
import originalAssets from "./starname/assets";

import fs = require("fs");
import stringify = require("json-stable-stringify");

const fileWriter = (
  fileDir: string,
  assets: Array<Asset>,
): ReadonlyArray<Asset> => {
  const oldAssets = originalAssets;
  fs.writeFileSync(
    `${fileDir}/assets.json`,
    stringify(
      assets.sort((a, b) => a.symbol.localeCompare(b.symbol)),
      { space: "  " },
    ) + "\n",
  );
  fs.writeFileSync(
    `${fileDir}/assets.ts`,
    "export default " +
      stringify(
        assets.sort((a, b) => a.symbol.localeCompare(b.symbol)),
        { space: "  " },
      ) +
      "\n",
  );
  const newlyAdded = (asset: Asset) => {
    return !oldAssets.find((_asset) => _asset.symbol === asset.symbol);
  };
  return assets.filter(newlyAdded);
};

export default fileWriter;
