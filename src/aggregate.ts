import fs = require("fs");
import encoding = require("@cosmjs/encoding");
import path = require("path");
import { Asset } from "./types/asset";
import { jsonFileWritter, typescriptFileWriter } from "./writers";

const dirsStarname = fs
  .readdirSync(path.join("assets"))
  .filter((dir) => fs.statSync(path.join("assets", dir)).isDirectory());

const starnameAssets = dirsStarname.reduce((totalAssets, dir) => {
  const assetInfoFilePath = path.join("assets", dir, "info.json");
  const assetInfoJson = fs.readFileSync(assetInfoFilePath, "utf-8");
  const { logo, ...otherProps }: Asset = JSON.parse(assetInfoJson);

  // Now read logo
  // if its a trustwallet registered asset, get its meta from their directory
  const assetLogoPath = otherProps["trustwallet-uid"]
    ? logo
    : assetInfoFilePath.replace("info.json", "logo.png");

  if (!fs.existsSync(assetLogoPath)) {
    throw new Error(`Logo for asset ${dir.toUpperCase()} doesn't exist`);
  }
  const assetLogoBinary = fs.readFileSync(assetLogoPath);
  const assetLogo = encoding.toBase64(assetLogoBinary);
  totalAssets.push({
    ...otherProps,
    logo: `data:image/png;base64,${assetLogo}`,
  });
  return totalAssets;
}, Array<Asset>());

typescriptFileWriter("assets.ts", starnameAssets); // HARD-CODED
jsonFileWritter("assets.json", starnameAssets); // HARD-CODED
