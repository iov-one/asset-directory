import { getChains, AssetChain } from "./index";
import { expect } from "chai";

describe("First test", () => {
  it("should pass", () => {
    const result: AssetChain[] = getChains();
    result.forEach((assetChain: AssetChain) => {
      expect('symbol' in assetChain).to.be.true;
      expect('name' in assetChain).to.be.true;
      expect('caip20' in assetChain).to.be.true;
      expect('iovNameServiceUri' in assetChain).to.be.true;
    })
  });
});
