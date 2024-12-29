import React, { useState, useEffect, useContext } from 'react';
import {
  parseEther,
  formatUnits,
  TransactionRequest,
  TransactionResponse,
  Contract,
} from 'ethers';
import Countdown, { CountdownRendererFn } from 'react-countdown';
import {
  FormS,
  FormTitle,
  CountDown,
  CountDownItem,
  CountDownSeparator,
  CountDownItemSubtext,
  StyledProgress,
  Text16,
  Text24,
  TextBox,
  Box,
  BoxItem,
  Input,
  InputText,
} from './styled';
import { ButtonWithBg, InfoButton, ModalTitle, Text20 } from '../../styled';

// Импорт вашего Web3Context
import { Web3Context } from '../../WebProvider';
import Modal from '../modal/Modal';
import { pad } from 'viem';
import { Row } from '../../utils';

// Примеры бэкграунд-картинок
const bg = require('../../assets/images/form-bg.png');
const ethBg = require('../../assets/images/btn-etc.png');
const walletBg = require('../../assets/images/btn-wallet.png');
const buyButtonBg = require('../../assets/images/buy_btn_bg.png');
const walletConnect = require('../../assets/images/wallet-connect.png');
const metaMask = require('../../assets/images/metamask.png');
const coinbase = require('../../assets/images/coinbase.png');
// Интерфейс контракта (добавили buyTokens, buyAndStake и т.д.)
interface IPresaleContract {
  buyTokens(overrides?: TransactionRequest): Promise<TransactionResponse>;
  buyAndStake(overrides?: TransactionRequest): Promise<TransactionResponse>;
  currentPrice(): Promise<bigint>;
  fundsRaised(): Promise<bigint>;
  endTime(): Promise<bigint>;
  priceFeedAddress(): Promise<string>;
  pendingClaims(address: string): Promise<bigint>;
}

export const Form = () => {
  const {
    walletAddress,
    provider,
    presaleContract,
    // Методы подключения:
    connectMetamask,
    connectWalletConnect,
    connectCoinbaseWallet,
  } = useContext(Web3Context);

  // Состояния для отображения
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fundsRaised, setFundsRaised] = useState<bigint | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [currentPriceRaw, setCurrentPriceRaw] = useState<bigint | null>(null);
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [userPurchased, setUserPurchased] = useState<number>(0);

  // Поля ввода
  const [ethAmount, setEthAmount] = useState<string>('');
  const [gmfAmount, setGmfAmount] = useState<string>('');

  // Локальный попап (для выбора кошелька)
  const [showPopup, setShowPopup] = useState<boolean>(false);

  // ================================
  // Функция для получения данных о пресейле
  const fetchData = async () => {
    if (!presaleContract || !provider) return;
    try {
      setErrorMsg(null);

      // Приведём контракт к IPresaleContract
      const contractRead = presaleContract as unknown as IPresaleContract;
      const [price, raised, endTime] = await Promise.all([
        contractRead.currentPrice(),
        contractRead.fundsRaised(),
        contractRead.endTime(),
      ]);

      // Получаем цену ETH/USD (через priceFeed)
      const priceFeedAddress = await contractRead.priceFeedAddress();
      const priceFeed = new Contract(
        priceFeedAddress,
        [
          'function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
        ],
        provider
      );
      const feedData = await priceFeed.latestRoundData();
      const ethPriceInUsd = Number(feedData[1]) / 1e8;

      // Считаем время до конца
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = Number(endTime) > now ? Number(endTime) - now : 0;

      setCurrentPriceRaw(price);
      setFundsRaised(raised);
      setRemainingTime(timeLeft);
      setEthPrice(ethPriceInUsd);

      // Сколько пользователь уже купил (pendingClaims)
      if (walletAddress) {
        const pending = await contractRead.pendingClaims(walletAddress);
        const pendingNum = Number(formatUnits(pending, 18));
        setUserPurchased(pendingNum);
      }
    } catch (error) {
      console.error('Failed to fetch presale data:', error);
      setErrorMsg('Failed to fetch presale data.');
    }
  };

  // При изменении кошелька/конракта перезапрашиваем данные
  useEffect(() => {
    fetchData();
  }, [walletAddress, presaleContract]);

  // Формат ETH
  const formatEth = (wei: bigint): string => (Number(wei) / 1e18).toFixed(4);
  // Формат USD
  const formatUsd = (rawPrice: bigint): string => (Number(rawPrice) / 1e18).toFixed(2);

  // ================================
  // Метод buyTokens
  const handleBuyTokens = async () => {
    if (!ethAmount || Number(ethAmount) <= 0) {
      alert('Enter a valid ETH amount first.');
      return;
    }
    if (!walletAddress) {
      alert('Connect your wallet first.');
      return;
    }
    if (!provider || !presaleContract) {
      alert('Provider or contract not ready.');
      return;
    }
    try {
      setErrorMsg(null);
      const signer = await provider.getSigner();
      const contractWrite = presaleContract.connect(signer) as unknown as IPresaleContract;

      // Передаём ETH через value:
      const tx = await contractWrite.buyTokens({
        value: parseEther(ethAmount),
      });
      await tx.wait();

      alert('Tokens purchased successfully!');
      fetchData();
    } catch (error: any) {
      console.error('Error in buyTokens:', error);
      setErrorMsg(error.reason || 'Error buying tokens.');
    }
  };

  // Метод buyAndStake
  const handleBuyAndStake = async () => {
    if (!ethAmount || Number(ethAmount) <= 0) {
      alert('Enter a valid ETH amount first.');
      return;
    }
    if (!walletAddress) {
      alert('Connect your wallet first.');
      return;
    }
    if (!provider || !presaleContract) {
      alert('Provider or contract not ready.');
      return;
    }
    try {
      setErrorMsg(null);
      const signer = await provider.getSigner();
      const contractWrite = presaleContract.connect(signer) as unknown as IPresaleContract;

      const tx = await contractWrite.buyAndStake({
        value: parseEther(ethAmount),
      });
      await tx.wait();

      alert('Tokens bought & staked successfully!');
      fetchData();
    } catch (error: any) {
      console.error('Error in buyAndStake:', error);
      setErrorMsg(error.reason || 'Error in buyAndStake.');
    }
  };

  // ================================
  // Логика расчёта ETH <-> GMF
  const handleChangeEth = (val: string) => {
    if (!/^\d*\.?\d*$/.test(val)) return;
    setEthAmount(val);

    if (Number(val) > 0 && currentPriceRaw && ethPrice) {
      const tokenPriceInUsd = Number(currentPriceRaw.toString()) / 1e18;
      const tokenPriceInEth = tokenPriceInUsd / ethPrice; 
      const gmf = Number(val) / tokenPriceInEth;
      setGmfAmount(gmf.toFixed(3));
    } else {
      setGmfAmount('');
    }
  };

  const handleChangeGMF = (val: string) => {
    if (!/^\d*\.?\d*$/.test(val)) return;
    setGmfAmount(val);

    if (Number(val) > 0 && currentPriceRaw && ethPrice) {
      const tokenPriceInUsd = Number(currentPriceRaw.toString()) / 1e18;
      const tokenPriceInEth = tokenPriceInUsd / ethPrice;
      const eth = Number(val) * tokenPriceInEth;
      setEthAmount(eth.toFixed(6));
    } else {
      setEthAmount('');
    }
  };

  // ================================
  // Countdown
  const renderer: CountdownRendererFn = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }) => {
    if (completed) {
      return <span>Time is up!</span>;
    }
    return (
      <CountDown>
        <div>
          <CountDownItem>{days}</CountDownItem>
          <CountDownItemSubtext>Days</CountDownItemSubtext>
        </div>
        <CountDownSeparator>:</CountDownSeparator>
        <div>
          <CountDownItem>{hours}</CountDownItem>
          <CountDownItemSubtext>Hours</CountDownItemSubtext>
        </div>
        <CountDownSeparator>:</CountDownSeparator>
        <div>
          <CountDownItem>{minutes}</CountDownItem>
          <CountDownItemSubtext>Minutes</CountDownItemSubtext>
        </div>
        <CountDownSeparator>:</CountDownSeparator>
        <div>
          <CountDownItem>{seconds}</CountDownItem>
          <CountDownItemSubtext>Seconds</CountDownItemSubtext>
        </div>
      </CountDown>
    );
  };

  // ================================
  // Открытие попапа (выбор кошелька)
  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  // Метамаск
  const handleConnectMetamask = async () => {
    setShowPopup(false);
    await connectMetamask();
  };

  // WalletConnect (если хотите оставить)
  const handleConnectWalletConnect = async () => {
    setShowPopup(false);
    if (!connectWalletConnect) {
      alert('WalletConnect logic not implemented in WebProvider');
      return;
    }
    await connectWalletConnect();
  };

  // Coinbase
  const handleConnectCoinbase = async () => {
    setShowPopup(false);
    await connectCoinbaseWallet();
  };

  // ================================
  // Рендер
  return (
    <FormS imageUrl={bg}>
      <FormTitle>Grab it now before the cost goes up!</FormTitle>

      {errorMsg && (
        <Text16 center={true} style={{ color: 'red', marginBottom: '10px' }}>
          {errorMsg}
        </Text16>
      )}

      {remainingTime && remainingTime > 0 ? (
        <>
          <Countdown date={Date.now() + remainingTime * 1000} renderer={renderer} />
          <Text16 center={true} style={{ margin: '10px 0 5px' }}>
            Until Next Price Increase
          </Text16>
        </>
      ) : (
        <Text16 center={true} style={{ margin: '10px 0 5px' }}>
          No active countdown. Possibly presale not active or not initialized.
        </Text16>
      )}

      <StyledProgress value={0.7} />

      <TextBox>
        <Text16 center={true}>Funds Raised (ETH):</Text16>
        <Text16 center={true}>{fundsRaised ? formatEth(fundsRaised) : '0'}</Text16>
      </TextBox>
      <TextBox>
        <Text16 center={true}>Funds Raised ($):</Text16>
        <Text16 center={true}>
          {fundsRaised && ethPrice
            ? `$${((Number(fundsRaised) / 1e18) * ethPrice).toFixed(2)}`
            : '...'}
        </Text16>
      </TextBox>

      <Text24 style={{ margin: '10px 0' }}>
        You purchased: {userPurchased.toFixed(3)} GMF
      </Text24>
      <Text24 style={{ margin: '10px 0 20px' }}>
        Current Price: {currentPriceRaw ? `$${formatUsd(currentPriceRaw)}` : '...'}
      </Text24>

      <InfoButton imageUrl={ethBg}>
        {fundsRaised ? `${formatEth(fundsRaised)} ETH` : 'Loading...'}
      </InfoButton>

      {/* Поля ввода ETH / GMF */}
      <Box>
        <BoxItem>
          <Text16 center={false}>You Pay (ETH)</Text16>
          <Input>
            <input
              type="text"
              placeholder="Enter ETH amount"
              value={ethAmount}
              onChange={(e) => handleChangeEth(e.target.value)}
            />
          </Input>
        </BoxItem>
        <BoxItem>
          <Text16 center={false}>You Receive ($GMF)</Text16>
          <Input>
            <input
              type="text"
              placeholder="Enter GMF amount"
              value={gmfAmount}
              onChange={(e) => handleChangeGMF(e.target.value)}
            />
            <InputText>$GMF</InputText>
          </Input>
        </BoxItem>
      </Box>

      {/* Если нет кошелька – кнопка "Connect Wallet" */}
      {!walletAddress ? (
        <InfoButton
          imageUrl={walletBg}
          style={{ textTransform: 'none' }}
          onClick={handleOpenPopup}
          color="#000"
        >
          Connect Wallet
        </InfoButton>
      ) : (
        // Если уже подключён – Buy / Buy & Stake
        <>
          <InfoButton
            imageUrl={walletBg}
            style={{ textTransform: 'none', marginTop: '20px' }}
            onClick={handleBuyTokens}
            color="#FFF"
          >
            Buy ({walletAddress.slice(0, 6)}...{walletAddress.slice(-4)})
          </InfoButton>

          <InfoButton
            height={54}
            width={387}
            imageUrl={buyButtonBg}
            style={{ textTransform: 'none', marginTop: '20px' }}
            onClick={handleBuyAndStake}
          >
            <Text24>Buy & Stake!</Text24>
          </InfoButton>
        </>
      )}
      
      {showPopup && (
        <Modal style = {{gap:"16px"}} onClose={() => setShowPopup(false)}>
            <ModalTitle color="#20C954">CONNECT WALLET</ModalTitle>
            
            <Text20 center={true} >If you already have a wallet, select your desired wallet from the options below. If you don’t have a wallet, download BestWallet to get started.</Text20>
            {/* Metamask */}
            <ButtonWithBg
              bgColor='#EC801C'
              onClick={handleConnectMetamask}
              style={{width:"100%",color:"#fff", fontSize:"24px"}} 
            >
              <Row style={{justifyContent:"space-between", alignItems:"center", padding:"9px 8px", flexDirection:"row"}} >Metamask <img src={metaMask}/></Row>
            </ButtonWithBg>

            {/* WalletConnect — только если у вас есть connectWalletConnect */}
            <ButtonWithBg
              bgColor='#0888F0'
              onClick={handleConnectWalletConnect}
              style={{width:"100%",color:"#fff", fontSize:"24px"}} 
            >
              <Row style={{justifyContent:"space-between", alignItems:"center", padding:"9px 8px",flexDirection:"row"}} >Wallet Connect<img src={walletConnect}/></Row>
            </ButtonWithBg>

            {/* Coinbase */}
            <ButtonWithBg
            bgColor='#0052FF'
              onClick={handleConnectCoinbase}
              style={{width:"100%",color:"#fff", fontSize:"24px"}} 
            >
              <Row style={{justifyContent:"space-between", alignItems:"center", padding:"9px 8px",flexDirection:"row"}} >Coinbase Wallet <img src={coinbase}/></Row>
            </ButtonWithBg>

        </Modal>
      )}
    </FormS>
  );
};
