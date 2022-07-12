import React, { memo, useEffect, useState } from 'react';
import axiosFactory from 'axios';
import { ethers } from 'ethers';
import { Metadata } from '../../types';
import { ipfsGatewayzer } from '../../utils';
import './NftGallery.css';

type Props = {
  contract: ethers.Contract;
  totalSupply?: number | null;
};

const axios = axiosFactory.create();

const getNftUris = async (
  contract: ethers.Contract,
  totalSupply: number | undefined | null = 0
): Promise<string[]> => {
  const tokenIds = new Array(totalSupply || 0).fill(null).map((_, i) => i + 1);
  const tokenURIs = await Promise.all(
    tokenIds.map((id) => contract?.tokenURI(id))
  );

  return tokenURIs.map(ipfsGatewayzer) as string[];
};

const getNftsMetadata = async (tokenUris: string[]): Promise<Metadata[]> => {
  const metadataResponses: Metadata[] = await Promise.all(
    tokenUris.map((uri, index) =>
      axios.get(uri).then(({ data }) => ({
        ...data,
        source: uri,
        tokenId: index + 1,
      }))
    )
  );

  return metadataResponses;
};

const NftGallery = ({ contract, totalSupply }: Props) => {
  const [nfts, setNfts] = useState<Metadata[] | null>(null);

  useEffect(() => {
    if (!contract.provider) return;
    (async () => {
      const tokenUris = await getNftUris(contract, totalSupply);
      const nfts = await getNftsMetadata(tokenUris);

      setNfts(nfts);
    })();
  }, [contract, totalSupply]);

  if (totalSupply === undefined || totalSupply === null) {
    return <div>Waiting for the supply.</div>;
  }

  return nfts?.length ? (
    <div className="gallery">
      {nfts?.map(({ tokenId, image, source }) => (
        <div key={tokenId} className="nft">
          <img src={ipfsGatewayzer(image) || ''} width="100%" />
          <div style={{ fontStyle: 'italic' }}>URI: {source}</div>
          <div style={{ fontWeight: 'bold' }}>Token #{tokenId}</div>
        </div>
      ))}
    </div>
  ) : (
    <div>{"No NFTs yet :'("}</div>
  );
};

export default memo<Props>(NftGallery);
