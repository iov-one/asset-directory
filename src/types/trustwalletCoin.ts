export interface TrustWalletCoin {
  id: string;
  name: string;
  coinId: number;
  symbol: string;
  decimals: number;
  blockchain: string;
  derivationPath: string;
  curve: string;
  publicKeyType: string;
  p2pkhPrefix: number;
  p2shPrefix: number;
  hrp: string;
  publicKeyHasher: string;
  base58Hasher: string;
  xpub: string;
  xprv: string;
  explorer: {
    url: string;
    txPath: string;
    accountPath: string;
  };
  info: {
    url: string;
    source: string;
    rpc: string;
    documentation: string;
  };
}
