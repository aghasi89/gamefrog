import React, { createContext, useState, useEffect } from "react";
import { JsonRpcProvider, BrowserProvider, Contract } from "ethers";

import presaleAbi from "./abi/presaleABI.json";
import stakingAbi from "./abi/stakingABI.json";
import tokenAbi from "./abi/tokenABI.json";

// WalletConnect v2
import { EthereumProvider as WalletConnectProvider } from "@walletconnect/ethereum-provider";
// Coinbase
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

// Адреса контрактов
const PRESALE_ADDRESS = "0x6C5827c83ad3236A2023E9F3496c797E672a80Fe";
const STAKING_ADDRESS = "0x1C9f33DBA69936E6b82b8FD48928330C0Ba6BE3B";
const TOKEN_ADDRESS   = "0xbf42148c1Fe6803e783574F3454c115B636D7B33";

// WalletConnect settings
const WC_PROJECT_ID = "0a3322884659683f2e0f1caf0a7f575d"; // ваш реальный projectId
const CHAIN_ID = 11155111; // Sepolia

type Web3ContextType = {
  walletAddress: string | null;
  provider: BrowserProvider | null;
  infuraProvider: JsonRpcProvider | null;
  presaleContract: Contract | null;
  stakingContract: Contract | null;
  tokenContract: Contract | null;

  connectMetamask: () => Promise<void>;
  connectWalletConnect: () => Promise<void>;
  connectCoinbaseWallet: () => Promise<void>;
};

export const Web3Context = createContext<Web3ContextType>({
  walletAddress: null,
  provider: null,
  infuraProvider: null,
  presaleContract: null,
  stakingContract: null,
  tokenContract: null,

  connectMetamask: async () => {},
  connectWalletConnect: async () => {},
  connectCoinbaseWallet: async () => {},
});

export const WebProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [infuraProvider, setInfuraProvider] = useState<JsonRpcProvider | null>(null);

  const [presaleContract, setPresaleContract] = useState<Contract | null>(null);
  const [stakingContract, setStakingContract] = useState<Contract | null>(null);
  const [tokenContract, setTokenContract] = useState<Contract | null>(null);

  // Инициализация Infura (read-only)
  useEffect(() => {
    const initInfura = async () => {
      const infura = new JsonRpcProvider(
        "https://sepolia.infura.io/v3/f92deb2834c147cc864a0b47ce6ffed3"
      );
      setInfuraProvider(infura);
    };
    initInfura();
  }, []);

  // (Опционально) автоподключение Metamask:
  /*
  useEffect(() => {
    const autoConnect = async () => {
      const ethereum = (window as any).ethereum;
      if (ethereum && ethereum.request) {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setProvider(new BrowserProvider(ethereum));
        }
      }
    };
    autoConnect();
  }, []);
  */

  // A) Metamask
  const connectMetamask = async () => {
    try {
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        alert("MetaMask not installed!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setProvider(new BrowserProvider(ethereum));
      }
    } catch (err) {
      console.error("Metamask connection error:", err);
    }
  };

  // B) WalletConnect v2
  const connectWalletConnect = async () => {
    try {
      const wcProvider = await WalletConnectProvider.init({
        projectId: WC_PROJECT_ID,
        chains: [CHAIN_ID],
        optionalChains: [CHAIN_ID],
        methods: ["eth_sendTransaction", "eth_sign", "personal_sign"],
        optionalMethods: [],
        events: ["chainChanged", "accountsChanged"],
        optionalEvents: [],
        showQrModal: true,
        qrModalOptions: {
          // Пример: показать рекомендованные кошельки
          explorerRecommendedWalletIds: "RECOMMENDED"
        },
      });
      await wcProvider.connect();

      const ethersProvider = new BrowserProvider(wcProvider as any);
      setProvider(ethersProvider);

      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);

    } catch (error) {
      console.error("WalletConnect connection error:", error);
    }
  };

  // C) Coinbase Wallet
  const connectCoinbaseWallet = async () => {
    try {
      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: "GameFrog",
        appLogoUrl: "https://example.com/logo.png",
      });

      // Старый синтаксис — два аргумента
      const coinbaseProvider = coinbaseWallet.makeWeb3Provider(
        "https://sepolia.infura.io/v3/f92deb2834c147cc864a0b47ce6ffed3",
        CHAIN_ID
      );

      await coinbaseProvider.request({ method: "eth_requestAccounts" });

      const ethersProvider = new BrowserProvider(coinbaseProvider as any);
      setProvider(ethersProvider);

      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);

    } catch (err) {
      console.error("Coinbase Wallet connection error:", err);
    }
  };

  // Создание контрактов (read/write)
  useEffect(() => {
    const setupContracts = async () => {
      if (provider) {
        // С кошельком
        const signer = await provider.getSigner();
        setPresaleContract(new Contract(PRESALE_ADDRESS, presaleAbi, signer));
        setStakingContract(new Contract(STAKING_ADDRESS, stakingAbi, signer));
        setTokenContract(new Contract(TOKEN_ADDRESS, tokenAbi, signer));
      } else if (infuraProvider) {
        // Чтение
        setPresaleContract(new Contract(PRESALE_ADDRESS, presaleAbi, infuraProvider));
        setStakingContract(new Contract(STAKING_ADDRESS, stakingAbi, infuraProvider));
        setTokenContract(new Contract(TOKEN_ADDRESS, tokenAbi, infuraProvider));
      }
    };
    setupContracts();
  }, [provider, infuraProvider]);

  return (
    <Web3Context.Provider
      value={{
        walletAddress,
        provider,
        infuraProvider,
        presaleContract,
        stakingContract,
        tokenContract,

        connectMetamask,
        connectWalletConnect,
        connectCoinbaseWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
