# IOV Asset Directory

A digital asset directory, that holds metadata of various crypto tokens

# How to add an asset

```sh
MY_FORK=github_id # replace 'github_id' with your github id
git clone --recurse-submodules https://github.com/${MY_FORK}/asset-directory.git \
  && cd asset-directory \
  && yarn install \
  && yarn add-asset \
  && yarn aggregate
```

follow the prompt(s). You will see a success message at the end after aggregation of assets  
If all goes well, commit your changes, push and then submit a PR.

# Scripts

- [asset.ts](src/addAsset.ts) - adds an asset to the directory
- [aggregate.ts](src/aggregate.ts) - combines indivdual asset data into single assets file
- [writer.ts](src/writer.ts) - writes aggregated assets.ts(json) file

# Installation

```sh
yarn add @iov/asset-directory
```

# Usage

```ts
import assets, { Asset } from "@iov/asset-directory";

assets.map((asset: Asset) => console.log(asset.name));

// Output
Algorand
Bitcoin
Crypto.org
...
```
