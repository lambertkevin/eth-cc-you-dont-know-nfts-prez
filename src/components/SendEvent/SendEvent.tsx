import React, { useCallback, useState, memo, useEffect } from 'react';
import { useEnsAddress } from 'wagmi';
import { ethers } from 'ethers';
import './SendEvent.css';

type Props = {
  contract: ethers.Contract;
  totalSupply?: number | null;
};

const SendEvent = ({ contract, totalSupply }: Props) => {
  const [nftToChange, setNftToChange] = useState<string>('1');

  const sendEventTx = useCallback(async () => {
    if (!contract.provider) return;
    console.log(contract);
    await contract.yourEventsAreNotSafe(nftToChange);
  }, [contract, nftToChange]);

  return (
    <div className="send-event">
      <input
        type="number"
        disabled={!Number(totalSupply)}
        onChange={(e) => setNftToChange(e.target.value?.toString())}
        min={Number(totalSupply) ? 1 : 0}
        max={totalSupply ?? 0}
        value={Number(totalSupply) ? nftToChange : ''}
      />
      <button disabled={!Number(totalSupply)} onClick={sendEventTx}>
        Send Event
      </button>
    </div>
  );
};

export default memo<Props>(SendEvent);
