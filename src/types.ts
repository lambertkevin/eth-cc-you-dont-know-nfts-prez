export type Metadata = {
  source: string;
  tokenId: number;
  image: string;
  attributes: {
    trait_type: string;
    value: string | number | boolean;
  }[];
};
