const fs = require("fs");
const path = require("path");

("use strict");

exports.assets = JSON.parse(fs.readFileSync("assets.json", "utf-8")); // HARD-CODED

exports.assetsStarname = JSON.parse(
  fs.readFileSync(path.join("starname", "assets.json"), "utf-8"),
); // HARD-CODED
