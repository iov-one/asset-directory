import * as data from "../asset/asset.json";

export interface AssetChain {
  symbol: string;
  name: string;
  caip20: string;
  iovNameServiceUri: string;
}

export var getChains = (): AssetChain[] => {
  let assetChains: AssetChain[] = [];
  data.forEach((d) => {
    const assetChain: AssetChain = {
      symbol: d["symbol"],
      name: d["name"],
      caip20: d["caip-20"],
      iovNameServiceUri: d["iov-name-service-uri"],
    };
    assetChains.push({ ...assetChain });
  });
  return assetChains;
};
