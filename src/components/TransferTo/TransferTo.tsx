import React, { useCallback, useState, memo, useEffect } from 'react';
import { useEnsAddress } from 'wagmi';
import { ethers } from 'ethers';
import './TransferTo.css';

type Props = {
  contract: ethers.Contract;
  totalSupply?: number | null;
  address?: string;
};

const TransferTo = ({ contract, totalSupply, address }: Props) => {
  const [nftToChange, setNftToChange] = useState<string>('1');

  const transferTo = useCallback(async () => {
    if (!contract.provider) return;
    await contract['safeTransferFrom(address,address,uint256)'](
      address,
      '0xdA9EDcC3CF66bc18050dB55D376407Cf85e0617B',
      nftToChange,
      {
        value: ethers.utils.parseEther('0.1'),
      }
    );
  }, [contract, nftToChange]);

  return (
    <div className="transfer-to">
      <input
        type="number"
        disabled={!Number(totalSupply)}
        onChange={(e) => setNftToChange(e.target.value?.toString())}
        min={Number(totalSupply) ? 1 : 0}
        max={totalSupply ?? 0}
        value={Number(totalSupply) ? nftToChange : ''}
      />
      <button disabled={!Number(totalSupply)} onClick={transferTo}>
        Transfer
      </button>
    </div>
  );
};

export default memo<Props>(TransferTo);
