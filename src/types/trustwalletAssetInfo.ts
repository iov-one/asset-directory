export interface TrustWalletAssetInfo {
  name: string;
  website: string;
  description: string;
  explorer: string;
  research: string;
  symbol: string;
  type: string;
  decimals: number;
  status: "active" | "abandoned";
  tags: ReadonlyArray<string>;
  links: ReadonlyArray<{ name: string; url: string }>;
}
