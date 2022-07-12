import React, { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import axiosFactory from 'axios';
import {
  WagmiConfig,
  createClient,
  chain,
  configureChains,
  useAccount,
  useConnect,
  useContract,
  useSigner,
  useProvider,
} from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import NftGallery from './components/NftGallery/NftGallery';
import ChangeNftMetadata from './components/ChangeNftMetadata';
import TransferTo from './components/TransferTo/TransferTo';
import SendEvent from './components/SendEvent/SendEvent';
import UserData from './components/UserData';
import MintNft from './components/MintNft';
import { ipfsGatewayzer } from './utils';
import ABI from './contractAbi.json';
import './App.css';

// Change this to your own contract address
const CONTRACT_ADDRESS = '0xf149c3c2132ad02d7dc60c223b1680238cc7f471';

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.polygon],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: 'https://polygon-rpc.com/',
      }),
    }),
  ]
);

const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
  webSocketProvider,
});

const Profile = () => {
  const { address, isConnected } = useAccount();
  const signer = useSigner();

  const [totalSupply, setTotalSupply] = useState<number | null>(null);

  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const contract = useContract({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: ABI,
    signerOrProvider: signer.data,
  });

  const getTotalSupply = useCallback(async () => {
    if (!contract.provider) return;
    const totalSupply = await contract.totalSupply();
    setTotalSupply(parseInt(totalSupply));
  }, [contract.provider, contract.totalSupply, setTotalSupply]);
  useEffect(() => {
    let internval: ReturnType<typeof setInterval> | undefined;
    if (contract.provider) {
      internval = setInterval(() => {
        getTotalSupply();
      }, 1000);
    }

    return () => {
      if (internval) {
        clearInterval(internval);
      }
    };
  }, [contract.provider, address, getTotalSupply]);

  if (isConnected) {
    return (
      <>
        <UserData
          contract={contract}
          address={address}
          totalSupply={totalSupply}
        />
        <div className="actions">
          <MintNft contract={contract} />
          <ChangeNftMetadata contract={contract} totalSupply={totalSupply} />
          <TransferTo
            contract={contract}
            totalSupply={totalSupply}
            address={address}
          />
          <SendEvent contract={contract} totalSupply={totalSupply} />
        </div>
        <NftGallery contract={contract} totalSupply={totalSupply} />
      </>
    );
  }

  return (
    <div className="App">
      <button onClick={() => connect()}>Connect Wallet</button>
    </div>
  );
};

const App = () => {
  return (
    <WagmiConfig client={client}>
      <Profile />
    </WagmiConfig>
  );
};

export default App;
