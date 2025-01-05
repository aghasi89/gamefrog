import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { parseUnits, formatUnits } from 'ethers';

import { Header } from './components/header';
import { StakeForm } from './components/stakeForm';
import { Calculate } from './components/calculate';
import Modal from './components/modal/Modal';

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
} from './styled';

import { useWindowSize } from './hooks';
import { calculateNewHeight } from './App';
import { Cloud, CloudContainer } from './assets/cloud';

import { Web3Context } from './WebProvider';

import SuccessStakedImage from './assets/images/success_staked_modal.png';
const walletBg = require('./assets/images/btn-wallet.png');
const bgPage = require('./assets/images/staking-bg.png');
const bgPageMob = require('./assets/images/coins-bg.png');
const socialX = require('./assets/images/x.png');
const socialTG = require('./assets/images/telegram.png');
const socialXText = require('./assets/images/x_text.png');
const socialTGText = require('./assets/images/telegram_text.png');
const logoText = require('./assets/images/logo_staking.png');

// Общая сумма выделенная на пул (345,000,000 * 10^18)
const STAKING_POOL_ALLOCATION = parseUnits('345000000', 18);

export const Staking = () => {
  const { width } = useWindowSize();
  const isDesktop = width >= 1024;

  const {
    walletAddress,
    provider,
    stakingContract,
    presaleContract,
  } = useContext(Web3Context);

  // Показывает, закончился ли пресейл
  const [isPresaleEnded, setIsPresaleEnded] = useState<boolean>(false);

  // Для карточек: totalStaked (всего в пуле), poolRemaining (сколько ещё осталось)
  const [totalStaked, setTotalStaked] = useState<string>('0.0');
  const [poolRemaining, setPoolRemaining] = useState<string>('0.0');

  // APY/APR (пока захардкожены)
  const [apy, setApy] = useState<string>('40%');
  const [apr, setApr] = useState<string>('40%');

  // Модалка: "Successfully Staked!"
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  // **Показываем**, сколько пользователь уже застейкал (в stakingContract.stakers[user].amount)
  const [userStaked, setUserStaked] = useState<string>('0.0');

  // Подсчёт прибыли (40%) при вводе суммы (например, 1000 => 400.0)
  const [calcProfit, setCalcProfit] = useState<string>('0.0');

  // Облака (анимация для мобилки)
  const clouds = [
    { top: 0, delay: 0, duration: 30 },
    { top: 20, delay: 0, duration: 50 },
    { top: 180, delay: 0, duration: 30 },
    { top: 220, delay: 0, duration: 40 },
    { top: 80, delay: 0, duration: 80 },
    { top: 240, delay: 0, duration: 20 },
  ];

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

  // Запрашиваем данные из stakingContract
  const fetchStakingData = async () => {
    if (!stakingContract) return;
    try {
      // 1) totalStaked (getTotalStaked) -> bigint
      const rawStaked: bigint = await stakingContract.getTotalStaked();

      // округлим до 1 знака
      const stakedFloat = parseFloat(formatUnits(rawStaked, 18)).toFixed(1);
      setTotalStaked(stakedFloat);

      // 2) poolRemaining = 345e6 - totalStaked
      const remain = STAKING_POOL_ALLOCATION - rawStaked;
      const remainFloat = parseFloat(formatUnits(remain, 18)).toFixed(1);
      setPoolRemaining(remainFloat);

      // 3) userStaked - сколько застейкал текущий пользователь
      if (walletAddress) {
        const stakerInfo = await stakingContract.stakers(walletAddress);
        // stakerInfo.amount -> bigint
        const rawUserStaked = stakerInfo.amount;
        const userFloat = parseFloat(formatUnits(rawUserStaked, 18)).toFixed(1);
        setUserStaked(userFloat);
      }

    } catch (err) {
      console.error('Error fetching staking data:', err);
    }
  };

  // ============================= STAKE ==========================
  const handleStake = async (amount: string) => {
    if (!provider || !walletAddress) {
      alert('Connect wallet first');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const signer = await provider.getSigner();

      if (!isPresaleEnded) {
        // Пресейл активен => stakeFromPending
        if (!presaleContract) {
          alert('Presale contract not found');
          return;
        }
        const presale = presaleContract.connect(signer);
        const tx = await presale.stakeFromPending(parseUnits(amount, 18));
        await tx.wait();

        alert(`Staked ${amount} from pending successfully!`);
        setIsOpenModal(true);

      } else {
        // Пресейл завершён => stakingContract.stake
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

      // Обновим данные
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
    if (!provider || !stakingContract) {
      alert('Connect wallet first');
      return;
    }
    try {
      const signer = await provider.getSigner();
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
    if (!provider || !stakingContract) {
      alert('Connect wallet first');
      return;
    }
    if (!amount || Number(amount) <= 0) {
      alert('Enter a valid amount');
      return;
    }
    try {
      const signer = await provider.getSigner();
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

  // При вводе суммы в STAKE → считаем 40%
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
        style={!isDesktop ? { backgroundPositionY: 'bottom' } : { backgroundPositionY: 'top' }}
      >
        <Header />

        {/* Анимация облаков на мобилке */}
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
                    d="M239.111 44.6661C239.111 32.9811 223.866 23.5085 205.06 23.5085C..."
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
                <div style={{ display: 'flex' }}>
                  <MoveText delay={0} duration={0.6} bgColor="#20C954" size={isDesktop ? 28 : 16}>
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
            {/* totalStaked */}
            <Card>
              <Text16 center={true}>Total Staked</Text16>
              <Text32 center={true}>{totalStaked}</Text32>
            </Card>

            {/* poolRemaining */}
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
        <br />
        <StakeRow>
          {/* STAKE */}
          <StakeCol><br />
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
                //disabled
              />
            </StakeCol>
          )}
        </StakeRow>

        <Row>
          <Text32 color="#ffffff">Total supply</Text32>
        </Row>
        <Row style={{ justifyContent: 'center', marginBottom: '60px' }}>
          <Column>
            <Calculate column={true} />
          </Column>
        </Row>

        <RowStaking>
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
              <RowStaking style={{ height: 'auto',flexDirection: 'row' }}>
              <div>
                  {isDesktop && <Text16 center={true}>Latest news and memes</Text16>}
                  <Btn style={{ width: isDesktop?'160px':"64px", maxWidth: isDesktop?'160px':'64px' }}  bgImg={isDesktop?socialXText:socialX}/>
                </div>
                <div>
                  {isDesktop && <Text16 center={true}>Instant community support</Text16>}
                  <Btn style={{ width: isDesktop?'183px':"64px", maxWidth: isDesktop?'183px':'64px' }} bgImg={isDesktop?socialTGText:socialTG} />
                </div>
              </RowStaking>
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

      {/* Модалка "Successfully STAKED" */}
      {isOpenModal && (
        <Modal onClose={() => setIsOpenModal(false)}>
          <img height={179} src={SuccessStakedImage} alt="success" />
          <ModalTitle color="#20C954">Successfully STAKED</ModalTitle>
          <InfoButton
            bgColor='#20C954'
            style={{ textTransform: 'none', marginTop: '30px' }}
            onClick={() => setIsOpenModal(false)}
          >
            <Text24>OK</Text24>
          </InfoButton>
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

const CardWra = styled.div`
  width: 100%;
  min-width: 1024px;
`;

const Cards = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1376px;
  margin: 30px auto 0;
  gap: 20px;
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
  height: 700px;
  @media (max-width: 1024px) {
    flex-direction: column-reverse;
    height: auto;
  }
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

export  const TextBorder = styled.span`
    text-shadow: rgb(0,0,0) 3px 0px 0px, rgb(0,0,0) 2.83487px 0.981584px 0px, rgb(0,0,0) 2.35766px 1.85511px 0px, rgb(0,0,0) 1.62091px 2.52441px 0px, rgb(0,0,0) 0.705713px 2.91581px 0px, rgb(0,0,0) -0.287171px 2.98622px 0px, rgb(0,0,0) -1.24844px 2.72789px 0px, rgb(0,0,0) -2.07227px 2.16926px 0px, rgb(0,0,0) -2.66798px 1.37182px 0px, rgb(0,0,0) -2.96998px 0.42336px 0px, rgb(0,0,0) -2.94502px -0.571704px 0px, rgb(0,0,0) -2.59586px -1.50383px 0px, rgb(0,0,0) -1.96093px -2.27041px 0px, rgb(0,0,0) -1.11013px -2.78704px 0px, rgb(0,0,0) -0.137119px -2.99686px 0px, rgb(0,0,0) 0.850987px -2.87677px 0px, rgb(0,0,0) 1.74541px -2.43999px 0px, rgb(0,0,0) 2.44769px -1.73459px 0px, rgb(0,0,0) 2.88051px -0.838247px 0px;
    `;

