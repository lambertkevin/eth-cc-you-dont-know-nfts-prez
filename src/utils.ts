export const ipfsGatewayzer = (str: string | null): string | null =>
  str?.startsWith('ipfs://')
    ? str.replace('ipfs://', 'https://ipfs.infura.io/ipfs/')
    : str;
