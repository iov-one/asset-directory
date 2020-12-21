# Metadata about Assets Directory #

- [asset.js](asset.js) - adds an asset to the directory
- [format.js](format.js) - formats all assets' json consistently, ie alphabetically sorts keys; called by the `git pre-commit` hook
- [verify.js](verify.js) - verifies that all required properties are provided for each asset in the directory; called by the `git pre-commit` and `git pre-push` hooks
- [aggregate.js](aggregate.js) - combines indivdual asset data into assets.json
- [unique.js](unique.js) - reports trustwallet assets that have a collision on their symbols
