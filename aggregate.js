const fs = require("fs");
const encoding = require("@cosmjs/encoding");
const path = require("path");
const stringify = require("json-stable-stringify");

("use strict");

const jsonFileWritter = (file, assets) => {
  fs.writeFileSync(
    file,
    stringify(
      assets.sort((a, b) => a.symbol.localeCompare(b.symbol)),
      { space: "  " },
    ) + "\n",
  );
};
const javascriptFileWritter = (file, assets) => {
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

// UCRegistry asset directory
const dirs = fs
  .readdirSync(path.join("UCRegistry", "assets", "assets"))
  .filter((dir) =>
    fs.statSync(path.join("UCRegistry", "assets", "assets", dir)).isDirectory(),
  );

// ./assets.json
const assets = dirs.map((dir) => {
  const fileAsset = path.join("UCRegistry", "assets", "assets", dir, "asset.json"); // HARD-CODED
  const jsonAsset = fs.readFileSync(fileAsset, "utf-8");
  const asset = JSON.parse(jsonAsset);

  // drop starname properties
  delete asset.logo;
  delete asset.name;

  return asset;
});

javascriptFileWritter("assets.js", assets); // HARD-CODED
jsonFileWritter("assets.json", assets); // HARD-CODED

// Starname asset directory
const dirsStarname = fs
  .readdirSync(path.join(".", "assets"))
  .filter((dir) =>
    fs.statSync(path.join(".", "assets", dir)).isDirectory(),
  );

// ./starname/assets.json
const starnameAssets = [].concat(dirs, dirsStarname).map((dir) => { // order matters: put UCRegistry in front of Starname
  const root = dirs.includes(dir) ? path.join("UCRegistry", "assets") : "."; // HARD-CODED
  const fileAsset = path.join(root, "assets", dir, "asset.json"); // HARD-CODED
  const fileMetadata = path.join("metadata", dir, "info.json"); // HARD-CODED

  if ( !fs.existsSync( fileMetadata ) ) return;

  const jsonAsset = fs.readFileSync(fileAsset, "utf-8");
  const jsonMetadata = fs.readFileSync(fileMetadata, "utf-8");
  const metadata = JSON.parse(jsonMetadata);
  const asset = {
    ...JSON.parse(jsonAsset),
    ...metadata,
  }

  // drop trustwallet properties
  delete asset["trustwallet-info"];
  delete asset["trustwallet-uid"];

  const fileInfoPath = metadata["trustwallet-info"];
  // possibly inject name
  if (!asset.name) {
    const fileInfo = path.join(".", fileInfoPath);
    const jsonInfo = fs.readFileSync(fileInfo);
    const info = JSON.parse(jsonInfo);

    if (!info.name) {
      error = true;
      console.error(`${fileInfo} is missing property 'name'!`);
    }

    asset.name = info.name;
  }

  // replace logo with base64
  const fileLogo =
    fileInfoPath === null
      ? path.join(".", asset.logo)
      : path.join(".", fileInfoPath.replace("info.json", "logo.png")); // HARD-CODED

  const binary = fs.readFileSync(fileLogo);
  const logo = encoding.toBase64(binary);

  asset.logo = `data:image/png;base64,${logo}`;

  return asset;
}).filter( asset => !!asset ); // filter null(s)

javascriptFileWritter(path.join("starname", "assets.js"), starnameAssets); // HARD-CODED
jsonFileWritter(path.join("starname", "assets.json"), starnameAssets); // HARD-CODED
