const fs = require("fs");
const path = require("path");
const stringify = require("json-stable-stringify");

fs.readdirSync(path.join(".", "assets"))
  .filter((dir) => fs.statSync(path.join(".", "assets", dir)).isDirectory())
  .forEach((dir) => {
    const fileAsset = path.join(".", "assets", dir, "asset.json"); // HARD-CODED
    const fileMetadata = path.join("metadata", dir, "info.json"); // HARD-CODED
    const jsonAsset = fs.readFileSync(fileAsset, "utf-8");
    const jsonMetadata = fs.readFileSync(fileMetadata, "utf-8");
    const asset = JSON.parse(jsonAsset);
    const metadata = JSON.parse(jsonMetadata);

    fs.writeFileSync(fileAsset, stringify(asset, { space: "  " }) + "\n");
    fs.writeFileSync(fileMetadata, stringify(metadata, { space: "  " }) + "\n");
  });
