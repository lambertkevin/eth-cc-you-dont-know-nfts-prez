import React, { useCallback, useState, memo } from 'react';
import { ethers } from 'ethers';
import './ChangeNftMetadata.css';

type Props = {
  contract: ethers.Contract;
  totalSupply?: number | null;
};

const ChangeNftMetadata = ({ contract, totalSupply }: Props) => {
  const [nftToChange, setNftToChange] = useState<string>('1');

  const changeMetadata = useCallback(async () => {
    if (!contract.provider) return;

    await contract.yourJpegIsntSafe(
      parseInt(nftToChange),
      'ipfs://QmSobcCnYTgAuiXDtnxABRjSYC3FM5uHUziVKwkUztwnFw'
    );
  }, [contract, nftToChange]);

  return (
    <div className="change-metadata">
      <input
        type="number"
        disabled={!Number(totalSupply)}
        onChange={(e) => setNftToChange(e.target.value)}
        min={Number(totalSupply) ? 1 : 0}
        max={totalSupply ?? 0}
        value={Number(totalSupply) ? nftToChange : ''}
      />
      <button disabled={!Number(totalSupply)} onClick={changeMetadata}>
        Change Metadata
      </button>
    </div>
  );
};

export default memo<Props>(ChangeNftMetadata);
