import { ethers } from 'ethers';
import React, { memo, useEffect, useState } from 'react';

type Props = {
  contract: ethers.Contract;
  totalSupply?: number | null;
  address?: string | null;
};

const nfts = (plural: boolean) => (plural ? 'NFTs' : 'NFT');

const UserData = ({ contract, totalSupply, address }: Props) => {
  const [nftQuantityOwned, setNftQuantityOwned] = useState<number | null>(null);

  useEffect(() => {
    if (!address || !contract.provider) return;
    (async () => {
      const balanceOf = await contract.balanceOf(address);
      setNftQuantityOwned(parseInt(balanceOf));
    })();
  }, [
    address,
    contract.provider,
    contract.balanceOf,
    totalSupply,
    setNftQuantityOwned,
  ]);

  return (
    <div>
      {address === undefined ? (
        <div>...</div>
      ) : (
        <div>
          <div>
            Connected with address{' '}
            <span style={{ fontWeight: 'bold' }}>{address}</span> <br />
            to contract{' '}
            <span style={{ fontWeight: 'bold' }}>{contract.address}</span>
            <br />
            <br />
            You're owning {nftQuantityOwned} {nfts(Boolean(totalSupply))}
          </div>
        </div>
      )}
      {totalSupply === undefined || totalSupply === null ? (
        <div>...</div>
      ) : (
        <div>
          NFTs minted: {totalSupply} {nfts(Boolean(totalSupply))}
        </div>
      )}
    </div>
  );
};

export default memo<Props>(UserData);
