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
import { InfoButton } from '../../styled';
import { Web3Context } from '../../App';

const bg = require('../../assets/images/form-bg.png');
const ethBg = require('../../assets/images/btn-etc.png');
const walletBg = require('../../assets/images/btn-wallet.png');
const buyButtonBg = require('../../assets/images/buy_btn_bg.png');

interface IPresaleContract {
  buyTokens(overrides?: TransactionRequest): Promise<TransactionResponse>;
}

export const Form = () => {
  const { walletAddress, provider, presaleContract, connectWallet } =
    useContext(Web3Context);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fundsRaised, setFundsRaised] = useState<bigint | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [currentPriceRaw, setCurrentPriceRaw] = useState<bigint | null>(null);
  const [ethPrice, setEthPrice] = useState<number | null>(null);
  const [userPurchased, setUserPurchased] = useState<number>(0);

  const [ethAmount, setEthAmount] = useState<string>('');
  const [gmfAmount, setGmfAmount] = useState<string>('');

  const fetchData = async () => {
    if (!presaleContract || !provider) return;
    try {
      setErrorMsg(null);

      const price = await presaleContract.currentPrice();
      const raised = await presaleContract.fundsRaised();
      const endTime = await presaleContract.endTime();

      const priceFeedAddress = await presaleContract.priceFeedAddress();
      console.log('Price Feed Address:', priceFeedAddress);

      const priceFeedContract = new Contract(
        priceFeedAddress,
        [
          'function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
        ],
        provider
      );

      const priceFeed = await priceFeedContract.latestRoundData();
      console.log('Price Feed Data:', priceFeed);

      const ethPriceInUsd = Number(priceFeed[1]) / 1e8; // ETH/USD price
      console.log('ETH Price in USD:', ethPriceInUsd);

      const now = Math.floor(Date.now() / 1000);
      const timeLeft = Number(endTime) > now ? Number(endTime) - now : 0;

      setCurrentPriceRaw(BigInt(price.toString()));
      setFundsRaised(BigInt(raised.toString()));
      setRemainingTime(timeLeft);
      setEthPrice(ethPriceInUsd);

      if (walletAddress) {
        const pending = await presaleContract.pendingClaims(walletAddress);
        const pendingNum = Number(formatUnits(pending, 18));
        setUserPurchased(pendingNum);
      }
    } catch (error) {
      console.error('Failed to fetch presale data:', error);
      setErrorMsg('Failed to fetch presale data.');
    }
  };

  useEffect(() => {
    fetchData();
  }, [walletAddress, presaleContract]);

  const formatEth = (wei: bigint): string => (Number(wei) / 1e18).toFixed(4);
  const formatUsd = (rawPrice: bigint): string => (Number(rawPrice) / 1e18).toFixed(2);

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

      const tx = await contractWrite.buyTokens({
        value: parseEther(ethAmount),
      });
      await tx.wait();

      alert('Tokens purchased successfully!');
      fetchData();
    } catch (error: any) {
      console.error('Error buying tokens:', error);
      setErrorMsg(error.reason || 'Error buying tokens.');
    }
  };

  const handleChangeEth = (val: string) => {
    if (!/^\d*\.?\d*$/.test(val)) return;
    setEthAmount(val);

    if (Number(val) > 0 && currentPriceRaw && ethPrice) {
      const tokenPriceInUsd = Number(currentPriceRaw.toString()) / 1e18; // Цена токена в $
      const tokenPriceInEth = tokenPriceInUsd / ethPrice; // Цена токена в ETH
      const gmf = Number(val) / tokenPriceInEth; // Расчёт количества токенов
      setGmfAmount(gmf.toFixed(3)); // Ограничиваем точность до 3 знаков
    } else {
      setGmfAmount(''); // Если значение некорректно, сбрасываем поле $GMF
    }
  };

  const handleChangeGMF = (val: string) => {
    if (!/^\d*\.?\d*$/.test(val)) return;
    setGmfAmount(val);

    if (Number(val) > 0 && currentPriceRaw && ethPrice) {
      const tokenPriceInUsd = Number(currentPriceRaw.toString()) / 1e18; // Цена токена в $
      const tokenPriceInEth = tokenPriceInUsd / ethPrice; // Цена токена в ETH
      const eth = Number(val) * tokenPriceInEth; // Расчёт суммы в ETH
      setEthAmount(eth.toFixed(6)); // Ограничиваем точность до 6 знаков
    } else {
      setEthAmount(''); // Если значение некорректно, сбрасываем поле ETH
    }
  };

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
        <Text16 center={true}>{fundsRaised && ethPrice ? `$${(Number(fundsRaised) / 1e18 * ethPrice).toFixed(2)}` : '...'}</Text16>
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

      <InfoButton
        imageUrl={walletBg}
        style={{ textTransform: 'none' }}
        onClick={walletAddress ? handleBuyTokens : connectWallet}
        color={walletAddress ? '#FFF' : '#000'}
      >
        {walletAddress
          ? `Buy Tokens: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
          : 'Connect Wallet'}
      </InfoButton>
      {walletAddress && <InfoButton
            height={54}
            width={387}
            imageUrl={buyButtonBg}
            style={{ textTransform: 'none', marginTop: '30px' }}
            onClick={() => {
            }
            }
        >
        <Text24>Buy Now!</Text24>
    </InfoButton>}

    </FormS>
  );
};
