// WebProvider.tsx
import React, { createContext, useState, useEffect, useRef } from "react";
import { JsonRpcProvider, BrowserProvider, Contract } from "ethers";

import presaleAbi from "./abi/presaleABI.json";
import stakingAbi from "./abi/stakingABI.json";
import tokenAbi from "./abi/tokenABI.json";

// WalletConnect v2
import { EthereumProvider as WalletConnectProvider } from "@walletconnect/ethereum-provider";
// Coinbase
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

// Адреса контрактов (пример!)
const PRESALE_ADDRESS = "0x9952c3832d100aeb0bA747b326A6Cdb7D090963C";
const STAKING_ADDRESS = "0x200bb20E1F946622b0133A14B28f0b55EF28A5Ef";
const TOKEN_ADDRESS   = "0x7F1E465735540f6EBbAe93864eF08E49b7a21800";

// WalletConnect settings
const WC_PROJECT_ID = "0a3322884659683f2e0f1caf0a7f575d";
const CHAIN_ID = 11155111; // Sepolia

type WalletType = "METAMASK" | "WALLETCONNECT" | "COINBASE" | null;

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

// Создаём контекст
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

  // Храним "последний тип кошелька" в стейте:
  const [lastWalletType, setLastWalletType] = useState<WalletType>(null);

  // Ref для WalletConnect, чтобы не пересоздавать при каждом рендере
  const wcProviderRef = useRef<any>(null);

  // ==============================
  // 1) Инициализация Infura (read-only)
  useEffect(() => {
    const initInfura = async () => {
      try {
        const infura = new JsonRpcProvider(
          "https://sepolia.infura.io/v3/f92deb2834c147cc864a0b47ce6ffed3" // ваш Infura
        );
        setInfuraProvider(infura);
      } catch (err) {
        console.error("Error init Infura:", err);
      }
    };
    initInfura();
  }, []);

  // ==============================
  // 2) Считываем из localStorage, какой кошелёк использовался последним
  useEffect(() => {
    const savedWallet = localStorage.getItem("LAST_USED_WALLET");
    if (
      savedWallet === "METAMASK" ||
      savedWallet === "WALLETCONNECT" ||
      savedWallet === "COINBASE"
    ) {
      setLastWalletType(savedWallet);
    }
  }, []);

  // ==============================
  // 3) Когда мы узнали lastWalletType, пытаемся автоподключиться
  useEffect(() => {
    if (!lastWalletType) return; // если ничего не сохранено
    autoConnect(lastWalletType);
  }, [lastWalletType]);

  // Функция автоподключения в зависимости от типа
  const autoConnect = async (type: WalletType) => {
    try {
      if (type === "METAMASK") {
        await autoConnectMetamask();
      } else if (type === "WALLETCONNECT") {
        await autoConnectWalletConnect();
      } else if (type === "COINBASE") {
        await autoConnectCoinbase();
      }
    } catch (error) {
      console.error("AutoConnect error:", error);
      localStorage.removeItem("LAST_USED_WALLET");
    }
  };

  // ==============================
  // Методы автоподключения (не запрашиваем разрешение, а только проверяем активную сессию)
  const autoConnectMetamask = async () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      localStorage.removeItem("LAST_USED_WALLET");
      return;
    }
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts && accounts.length > 0) {
      setWalletAddress(accounts[0]);
      setProvider(new BrowserProvider(ethereum));
    } else {
      localStorage.removeItem("LAST_USED_WALLET");
    }
  };

  const autoConnectWalletConnect = async () => {
    wcProviderRef.current = await WalletConnectProvider.init({
      projectId: WC_PROJECT_ID,
      chains: [CHAIN_ID],
      optionalChains: [CHAIN_ID],
      methods: ["eth_sendTransaction", "eth_sign", "personal_sign"],
      optionalMethods: [],
      events: ["chainChanged", "accountsChanged"],
      optionalEvents: [],
      // Автоподключение => без QR-модалки
      showQrModal: false,
    });
    // Попробуем .connect(), если сессия активна — подключимся
    await wcProviderRef.current.connect(); 
    const ethersProvider = new BrowserProvider(wcProviderRef.current as any);
    setProvider(ethersProvider);

    const signer = await ethersProvider.getSigner();
    const address = await signer.getAddress();
    setWalletAddress(address);
  };

  const autoConnectCoinbase = async () => {
    const coinbaseWallet = new CoinbaseWalletSDK({
      appName: "GameFrog",
      appLogoUrl: "https://example.com/logo.png",
    });
    const coinbaseProvider = coinbaseWallet.makeWeb3Provider(
      "https://sepolia.infura.io/v3/f92deb2834c147cc864a0b47ce6ffed3",
      CHAIN_ID
    );
    // Спросим acc (но без запроса eth_requestAccounts)
    const accounts = await coinbaseProvider.request({ method: "eth_accounts" });
    if (accounts && accounts.length > 0) {
      setWalletAddress(accounts[0]);
      setProvider(new BrowserProvider(coinbaseProvider as any));
    } else {
      localStorage.removeItem("LAST_USED_WALLET");
    }
  };

  // ==============================
  // 4) Методы ручного подключения (когда пользователь вручную жмёт «Connect Wallet»)
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
        localStorage.setItem("LAST_USED_WALLET", "METAMASK");
      }
    } catch (err) {
      console.error("Metamask connection error:", err);
    }
  };

  const connectWalletConnect = async () => {
    try {
      wcProviderRef.current = await WalletConnectProvider.init({
        projectId: WC_PROJECT_ID,
        chains: [CHAIN_ID],
        optionalChains: [CHAIN_ID],
        methods: ["eth_sendTransaction", "eth_sign", "personal_sign"],
        optionalMethods: [],
        events: ["chainChanged", "accountsChanged"],
        optionalEvents: [],
        // Ручное подключение => показываем QR
        showQrModal: true,
      });
      await wcProviderRef.current.connect();

      const ethersProvider = new BrowserProvider(wcProviderRef.current as any);
      setProvider(ethersProvider);

      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);

      localStorage.setItem("LAST_USED_WALLET", "WALLETCONNECT");
    } catch (error) {
      console.error("WalletConnect connection error:", error);
    }
  };

  const connectCoinbaseWallet = async () => {
    try {
      const coinbaseWallet = new CoinbaseWalletSDK({
        appName: "GameFrog",
        appLogoUrl: "https://example.com/logo.png",
      });
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

      localStorage.setItem("LAST_USED_WALLET", "COINBASE");
    } catch (err) {
      console.error("Coinbase Wallet connection error:", err);
    }
  };

  // ==============================
  // 5) Создаём контракты, когда меняется provider или infuraProvider
  useEffect(() => {
    const setupContracts = async () => {
      try {
        if (provider) {
          // С кошельком (write)
          const signer = await provider.getSigner();
          setPresaleContract(new Contract(PRESALE_ADDRESS, presaleAbi, signer));
          setStakingContract(new Contract(STAKING_ADDRESS, stakingAbi, signer));
          setTokenContract(new Contract(TOKEN_ADDRESS, tokenAbi, signer));
        } else if (infuraProvider) {
          // Только чтение (read-only)
          setPresaleContract(
            new Contract(PRESALE_ADDRESS, presaleAbi, infuraProvider)
          );
          setStakingContract(
            new Contract(STAKING_ADDRESS, stakingAbi, infuraProvider)
          );
          setTokenContract(new Contract(TOKEN_ADDRESS, tokenAbi, infuraProvider));
        }
      } catch (error) {
        console.error("Error setting up contracts:", error);
      }
    };
    setupContracts();
  }, [provider, infuraProvider]);

  // ==============================
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
