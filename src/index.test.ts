import { getChains } from "./index";
import { expect } from "chai";

describe("First test", () => {
  it("should pass", () => {
    const result = getChains();
    console.log(result);
    expect(true).to.equal(true);
  });
});
