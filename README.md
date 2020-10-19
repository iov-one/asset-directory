# Digital Assets Directory #

To add an asset to the directory simply fork this repo and do

```sh
git clone --recurse-submodules https://github.com/your_fork/asset-directory.git \
  && cd asset-directory \
  && yarn install \
  && yarn add-asset \
  && yarn aggregate
```

and follow the prompt(s).  Commit your changes, push, and then submit a PR.
