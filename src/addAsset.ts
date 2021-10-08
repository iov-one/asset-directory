import axios from "axios";
import { exec } from "child_process";
import { TrustWalletCoin } from "./types/trustwalletCoin";
import { CoinGeckoCoin } from "./types/coingeckoCoin";
import config from "./config";
import { Errors } from "./types/errors";
import { TrustWalletAssetInfo } from "./types/trustwalletAssetInfo";
import { Asset } from "./types/asset";

import stringify = require("json-stable-stringify");
import inquirer = require("inquirer");
import fs = require("fs");
import path = require("path");

const MANUAL_CHOICE = "Enter Manually:";

const main = async () => {
  console.log("Initializing...");

  const coinGeckoCoinsResponse = await axios.get<ReadonlyArray<CoinGeckoCoin>>(
    config.COINGECKO_API_URL,
  );
  const coinGeckoCoins = coinGeckoCoinsResponse.data;

  const trustWalletRegistryResponse = await axios
    .get<ReadonlyArray<TrustWalletCoin>>(config.TRUSTWALLET_REGISTRY_URL)
    .catch((e) => {
      throw e;
    });
  const trustRegistryCoins = trustWalletRegistryResponse.data;
  console.clear();
  console.log("External sources ready!\n");

  while (true) {
    const { symbolInput } = await inquirer.prompt([
      {
        type: "input",
        name: "symbolInput",
        message: "Enter symbol of the token:",
      },
    ]);
    const symbol = symbolInput.toLowerCase();
    const upperCasedSymbol = symbolInput.toUpperCase();

    if (fs.existsSync(path.join("assets", symbol)))
      throw new Error(Errors.ALREADY_EXISTS);

    // coin must exist on coingecko, check beforehand
    const foundCoinGeckoCoin = coinGeckoCoins.find(
      (_coin) => _coin.symbol === symbol,
    );
    if (!foundCoinGeckoCoin) {
      throw new Error(Errors.NOT_FOUND_COINGECKO);
    }
    // check for symbol in trust registry
    const foundTrustRegistryCoin = trustRegistryCoins.find(
      (coin) => coin.symbol === upperCasedSymbol,
    );
    // if coin is found on trust registry, check in trustwallet asset files
    const trustWalletAssetFile = foundTrustRegistryCoin
      ? path.join(
          "trustwallet",
          "assets",
          "blockchains",
          foundTrustRegistryCoin.id,
          "info",
          "info.json",
        )
      : null; // HARD-CODED

    const trustWalletAsset: TrustWalletAssetInfo | null =
      trustWalletAssetFile && fs.existsSync(trustWalletAssetFile)
        ? JSON.parse(fs.readFileSync(trustWalletAssetFile, "utf-8"))
        : null;
    // use asset name from trustwallet files instead of registry ( give precedence)
    const { nameInput } = await inquirer.prompt([
      {
        name: "nameInput",
        type: "list",
        message: "Choose asset name",
        choices: trustWalletAsset
          ? // check if names are same on coingecko and trustregistry
            foundCoinGeckoCoin.name === trustWalletAsset.name
            ? [foundCoinGeckoCoin.name, MANUAL_CHOICE]
            : [foundCoinGeckoCoin.name, trustWalletAsset.name, MANUAL_CHOICE]
          : [foundCoinGeckoCoin.name, MANUAL_CHOICE],
      },
    ]);
    // inquire manual asset name for asset info use ( this will have max precedence)
    const manualInput =
      nameInput === MANUAL_CHOICE
        ? await inquirer.prompt([
            {
              type: "input",
              name: "assetName",
              message: "Provide name for asset:",
            },
          ])
        : null;
    // check for abandoned asset
    const abandonedAsset =
      trustWalletAsset && trustWalletAsset.status === "abandoned"
        ? await inquirer.prompt([
            {
              type: "confirm",
              name: "confirmation",
              message:
                "Beware! You are about to add an abandoned asset by TrustWallet, we won't be able to support trust wallet payments for this asset on our application.\nDo you still want to continue",
            },
          ])
        : null;
    // user has agreed to discontinue
    if (abandonedAsset && !abandonedAsset["confirmation"]) {
      process.exit(0);
    }
    const assetInfoFilePath = path.join("assets", symbol, "info.json"); // HARD-CODED
    const logoFilePath = path.join("assets", symbol, "logo.png"); // HARD-CODED

    const trustWalletAssetLogoExists = !!(
      trustWalletAssetFile &&
      fs.existsSync(trustWalletAssetFile.replace("info.json", "logo.png"))
    );

    const asset: Asset = {
      symbol: upperCasedSymbol,
      name: manualInput ? manualInput["assetName"] : nameInput,
      logo: trustWalletAssetLogoExists
        ? trustWalletAssetFile.replace("info.json", "logo.png")
        : logoFilePath,
      "starname-uri": `asset:${symbol}`,
      "trustwallet-uid":
        foundTrustRegistryCoin && !abandonedAsset
          ? `c${foundTrustRegistryCoin.coinId}`
          : null,
    };
    // create directory and write info file for this asset
    fs.mkdirSync(path.join("assets", symbol), { recursive: true });
    fs.writeFileSync(
      assetInfoFilePath,
      stringify(asset, { space: "  " }) + "\n",
    );
    // let user know
    console.log(`Wrote file ${assetInfoFilePath}`);
    console.log(
      !trustWalletAssetLogoExists
        ? `Now please add logo for this asset at ${logoFilePath}\nAnd then run "yarn aggregate" afterwards\n`
        : "",
    );
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
