import React, { useCallback, memo } from 'react';
import { ethers } from 'ethers';
import './MintNft.css';

type Props = {
  contract: ethers.Contract;
};

const MintNft = ({ contract }: Props) => {
  const mint = useCallback(async () => {
    if (!contract.provider) return;
    await contract.mint();
  }, [contract.provider, contract.mint]);

  return (
    <div className="mint-nft">
      <button onClick={mint}>Mint an NFT</button>
    </div>
  );
};

export default memo<Props>(MintNft);
