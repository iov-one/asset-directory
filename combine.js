const fs = require("fs");
const path = require("path");

var dir = "./asset";

function verifyFile(data) {
  console.log(data);
  if(!'symbol' in data) {
    throw new Error('Symbol key does not exist');
  }
  if(!'name' in data) {
    throw new Error('name key does not exist');
  }
  if(!'caip-20' in data) {
    throw new Error('caip-20 key does not exist');
  }
  if(!'iov-name-service-uri' in data) {
    throw new Error('iov-name-service-uri key does not exist');
  }
}

function getChains() {
  const filenames = fs.readdirSync(dir);
  let chains = [];
  filenames.forEach((file) => {
    const data = fs.readFileSync(dir + "/" + file, {
      encoding: "utf8",
      flag: "r",
    });
    verifyFile(JSON.parse(data));
    chains.push(JSON.parse(data));
  });
  return chains;
}
function writeToFile() {
  const chains = getChains();
  fs.writeFile("./asset.json", JSON.stringify(chains), (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
}
writeToFile();
