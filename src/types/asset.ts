export interface Asset {
  name: string;
  symbol: string;
  logo: string;
  "starname-uri": string;
  "trustwallet-uid": string | null;
  coingeckoId: string;
}
