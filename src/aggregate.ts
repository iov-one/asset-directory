import fs = require("fs");
import encoding = require("@cosmjs/encoding");
import path = require("path");
import { Asset } from "./types/asset";
import fileWriter from "./writer";

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

const generatedAssetsDirPath = path.join("src", "starname"); // HARD-CODED
if (!fs.existsSync(generatedAssetsDirPath)) {
  fs.mkdirSync(generatedAssetsDirPath);
}

const differences = fileWriter(generatedAssetsDirPath, starnameAssets);
console.log(
  `Successfully added ${differences.map((asset) => asset.symbol).join(",")}!`,
);
