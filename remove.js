const fs = require("fs");
const path = require("path");
("use strict");

const prompt = async (display) => {
  return new Promise((resolve) => {
    process.stdout.write(display);
    process.stdin.resume();
    process.stdin.once("data", (data) => {
      resolve(String(data).trim());
    });
  });
};

const calculateDeletablePaths = (symbol) => {
  const deletablePaths = [];
  const userAssetPath = path.join("assets", symbol);
  const metadataPath = path.join("metadata", symbol);
  const ucRegistryPath = path.join("UCRegistry", "assets", symbol);

  if (fs.existsSync(userAssetPath)) deletablePaths.push(userAssetPath);
  if (fs.existsSync(metadataPath)) deletablePaths.push(metadataPath);
  if (fs.existsSync(ucRegistryPath)) deletablePaths.push(ucRegistryPath);

  return deletablePaths;
};

const main = async () => {
  const symbol = await prompt(
    `Enter the symbol of the token or Ctrl-c to quit: `,
  ).catch((e) => {
    throw e;
  });
  const deletablePaths = calculateDeletablePaths(symbol.toLowerCase());
  if (deletablePaths.length > 0) {
    console.log("Paths to be deleted:\n\n");
    console.log(`${deletablePaths.join("\n")}`);
    const response = await prompt(
      `\nPress y to continue or Ctrl-c to quit: `,
    ).catch((e) => {
      throw e;
    });
    if (response === "y" || response === "Y") {
      deletablePaths.forEach((path) =>
        fs.rmdirSync(path, { recursive: true }, (err) => {
          if (err) {
            throw err;
          }
        }),
      );
      return 0;
    }
  } else {
    throw new Error(`Nothing found related to ${symbol}`);
  }
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((e) => {
    console.error(e.stack || e.message || e);
    process.exit(-1);
  });
