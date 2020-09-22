# Digital Assets Directory #

To add an asset to the directory simply fork the repo and do

```sh
git clone https://github.com/your_fork/asset-directory.git && cd asset-directory && yarn install && yarn add-asset
```

and follow the two prompts.  Commit your changes, push, and then submit a PR.

The act of pushing will automatically update the `assets.json` file.  The push will fail on the first attempt because of the update to `assets.json`.  Just push again and you should be good to go!
