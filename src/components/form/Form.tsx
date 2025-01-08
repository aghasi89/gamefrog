// Form.tsx
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
  Loader,
} from './styled';
import { B, ButtonWithBg, InfoButton, ModalTitle, Text20 } from '../../styled';
import { Web3Context } from '../../WebProvider';
import Modal from '../modal/Modal';
import { Row } from '../../utils';

import { useWindowSize } from '../../hooks';
import { TextBorder } from '../../Staking';

const walletConnect = require('../../assets/images/wallet-connect.png');
const metaMask = require('../../assets/images/metamask.png');
const coinbase = require('../../assets/images/coinbase.png');
const etherIcon = require('../../assets/images/ethereum.png');

// Интерфейсы (если нужны):
interface IPresaleContract {
  buyTokens(overrides?: TransactionRequest): Promise<TransactionResponse>;
  buyAndStake(overrides?: TransactionRequest): Promise<TransactionResponse>;
  currentPrice(): Promise<bigint>;
  fundsRaised(): Promise<bigint>;
  endTime(): Promise<bigint>;
  priceFeedAddress(): Promise<string>;
  pendingClaims(address: string): Promise<bigint>;
}
interface IStakingContract {
  stakers(address: string): Promise<[bigint, bigint]>;
}

export const Form = () => {
  const { width } = useWindowSize();
  const isDesktop = width >= 1024;

  // Достаём из контекста всё, включая disconnectWallet
  const {
    walletAddress,
    provider,
    presaleContract,
    stakingContract,
    connectMetamask,
    connectWalletConnect,
    connectCoinbaseWallet,
    disconnectWallet, // <-- используем
  } = useContext(Web3Context);

  // Локальные стейты
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fundsRaised, setFundsRaised] = useState<bigint | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [currentPriceRaw, setCurrentPriceRaw] = useState<bigint | null>(null);
  const [ethPrice, setEthPrice] = useState<number | null>(null);


  const [loading, setLoading] = useState<boolean>(false);


  const [userPurchased, setUserPurchased] = useState<number>(0);

  const [ethAmount, setEthAmount] = useState<string>('');
  const [gmfAmount, setGmfAmount] = useState<string>('');

  const [showPopup, setShowPopup] = useState<boolean>(false);

  // ====================== FETCH DATA ============================
  const fetchData = async () => {
    if (!presaleContract || !provider) return;
    try {
      setErrorMsg(null);

      const contractRead = presaleContract as unknown as IPresaleContract;

      const [price, raised, endTime] = await Promise.all([
        contractRead.currentPrice(),
        contractRead.fundsRaised(),
        contractRead.endTime(),
      ]);

      // Chainlink oracles
      const priceFeedAddr = await contractRead.priceFeedAddress();
      const priceFeed = new Contract(
        priceFeedAddr,
        [
          'function latestRoundData() view returns (uint80, int256, uint256, uint256, uint80)',
        ],
        provider
      );
      const feedData = await priceFeed.latestRoundData();
      const ethPriceInUsd = Number(feedData[1]) / 1e8;

      const now = Math.floor(Date.now() / 1000);
      const timeLeft = Number(endTime) > now ? Number(endTime) - now : 0;

      setCurrentPriceRaw(price);
      setFundsRaised(raised);
      setRemainingTime(timeLeft);
      setEthPrice(ethPriceInUsd);

      // Считаем userPurchased
      if (walletAddress) {
        const pending = await contractRead.pendingClaims(walletAddress);
        const pendingNum = Number(formatUnits(pending, 18));

        let totalUser = pendingNum;
        if (stakingContract) {
          const stakingRead = stakingContract as unknown as IStakingContract;
          const stakerData = await stakingRead.stakers(walletAddress);
          const stakedNum = Number(formatUnits(stakerData[0], 18));
          totalUser += stakedNum;
        }

        setUserPurchased(Math.floor(totalUser));
      }
    } catch (error) {
      console.error('Failed to fetch presale data:', error);
      setErrorMsg('Failed to fetch presale data.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [walletAddress, presaleContract, stakingContract]);

  // ====================== FORMAT UTILS ==========================
  const formatEth = (wei: bigint): string => (Number(wei) / 1e18).toFixed(4);
  const formatUsd = (rawPrice: bigint): string => (Number(rawPrice) / 1e18).toFixed(2);

  // ====================== BUY / STAKE ===========================
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

      const tx = await contractWrite.buyTokens({ value: parseEther(ethAmount) });
      await tx.wait();

      alert('Tokens purchased successfully!');
      fetchData();
    } catch (error: any) {
      console.error('Error in buyTokens:', error);
      setErrorMsg(error.reason || 'Error buying tokens.');
    }
  };

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

      const tx = await contractWrite.buyAndStake({ value: parseEther(ethAmount) });
      await tx.wait();

      alert('Tokens bought & staked successfully!');
      fetchData();
    } catch (error: any) {
      console.error('Error in buyAndStake:', error);
      setErrorMsg(error.reason || 'Error in buyAndStake.');
    }
  };

  // ====================== ETH ↔ GMF CONVERSION ==================
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

  // ====================== COUNTDOWN =============================
  const renderer: CountdownRendererFn = ({ days, hours, minutes, seconds, completed }) => {
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

  // Открыть попап выбора кошелька
  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  // ====================== RENDER =================================
  return (
    <FormS>
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
          No active countdown. Possibly presale not active or ended.
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
        You purchased: {userPurchased} GMF
      </Text24>

      <Text24 style={{ margin: '10px 0 20px' }}>
        Current Price: {currentPriceRaw ? `$${formatUsd(currentPriceRaw)}` : '...'}
      </Text24>

      <InfoButton bgColor='#000'>
        {fundsRaised ? (
          <>
            {formatEth(fundsRaised)}{' '}
            <img width={24} style={{ margin: '0 10px' }} src={etherIcon} alt="ETH" />
            ETH
          </>
        ) : (
          'Loading...'
        )}
      </InfoButton>

      {/* Поля ETH / GMF */}
      <Box>
        <BoxItem>
          <Text16 center={false}>You Pay (ETH)</Text16>
          <Input>
            <input
              type="text"
              placeholder="Enter ETH"
              value={ethAmount}
              onChange={(e) => handleChangeEth(e.target.value)}
            />
            <InputText>
              <img width={24} src={etherIcon} alt="ETH" />
            </InputText>
          </Input>
        </BoxItem>
        <BoxItem>
          <Text16 center={false}>You Receive ($GMF)</Text16>
          <Input>
            <input
              type="text"
              placeholder="Enter GMF"
              value={gmfAmount}
              onChange={(e) => handleChangeGMF(e.target.value)}
            />
            <InputText>$GMF</InputText>
          </Input>
        </BoxItem>
      </Box>

      {/* Если нет кошелька -> Connect Wallet */}
      {!walletAddress ? (
        <InfoButton
          bgColor='#20C954'
          style={{ textTransform: 'none' }}
          onClick={handleOpenPopup}
          color="#000"
        >
          <B>Connect Wallet</B>
        </InfoButton>
      ) : (
        <>
          {/* BUY */}
          <InfoButton
            bgColor='#20C954'
            style={{ textTransform: 'none', marginTop: '20px' }}
            onClick={handleBuyTokens}
            color="#FFF"
          >
            <B>Buy ({walletAddress.slice(0, 6)}...{walletAddress.slice(-4)})</B>
          </InfoButton>

          {/* BUY & STAKE */}
          <InfoButton
            height={54}
            width={387}
            bgColor='#FE8903'
            style={{ textTransform: 'none', marginTop: '20px' }}
            onClick={handleBuyAndStake}
          >
            <Text24>
              <B>Buy & Stake!</B>
            </Text24>
          </InfoButton>

          {/* Disconnect Wallet */}
          <InfoButton
            bgColor='#CE4242'
            style={{ textTransform: 'none', marginTop: '20px' }}
            onClick={() => {
              // Вызов метода disconnectWallet из контекста
              disconnectWallet();
            }}
            color="#000"
          >
            <B>Disconnect Wallet</B>
          </InfoButton>
        </>
      )}

      {/* Модалка «Connect Wallet» */}
      {showPopup && (
        <Modal style={{ gap: '16px' }} onClose={() => setShowPopup(false)}>
          <ModalTitle color="#20C954">CONNECT WALLET</ModalTitle>
          <Text20 center={true}>
            If you already have a wallet, select your desired wallet from the options below.
          </Text20>

          {/* Metamask (только на десктопе) */}
          {isDesktop && (
            <ButtonWithBg
              bgColor='#EC801C'
              onClick={async () => {
                setShowPopup(false);
                await connectMetamask();
              }}
              style={{ width: '100%', color: '#fff', fontSize: '24px' }}
            >
              <Row
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '9px 8px',
                  flexDirection: 'row'
                }}
              >
                Metamask <img src={metaMask} alt="Metamask" />
              </Row>
            </ButtonWithBg>
          )}

          {/* WalletConnect */}
          <ButtonWithBg
            bgColor='#0888F0'
            onClick={async () => {
              setShowPopup(false);
              await connectWalletConnect();
            }}
            style={{ width: '100%', color: '#fff', fontSize: '24px' }}
          >
            <Row
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '9px 8px',
                flexDirection: 'row'
              }}
            >
              Wallet Connect <img src={walletConnect} alt="WC" />
            </Row>
          </ButtonWithBg>

          {/* Coinbase */}
          <ButtonWithBg
            bgColor='#0052FF'
            onClick={async () => {
              setShowPopup(false);
              await connectCoinbaseWallet();
            }}
            style={{ width: '100%', color: '#fff', fontSize: '24px' }}
          >
            <Row
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '9px 8px',
                flexDirection: 'row'
              }}
            >
              Coinbase Wallet <img src={coinbase} alt="Coinbase" />
            </Row>
          </ButtonWithBg>
        </Modal>
      )}
     {loading &&  <Loader><div><TextBorder>loading...</TextBorder></div></Loader>}
    </FormS>
  );
};
