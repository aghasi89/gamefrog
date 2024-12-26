import React, { useContext, useEffect, useState } from 'react';
import { Header } from './components/header';
import {
    Btn,
    Container,
    FinalBlock,
    FinalCol,
    FinalForm,
    FinalFormBtn,
    FinalFormFooter,
    FinalFormInput,
    FinalFormLink,
    FinalFormTextarea,
    FinalRow,
    InfoButton,
    LabelFrog,
    ModalTitle,
    MoveText,
    SecondTitle,
    SecondTitleInStaking,
    Social,
    SocialBtnS,
    Text16,
    Text24,
    Text32,
    Text48,
    Title,
    Wrapper
} from './styled';
import { useWindowSize } from './hooks';
import { calculateNewHeight } from './App';
import { Calculate } from './components/calculate';
import styled from 'styled-components';
import { StakeForm } from './components/stakeForm';
import SuccessStakedImage from './assets/images/success_staked_modal.png';
// ======= ВАЖНО: Импортируем контекст, где у нас есть { walletAddress, provider, stakingContract } =======
import { Web3Context } from './App';
import stakingAbi from './abi/stakingABI.json';
import { Contract } from 'ethers';
import Modal from './components/modal/Modal';
import { Cloud, CloudContainer } from './assets/cloud';
const walletBg = require('./assets/images/btn-wallet.png');

const bgPage = require('./assets/images/staking-bg.png');
const bgPageMob = require('./assets/images/coins-bg.png');
const chartBg = require('./assets/images/chart.png');
const label = require('./assets/images/label.png');
const social = require('./assets/images/social-block.png');
const socialX = require('./assets/images/x_text.png');
const socialTG = require('./assets/images/telegram_text.png');
const finalForm = require('./assets/images/final-form.png');
const finalFormMob = require('./assets/images/final-form-mob.png');
const logoText = require('./assets/images/logo_staking.png');

const bar = [
    '$ 24,243,122.89',
    '$ 24,243,122.89',
    '$ 24,243,122.89',
    '$ 24,243,122.89',
    '$ 24,243,122.89',
    '$ 24,243,122.89',
    '$ 24,243,122.89',
    '$ 24,243,122.89',
    '$ 24,243,122.89',
    '$ 24,243,122.89',
    '$ 24,243,122.89',
    '$ 24,243,122.89',
];

const card = [
    { text: 'Total Staked', sum: '999,999.99' },
    { text: 'Available to Stake', sum: '999,999.99' },
    { text: 'APY', sum: '40%' },
    { text: 'APR', sum: '40%' },
];

export const Staking = () => {
    const { width } = useWindowSize();
    const isDesktop = width >= 1024;

    // ======= Достаем из контекста нужные данные =======
    const { walletAddress, provider, stakingContract } = useContext(Web3Context);

    // ======= Пример стейта для данных, приходящих из контракта =======
    const [totalStaked, setTotalStaked] = useState<string>('0');
    const [availableToStake, setAvailableToStake] = useState<string>('0');
    const [apy, setApy] = useState<string>('40%'); // Можете считать реальный APY
    const [apr, setApr] = useState<string>('40%');
    const [isOpenModal, setIsOpenModal] = useState<boolean>(true);

    // ======= Пример useEffect для загрузки данных из контракта =======
    useEffect(() => {
        fetchStakingData();
    }, [walletAddress, stakingContract]);

    const fetchStakingData = async () => {
        if (!stakingContract) return;
        try {
            const staked = await stakingContract.totalStaked();
            setTotalStaked(staked.toString());

            if (walletAddress) {
                const userBalance = await stakingContract.balanceOf(walletAddress);
                setAvailableToStake(userBalance.toString());
            }

        } catch (err) {
            console.error('Error fetching staking data:', err);
        }
    };

    const handleStake = async (amount: string) => {
        if (!provider || !stakingContract || !walletAddress) {
            alert('Connect wallet first');
            return;
        }
        try {
            const signer = await provider.getSigner(); // Ждем разрешения промиса
            const contract = new Contract((stakingContract as any).address, stakingAbi, signer);
            const tx = await contract.stake(amount);
            await tx.wait();
            alert('Staked successfully');
            fetchStakingData();
        } catch (err) {
            console.error('Error staking:', err);
        }
    };

    const handleClaim = async () => {
        if (!provider || !stakingContract) {
            alert('Connect wallet first');
            return;
        }
        try {
            const signer = await provider.getSigner(); // Ждем разрешения промиса
            const contract = new Contract((stakingContract as any).address, stakingAbi, signer);
            const tx = await contract.claimReward();
            await tx.wait();
            alert('Claimed successfully');
            fetchStakingData();
        } catch (err) {
            console.error('Error claiming:', err);
        }
    };

    const handleUnstake = async (amount: string) => {
        if (!provider || !stakingContract) {
            alert('Connect wallet first');
            return;
        }
        try {
            const signer = await provider.getSigner(); // Ждем разрешения промиса
            const contract = new Contract((stakingContract as any).address, stakingAbi, signer);
            const tx = await contract.withdraw(amount);
            await tx.wait();
            alert('Unstaked successfully');
            fetchStakingData();
        } catch (err) {
            console.error('Error unstaking:', err);
        }
    };

    const clouds = [
        { top: 0, delay: 0, duration: 30 },
        { top: 20, delay: 0, duration: 50 },
        { top: 180, delay: 0, duration: 30 },
        { top: 220, delay: 0, duration: 40 },
        { top: 80, delay: 0, duration: 80 },
        { top: 240, delay: 0, duration: 20 },
    ];
    return (
        <Wrapper style={{ background: "linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(104,114,227,1) 74%, rgba(164,124,245,1) 100%)" }}>
            <Container
                isPadding={true}
                imageUrl={isDesktop ? bgPage : bgPageMob}
                height={isDesktop ? calculateNewHeight(2340, width) : 3636}
                style={!isDesktop ? { backgroundPositionY: 'bottom' } : { backgroundPositionY: 'top' }}
            >
                <Header />
                {!isDesktop && <CloudContainer>
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
                </CloudContainer>}
                <Row style={{ margin: '40px auto' }}>
                    <SecondTitleInStaking style={{ justifyContent: 'center' }}>
                        {isDesktop ? <span>Welcome to the
                            <MoveText delay={0} duration={0.6} bgColor={'#20C954'} size={isDesktop ? 28 : 16}>Gamefrog</MoveText><br />
                            <MoveText delay={0} duration={1} bgColor={'#C92064'} color='#FFF' size={isDesktop ? 28 : 16}>Staking</MoveText>
                            experience
                        </span> : <span>Welcome to the<br></br>
                            <div style={{ display: "flex" }}>
                                <MoveText delay={0} duration={0.6} bgColor={'#20C954'} size={isDesktop ? 28 : 16}>Gamefrog</MoveText><br />
                                <MoveText delay={0} duration={1} bgColor={'#C92064'} color='#FFF' size={isDesktop ? 28 : 16}>Staking</MoveText>
                            </div>
                            experience
                        </span>}
                    </SecondTitleInStaking>
                </Row>
                <CardWra>
                    <Cards>
                        <Card>
                            <Text16 center={true}>Total Staked</Text16>
                            <Text32 center={true}>{totalStaked}</Text32>
                        </Card>
                        <Card>
                            <Text16 center={true}>Available to Stake</Text16>
                            <Text32 center={true}>{availableToStake}</Text32>
                        </Card>
                        <Card>
                            <Text16 center={true}>APY</Text16>
                            <Text32 center={true}>{apy}</Text32>
                        </Card>
                        <Card>
                            <Text16 center={true}>APR</Text16>
                            <Text32 center={true}>{apr}</Text32>
                        </Card>
                    </Cards>
                </CardWra>
                <StakeRow>
                    <StakeCol>
                        <StakeForm
                            title={'Stake'}
                            text={'Currently staked:'}
                            value={totalStaked}
                            buttonText={'STAKE'}
                            onAction={(amount: string) => handleStake(amount)}
                        />
                    </StakeCol>
                    <StakeCol>
                        <StakeForm
                            title={'CLAIM'}
                            text={'Available Rewards'}
                            value={'0'}
                            buttonText={'CLAIM'}
                            onAction={() => handleClaim()}
                        />
                    </StakeCol>
                    <StakeCol>
                        <StakeForm
                            title={'UNSTAKE'}
                            text={'Available to Unstake'}
                            value={'0'}
                            buttonText={'UNSTAKE'}
                            onAction={(amount: string) => handleUnstake(amount)}
                        />
                    </StakeCol>
                </StakeRow>
                <Row>
                    <Text32 color={'#ffffff'}>Total supply</Text32>
                </Row>
                <Row style={{ justifyContent: 'center', marginBottom: '60px' }}>
                    <Column>
                        <Calculate column={true} />
                    </Column>
                </Row>
                <RowStaking>
                    <ColStaking style={{ flex: 1 }}>
                        <Block style={{ justifyContent: "center", alignItems: "center" }}><img src={logoText} style={{ width: "250px" }} /></Block>
                        <Block>
                            <Text48 center={true}>Join the</Text48>
                            <Text48 center={true} color='#20C954'><TextBorder>GAMEFROG</TextBorder></Text48>
                            <Text48 center={true}>Community</Text48>
                            <Text24 center={true}>Stay connected with our global movement:</Text24>
                            <RowStaking style={{ height: "auto" }}>
                                <div>
                                    <Text16 center={true}>Latest news and memes</Text16>
                                    <Btn style={{ width: "160px", maxWidth: "160px" }} bgImg={socialX} />
                                </div>
                                <div>
                                    <Text16 center={true}>Instant community support</Text16>
                                    <Btn style={{ width: "183px", maxWidth: "183px" }} bgImg={socialTG} />
                                </div>
                            </RowStaking>
                        </Block>
                    </ColStaking>
                    <Block style={isDesktop ? { flexGrow: 0, width: '550px', minWidth: "550px" } : {}}>
                        <Text48 center={true}>Have</Text48>
                        <Text48 center={true}>Questions?</Text48>
                        <Text48 center={true} color='#FC743A'><TextBorder>Get in Touch</TextBorder></Text48>
                        <FinalForm>
                            <FinalFormInput placeholder={'Name:'} />
                            <FinalFormInput placeholder={'Email:'} />
                            <FinalFormTextarea placeholder={'Message:'} />
                            <FinalFormFooter>
                                <FinalFormLink href={'mailto:support@gamefrog.io'}>support@gamefrog.io</FinalFormLink>
                                <FinalFormBtn>Send</FinalFormBtn>
                            </FinalFormFooter>
                        </FinalForm>
                    </Block>
                </RowStaking>

            </Container>
            {isOpenModal && <Modal onClose={() => {
                setIsOpenModal(false);
            }}>
                <img height={179} src={SuccessStakedImage} />
                <ModalTitle color="#20C954">Successfully STAKED</ModalTitle>
                <InfoButton
                    imageUrl={walletBg}
                    style={{ textTransform: 'none', marginTop: '30px' }}
                    onClick={() => {
                    }
                    }
                >
                    <Text24>TRY AGAIN</Text24>
                </InfoButton>

            </Modal>}
        </Wrapper>
    );
};

const RowStaking = styled.div`
  display: flex;
  width: 100%;
  max-width: 1376px;
  margin: 0 auto;
  gap: 32px;
  justify-content: center;
  item-align: stretch;
  height: 700px;
  @media (max-width: 1024px) {
    flex-direction: column-reverse;
    height: auto;
  }
`;
const ColStaking = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 32px;
    `;
const Block = styled.div`
    padding: 40px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    item-align: center;
    background-color: #ffffff;
    border-radius: 24px;
    border: 1px solid #000000;
      -webkit-box-shadow: 0px 3px 0px 0px rgba(0,0,0,1);
  -moz-box-shadow: 0px 3px 0px 0px rgba(0,0,0,1);
  box-shadow: 0px 3px 0px 0px rgba(0,0,0,1);
      flex:1

    `;
const TextBorder = styled.span`
    text-shadow: rgb(0,0,0) 3px 0px 0px, rgb(0,0,0) 2.83487px 0.981584px 0px, rgb(0,0,0) 2.35766px 1.85511px 0px, rgb(0,0,0) 1.62091px 2.52441px 0px, rgb(0,0,0) 0.705713px 2.91581px 0px, rgb(0,0,0) -0.287171px 2.98622px 0px, rgb(0,0,0) -1.24844px 2.72789px 0px, rgb(0,0,0) -2.07227px 2.16926px 0px, rgb(0,0,0) -2.66798px 1.37182px 0px, rgb(0,0,0) -2.96998px 0.42336px 0px, rgb(0,0,0) -2.94502px -0.571704px 0px, rgb(0,0,0) -2.59586px -1.50383px 0px, rgb(0,0,0) -1.96093px -2.27041px 0px, rgb(0,0,0) -1.11013px -2.78704px 0px, rgb(0,0,0) -0.137119px -2.99686px 0px, rgb(0,0,0) 0.850987px -2.87677px 0px, rgb(0,0,0) 1.74541px -2.43999px 0px, rgb(0,0,0) 2.44769px -1.73459px 0px, rgb(0,0,0) 2.88051px -0.838247px 0px;
    `;

const Row = styled.div`
  display: flex;
  width: 100%;
  max-width: 1376px;
  padding: 20px 0;
  margin: 0 auto;
  gap: 20px;
  justify-content: center
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

const Chart = styled.div<{ imageUrl: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${({ imageUrl }) => imageUrl});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  position: relative;
  border-radius: 24px;
  overflow: hidden;
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
