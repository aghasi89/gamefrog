import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { parseUnits, formatUnits } from 'ethers';

// Локальные/ваши импорты
import { Header } from './components/header';
import { StakeForm } from './components/stakeForm';
import { Calculate } from './components/calculate';
import Modal from './components/modal/Modal';

// Стили
import {
  Btn,
  Container,
  FinalForm,
  FinalFormBtn,
  FinalFormFooter,
  FinalFormInput,
  FinalFormLink,
  FinalFormTextarea,
  Text16,
  Text24,
  Text32,
  Text48,
  Wrapper,
  ModalTitle,
  MoveText,
  SecondTitleInStaking,
  InfoButton,
  ButtonWithBg,
} from './styled';

import { useWindowSize } from './hooks';
import { calculateNewHeight } from './App';
import { Cloud, CloudContainer } from './assets/cloud';

// Web3Context с вашим connectMetamask/WalletConnect/CoinbaseWallet
import { Web3Context } from './WebProvider';

// Картинка для модалки «Успешно застейкано»
import SuccessStakedImage from './assets/images/success_staked_modal.png';

// Прочие ресурсы
const walletBg = require('./assets/images/btn-wallet.png');
const bgPage = require('./assets/images/staking-bg.png');
const bgPageMob = require('./assets/images/coins-bg.png');
const socialX = require('./assets/images/x.png');
const socialXText = require('./assets/images/x_text.png');
const socialTG = require('./assets/images/telegram.png');
const socialTGText = require('./assets/images/telegram_text.png');
const socialFB = require('./assets/images/fb.png');
const socialFBText = require('./assets/images/facebook_text.png');
const socailInst = require('./assets/images/insta.png');
const socialInstText = require('./assets/images/instagram_text.png');



const logoText = require('./assets/images/logo_staking.png');

// Пул стейкинга: 345,000,000 * 10^18
const STAKING_POOL_ALLOCATION = parseUnits('345000000', 18);

export const Staking = () => {
  const { width } = useWindowSize();
  const isDesktop = width >= 1024;

  // Достаём из контекста всё нужное для взаимодействия с контрактами
  const {
    walletAddress,
    provider,
    stakingContract,
    presaleContract,
    connectMetamask,
    connectWalletConnect,
    connectCoinbaseWallet,
  } = useContext(Web3Context);

  // Проверка: пресейл закончен или нет
  const [isPresaleEnded, setIsPresaleEnded] = useState<boolean>(false);

  // Данные для карточек вверху
  const [totalStaked, setTotalStaked] = useState<string>('0.0');
  const [poolRemaining, setPoolRemaining] = useState<string>('0.0');
  const [apy, setApy] = useState<string>('0%');
  const [apr, setApr] = useState<string>('0%');

  // Модалка «Успешно застейкано»
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  // Сколько пользователь застейкал
  const [userStaked, setUserStaked] = useState<string>('0.0');

  // Локальный расчёт (40%) для UI
  const [calcProfit, setCalcProfit] = useState<string>('0.0');

  // Попап «Connect wallet»
  const [showPopup, setShowPopup] = useState<boolean>(false);

  // Анимация облаков (мобилка)
  const clouds = [
    { top: 0, delay: 0, duration: 30 },
    { top: 20, delay: 0, duration: 50 },
    { top: 180, delay: 0, duration: 30 },
    { top: 220, delay: 0, duration: 40 },
    { top: 80, delay: 0, duration: 80 },
    { top: 240, delay: 0, duration: 20 },
  ];

  // При загрузке/изменении кошелька -> подгружаем данные
  useEffect(() => {
    checkPresaleEnded();
    fetchStakingData();
  }, [walletAddress, stakingContract, presaleContract]);

  // Узнаём, закончился ли пресейл
  const checkPresaleEnded = async () => {
    if (!presaleContract) return;
    try {
      const ended = await presaleContract.isPresaleEnded();
      setIsPresaleEnded(ended);
    } catch (error) {
      console.error('Error checking presale ended:', error);
    }
  };

  // Получаем данные из стейкинг-контракта + считаем APR/APY
  const fetchStakingData = async () => {
    if (!stakingContract) return;
    try {
      // 1) totalStaked
      const rawStaked: bigint = await stakingContract.getTotalStaked();
      const stakedFloat = parseFloat(formatUnits(rawStaked, 18));
      setTotalStaked(stakedFloat.toFixed(1));

      // 2) poolRemaining
      const remain = STAKING_POOL_ALLOCATION - rawStaked;
      const remainFloat = parseFloat(formatUnits(remain, 18));
      setPoolRemaining(remainFloat.toFixed(1));

      // 3) userStaked
      if (walletAddress) {
        const stakerInfo = await stakingContract.stakers(walletAddress);
        const rawUserStaked = stakerInfo.amount;
        const userFloat = parseFloat(formatUnits(rawUserStaked, 18));
        setUserStaked(userFloat.toFixed(1));
      }

      // 4) dailyReward (public в стейкинге)
      const rawDailyReward: bigint = await stakingContract.dailyReward();
      const dailyRewardFloat = parseFloat(formatUnits(rawDailyReward, 18));

      // 5) Считаем APR/APY
      // dailyFraction = dailyReward / totalStaked
      // APR = dailyFraction * 365 * 100%, APY ~ ( (1 + dailyFraction)^365 - 1 ) * 100%
      if (stakedFloat > 0) {
        const dailyFraction = dailyRewardFloat / stakedFloat;
        const aprVal = dailyFraction * 365 * 100;
        const apyVal = (Math.pow(1 + dailyFraction, 365) - 1) * 100;
        setApr(aprVal.toFixed(2) + '%');
        setApy(apyVal.toFixed(2) + '%');
      } else {
        setApr('0%');
        setApy('0%');
      }
    } catch (err) {
      console.error('Error fetching staking data:', err);
    }
  };

  // ============================= STAKE ==========================
  const handleStake = async (amount: string) => {
    // 1. Проверяем, есть ли signer
    if (!provider || !walletAddress) {
      // Вместо alert(...) показываем попап
      setShowPopup(true);
      return;
    }
    if (!amount || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
  
    try {
      // 2. Получаем signer (если provider = BrowserProvider)
      const signer = await provider.getSigner(); 
  
      if (!isPresaleEnded) {
        if (!presaleContract) {
          alert('Presale contract not found');
          return;
        }
        // 3. Подключаем контракт к signer
        const presale = presaleContract.connect(signer);
        // 4. Отправляем транзакцию
        const tx = await presale.stakeFromPending(parseUnits(amount, 18));
        await tx.wait();
  
        alert(`Staked ${amount} from pending successfully!`);
        setIsOpenModal(true);
  
      } else {
        if (!stakingContract) {
          alert('Staking contract not found');
          return;
        }
        const staking = stakingContract.connect(signer);
        const tx = await staking.stake(parseUnits(amount, 18));
        await tx.wait();
  
        alert(`Staked ${amount} tokens successfully!`);
        setIsOpenModal(true);
      }
  
      fetchStakingData();
  
    } catch (error) {
      console.error('Error in handleStake:', error);
      alert('Error in handleStake. Check console.');
    }
  };

  // ============================= CLAIM ==========================
  const handleClaim = async () => {
    if (!isPresaleEnded) {
      alert('Cannot claim yet: presale not ended!');
      return;
    }
    if (!provider || !stakingContract || !walletAddress) {
      setShowPopup(true);
      return;
    }
    try {
      const signer = provider.getSigner();
      const staking = stakingContract.connect(signer);
      const tx = await staking.claimReward();
      await tx.wait();

      alert('Claimed successfully!');
      fetchStakingData();
    } catch (error) {
      console.error('Error claiming reward:', error);
      alert('Error claiming reward. Check console.');
    }
  };

  // ============================ UNSTAKE =========================
  const handleUnstake = async (amount: string) => {
    if (!isPresaleEnded) {
      alert('Cannot unstake yet: presale not ended!');
      return;
    }
    if (!provider || !stakingContract || !walletAddress) {
      setShowPopup(true);
      return;
    }
    if (!amount || Number(amount) <= 0) {
      alert('Enter a valid amount');
      return;
    }
    try {
      const signer = provider.getSigner();
      const staking = stakingContract.connect(signer);
      const tx = await staking.withdraw(parseUnits(amount, 18));
      await tx.wait();

      alert('Unstaked successfully!');
      fetchStakingData();
    } catch (error) {
      console.error('Error unstaking:', error);
      alert('Error unstaking. Check console.');
    }
  };

  // При вводе суммы → считаем «локальные» 40% (UI)
  const handleStakeAmountChange = (amount: number) => {
    const profit = (amount * 0.4).toFixed(1);
    setCalcProfit(profit);
  };

  return (
    <Wrapper
      style={{
        background: 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(104,114,227,1) 74%, rgba(164,124,245,1) 100%)',
      }}
    >
      <Container
        isPadding={true}
        imageUrl={isDesktop ? bgPage : bgPageMob}
        height={isDesktop ? calculateNewHeight(2340, width) : 3636}
        style={
          !isDesktop
            ? { backgroundPositionY: 'bottom', height: 'auto' }
            : { backgroundPositionY: 'bottom', height: 'auto' }

        }
      >
        <Header />

        {/* Облака (мобилка) */}
        {!isDesktop && (
          <CloudContainer>
            {clouds.map((cloud, index) => (
              <Cloud key={index} top={cloud.top} duration={cloud.duration} delay={cloud.delay}>
                <svg
                  width="240"
                  height="97"
                  viewBox="0 0 240 97"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M239.111 44.6661C239.111 32.9811 223.866 23.5085 205.06 23.5085C204.118 23.5085 203.188 23.5386 202.265 23.5853C199.457 13.6578 185.521 6.11221 168.739 6.11221C160.52 6.11221 152.982 7.92191 147.098 10.9347C141.296 4.41584 130.123 0 117.285 0C104.505 0 93.3759 4.37737 87.552 10.8484C82.0369 8.45835 75.335 7.05255 68.1011 7.05255C49.2955 7.05255 34.0506 16.5251 34.0506 28.2102C15.2449 28.2102 0 37.6828 0 49.3678C0 61.0528 15.2449 70.5254 34.0506 70.5254C34.0506 82.2105 49.2955 91.6831 68.1011 91.6831C77.0787 91.6831 85.2395 89.5208 91.3229 85.9931C97.1434 92.4715 108.28 96.8549 121.069 96.8549C136.438 96.8549 149.424 90.5264 153.659 81.8355C159.34 84.4767 166.394 86.041 174.036 86.041C192.381 86.041 207.33 77.0261 208.052 65.7377C225.455 64.7954 239.111 55.7242 239.111 44.6661Z"
                    fill="white"
                  />
                </svg>
              </Cloud>
            ))}
          </CloudContainer>
        )}

        <Row style={{ margin: '40px auto' }}>
          <SecondTitleInStaking style={{ justifyContent: 'center' }}>
            {isDesktop ? (
              <span>
                Welcome to the{' '}
                <MoveText delay={0} duration={0.6} bgColor="#20C954" size={isDesktop ? 28 : 16}>
                  Gamefrog
                </MoveText>
                <br />
                <MoveText delay={0} duration={1} bgColor="#C92064" color="#FFF" size={isDesktop ? 28 : 16}>
                  Staking
                </MoveText>{' '}
                experience
              </span>
            ) : (
              <span>
                Welcome to the
                <br />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <MoveText delay={0} duration={1.2} bgColor="#20C954" size={isDesktop ? 28 : 16}>
                    Gamefrog
                  </MoveText>
                  <br />
                  <MoveText delay={0} duration={1} bgColor="#C92064" color="#FFF" size={isDesktop ? 28 : 16}>
                    Staking
                  </MoveText>
                </div>
                experience
              </span>
            )}
          </SecondTitleInStaking>
        </Row>

        <CardWra>
          <Cards>
            {/* Total Staked */}
            <Card>
              <Text16 center={true}>Total Staked</Text16>
              <Text32 center={true}>{totalStaked}</Text32>
            </Card>

            {/* Pool Remaining */}
            <Card>
              <Text16 center={true}>Pool Remaining</Text16>
              <Text32 center={true}>{poolRemaining}</Text32>
            </Card>

            {/* APY */}
            <Card>
              <Text16 center={true}>APY</Text16>
              <Text32 center={true}>{apy}</Text32>
            </Card>

            {/* APR */}
            <Card>
              <Text16 center={true}>APR</Text16>
              <Text32 center={true}>{apr}</Text32>
            </Card>
          </Cards>
        </CardWra>

        <StakeRow style={{ marginBottom: '30px', padding: '0 16px' }}>
          {/* STAKE */}
          <StakeCol>
            <StakeForm
              title="STAKE"
              text={`You Will Earn: ~40% => ${calcProfit}\nYour staked: ${userStaked} tokens`}
              value="0"
              buttonText="STAKE"
              onAction={(amount) => handleStake(amount)}
              onAmountChange={(num) => {
                setCalcProfit((num * 0.4).toFixed(1));
              }}
            />
          </StakeCol>

          {/* CLAIM */}
          {isPresaleEnded ? (
            <StakeCol>
              <StakeForm
                title="CLAIM"
                text="Your Rewards"
                value="0"
                buttonText="CLAIM"
                onAction={() => handleClaim()}
              />
            </StakeCol>
          ) : (
            <StakeCol>
              <StakeForm
                title="CLAIM"
                text="Not Available Yet"
                value="0"
                buttonText="CLAIM"
                onAction={() => alert('Presale not ended!')}
                disabled
              />
            </StakeCol>
          )}

          {/* UNSTAKE */}
          {isPresaleEnded ? (
            <StakeCol>
              <StakeForm
                title="UNSTAKE"
                text="Available to Unstake"
                value="0"
                buttonText="UNSTAKE"
                onAction={(amount) => handleUnstake(amount)}
              />
            </StakeCol>
          ) : (
            <StakeCol>
              <StakeForm
                title="UNSTAKE"
                text="Not Available Yet"
                value="0"
                buttonText="UNSTAKE"
                onAction={() => alert('Presale not ended!')}
              />
            </StakeCol>
          )}
        </StakeRow>

        <Row style={{ marginBottom: '30px', padding: '0 16px' }}>
          <Text32 color="#ffffff">Total supply</Text32>
        </Row>

        <Row style={{ justifyContent: 'center', marginBottom: '60px', padding: '0 16px' }}>
          <Column>
            {/* Показываем ваш «Calculate» без дополнительных запросов к контракту */}
            <Calculate column={true} />
          </Column>
        </Row>

        {/* Блок "Join the community" */}
        <RowStaking style={{ marginBottom: '60px', padding: '0 16px' }}>
          <ColStaking style={{ flex: 1 }}>
            <Block style={{ justifyContent: 'center', alignItems: 'center' }}>
              <img src={logoText} style={{ width: '250px' }} alt="logo" />
            </Block>
            <Block>
              <Text48 center={true}>Join the</Text48>
              <Text48 center={true} color="#20C954">
                <TextBorder>GAMEFROG</TextBorder>
              </Text48>
              <Text48 center={true}>Community</Text48>
              <Text24 center={true}>Stay connected with our global movement:</Text24>
              <Socials>
              <RowStakingQ >
                <a href='https://x.com/gamefrogvip/' target='_blank' rel="noreferrer">
                  <div>
                    <Btn
                      style={{
                        width: isDesktop ? '184px' : '64px',
                        maxWidth: isDesktop ? '184px' : '64px'
                      }}
                      bgImg={isDesktop ? socialXText : socialX}
                    />
                  </div>
                </a>
                <a href='https://t.me/gamefrogvip/' target='_blank' rel="noreferrer">
                  <div>
                    <Btn
                      style={{
                        width: isDesktop ? '181px' : '64px',
                        maxWidth: isDesktop ? '181px' : '64px'
                      }}
                      bgImg={isDesktop ? socialTGText : socialTG}
                    />
                  </div>
                </a>
              </RowStakingQ>
              <RowStakingQ style={{ height: 'auto', flexDirection: 'row' }}>
                <a href='https://www.facebook.com/gamefrogofficial' target='_blank' rel="noreferrer">
                  <div>
                    <Btn
                      style={{
                        width: isDesktop ? '184px' : '64px',
                        maxWidth: isDesktop ? '184px' : '64px'
                      }}
                      bgImg={isDesktop ? socialFBText : socialFB}
                    />
                  </div>
                </a>
                <a href='https://www.instagram.com/gamefrogvip/' target='_blank' rel="noreferrer">
                  <div>
                    <Btn
                      style={{
                        width: isDesktop ? '184px' : '64px',
                        maxWidth: isDesktop ? '184px' : '64px'
                      }}
                      bgImg={isDesktop ? socialInstText : socailInst}
                    />
                  </div>
                </a>
              </RowStakingQ>
              </Socials>
            </Block>
          </ColStaking>

          <Block style={isDesktop ? { flexGrow: 0, width: '550px', minWidth: '550px' } : {}}>
            <Text48 center={true}>Have</Text48>
            <Text48 center={true}>Questions?</Text48>
            <Text48 center={true} color="#FC743A">
              <TextBorder>Get in Touch</TextBorder>
            </Text48>
            <FinalForm>
              <FinalFormInput placeholder="Name:" />
              <FinalFormInput placeholder="Email:" />
              <FinalFormTextarea placeholder="Message:" />
              <FinalFormFooter>
                <FinalFormLink href="mailto:support@gamefrog.io">support@gamefrog.io</FinalFormLink>
                <FinalFormBtn>Send</FinalFormBtn>
              </FinalFormFooter>
            </FinalForm>
          </Block>
        </RowStaking>
      </Container>

      {/* Модалка «Successfully STAKED» */}
      {isOpenModal && (
        <Modal onClose={() => setIsOpenModal(false)}>
          <img height={179} src={SuccessStakedImage} alt="success" />
          <ModalTitle color="#20C954">Successfully STAKED</ModalTitle>
          <InfoButton
            bgColor="#20C954"
            style={{ textTransform: 'none', marginTop: '30px' }}
            onClick={() => setIsOpenModal(false)}
          >
            <Text16>OK</Text16>
          </InfoButton>
        </Modal>
      )}

      {/* Модальное окно «Connect wallet» */}
      {showPopup && (
        <Modal style={{ gap: '16px' }} onClose={() => setShowPopup(false)}>
          <ModalTitle color="#20C954">CONNECT WALLET</ModalTitle>
          <Text16 center={true}>
            If you already have a wallet, select your desired wallet from the options below.
            If you don’t have a wallet, download BestWallet to get started.
          </Text16>

          {/* Метамаск (только desktop?) */}
          {isDesktop && (
            <ButtonWithBg
              bgColor="#EC801C"
              onClick={async () => {
                setShowPopup(false);
                await connectMetamask();
              }}
              style={{ width: '100%', color: '#fff', fontSize: '24px' }}
            >
              <RowFlex>
                Metamask <img src={require('./assets/images/metamask.png')} alt="Metamask" />
              </RowFlex>
            </ButtonWithBg>
          )}

          {/* WalletConnect */}
          <ButtonWithBg
            bgColor="#0888F0"
            onClick={async () => {
              setShowPopup(false);
              await connectWalletConnect();
            }}
            style={{ width: '100%', color: '#fff', fontSize: '24px' }}
          >
            <RowFlex>
              Wallet Connect <img src={require('./assets/images/wallet-connect.png')} alt="WC" />
            </RowFlex>
          </ButtonWithBg>

          {/* Coinbase */}
          <ButtonWithBg
            bgColor="#0052FF"
            onClick={async () => {
              setShowPopup(false);
              await connectCoinbaseWallet();
            }}
            style={{ width: '100%', color: '#fff', fontSize: '24px' }}
          >
            <RowFlex>
              Coinbase Wallet <img src={require('./assets/images/coinbase.png')} alt="Coinbase" />
            </RowFlex>
          </ButtonWithBg>
        </Modal>
      )}
    </Wrapper>
  );
};

// ===== Стили ===== //

const Row = styled.div`
  display: flex;
  width: 100%;
  max-width: 1376px;
  padding: 20px 0;
  margin: 0 auto;
  gap: 20px;
  justify-content: center;
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const Column = styled.div`
  width: 60%;
  &:nth-child(2) {
    width: 40%;
    @media (max-width: 1024px) {
      width: 100%;
    }
  }
  @media (max-width: 1024px) {
    width: 100%;
  }
`;

// CardWra из GitHub (прокрутка, min-width 1024px)
const CardWra = styled.div`
  width: 100%;
  min-width: 1024px;
  position: relative;
  z-index: 1;
  @media (max-width: 1024px) {
    min-width: 100%;
  }
  overflow-x: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Cards = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1376px;
  margin: 30px auto 30px;
  gap: 20px;
  min-width: 1024px;
  flex-wrap: nowrap;
  padding: 0 16px;
`;

const Card = styled.div`
  width: 25%;
  height: 134px;
  background-color: #ffffff;
  border-radius: 24px;
  border: 1px solid #000000;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const StakeRow = styled.div`
  display: flex;
  width: 100%;
  max-width: 1376px;
  margin: 0 auto;
  padding: 30px 0;
  gap: 20px;
  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const StakeCol = styled.div`
  width: 33.3%;
  display: flex;
  justify-content: center;
  @media (max-width: 1024px) {
    width: 100%;
  }
`;

export const RowStaking = styled.div`
  display: flex;
  width: 100%;
  max-width: 1376px;
  margin: 0 auto;
  gap: 32px;
  justify-content: center;
  align-items: stretch;
  @media (max-width: 1024px) {
    flex-direction: column-reverse;
    height: auto;
  }
`;
export const Socials = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
  margin-top: 20px;
  @media (max-width: 1024px) {
    flex-direction: row;
    justify-content: center;
     gap: 8px;
  }
`;
export const RowStakingQ = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

export const ColStaking = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 32px;
`;

export const Block = styled.div`
  padding: 40px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #ffffff;
  border-radius: 24px;
  border: 1px solid #000000;
  box-shadow: 0px 3px 0px 0px rgba(0, 0, 0, 1);
  flex: 1;
`;

export const TextBorder = styled.span`
  text-shadow:
    rgb(0,0,0) 3px 0px 0px,
    rgb(0,0,0) 2.83487px 0.981584px 0px,
    rgb(0,0,0) 2.35766px 1.85511px 0px,
    rgb(0,0,0) 1.62091px 2.52441px 0px,
    rgb(0,0,0) 0.705713px 2.91581px 0px,
    rgb(0,0,0) -0.287171px 2.98622px 0px,
    rgb(0,0,0) -1.24844px 2.72789px 0px,
    rgb(0,0,0) -2.07227px 2.16926px 0px,
    rgb(0,0,0) -2.66798px 1.37182px 0px,
    rgb(0,0,0) -2.96998px 0.42336px 0px,
    rgb(0,0,0) -2.94502px -0.571704px 0px,
    rgb(0,0,0) -2.59586px -1.50383px 0px,
    rgb(0,0,0) -1.96093px -2.27041px 0px,
    rgb(0,0,0) -1.11013px -2.78704px 0px,
    rgb(0,0,0) -0.137119px -2.99686px 0px,
    rgb(0,0,0) 0.850987px -2.87677px 0px,
    rgb(0,0,0) 1.74541px -2.43999px 0px,
    rgb(0,0,0) 2.44769px -1.73459px 0px,
    rgb(0,0,0) 2.88051px -0.838247px 0px;
`;

const RowFlex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 8px;
`;
