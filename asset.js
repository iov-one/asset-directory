const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const stringify = require("json-stable-stringify");

const prompt = async (display) => {
  return new Promise((resolve) => {
    process.stdout.write(display);
    process.stdin.resume();
    process.stdin.once("data", (data) => {
      resolve(String(data).trim());
    });
  });
};

const main = async () => {
  const reSymbol = new RegExp(/[A-Z]/);
  const trustwalletFetched = await fetch(
    "https://raw.githubusercontent.com/trustwallet/wallet-core/master/registry.json",
  ).catch((e) => {
    throw e;
  });
  const trustwalletCoins = await trustwalletFetched.json().catch((e) => {
    throw e;
  });

  while (true) {
    const symbol = await prompt(
      `Enter the symbol of the token or Ctrl-c to quit: `,
    ).catch((e) => {
      throw e;
    });

    if (!symbol.match(reSymbol))
      throw new Error(`Symbol should be mostly upper case, not '${symbol}'.`);

    const lowercased = symbol.toLowerCase();
    if (fs.existsSync(path.join("assets", lowercased)))
      throw new Error(`Asset for symbol ${symbol} already exists.`);

    const coin = trustwalletCoins.find((coin) => coin.symbol === symbol);
    const fileTrust = coin
      ? path.join(
          "trustwallet",
          "assets",
          "blockchains",
          coin.id,
          "info",
          "info.json",
        )
      : null; // HARD-CODED
    const trusted = fs.existsSync(fileTrust)
      ? JSON.parse(fs.readFileSync(fileTrust, "utf-8"))
      : null;
    const trustBasedPromptMessage = trusted
      ? `Specify name manually or press enter to use [${trusted.name}]: `
      : null;
    const normalPromptMessage = "Enter the name of token: ";
    const nameResponse = await prompt(
      trusted ? trustBasedPromptMessage : normalPromptMessage,
    ).catch((e) => {
      throw e;
    });
    // use this boolean to check if user dont want to use trust asset
    const nameOverride = nameResponse.length > 0;
    const name = nameOverride ? nameResponse : trusted.name;
    const fileAsset = path.join("assets", lowercased, "asset.json"); // HARD-CODED
    const fileMetadata = path.join("metadata", lowercased, "info.json"); // HARD-CODED
    const asset = {
      "caip-19": null,
      symbol: symbol,
      "trustwallet-uid": coin ? `c${coin.coinId}` : null,
    };
    const metadata = {
      "starname-uri": `asset:${lowercased}`,
      "trustwallet-info": trusted && !nameOverride ? `/${fileTrust}` : null,
    };

    if (!trusted || nameOverride) {
      asset.logo = fileMetadata.replace("info.json", "logo.png"); // HARD-CODED
      asset.name = name;
    }

    fs.mkdirSync(path.join("assets", lowercased), {
      recursive: true,
    });
    fs.mkdirSync(path.join("metadata", lowercased), {
      recursive: true,
    });
    fs.writeFileSync(fileAsset, stringify(asset, { space: "  " }) + "\n");
    fs.writeFileSync(fileMetadata, stringify(metadata, { space: "  " }) + "\n");
    console.log(`Wrote ${fileAsset} and ${fileMetadata}.`);
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
