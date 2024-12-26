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
    Social,
    SocialBtnS,
    Text16,
    Text24,
    Text32,
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
const walletBg = require('./assets/images/btn-wallet.png');

const bgPage = require('./assets/images/staking-bg.png');
const bgPageMob = require('./assets/images/staking-bg-mob.png');
const chartBg = require('./assets/images/chart.png');
const label = require('./assets/images/label.png');
const social = require('./assets/images/social-block.png');
const socialX = require('./assets/images/social-X.png');
const socialTG = require('./assets/images/social-TG.png');
const finalForm = require('./assets/images/final-form.png');
const finalFormMob = require('./assets/images/final-form-mob.png');

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


    return (
        <Wrapper>
            <Container
                isPadding={true}
                imageUrl={isDesktop ? bgPage : bgPageMob}
                height={isDesktop ? calculateNewHeight(2340, width) : 3636}
                style={!isDesktop ? { backgroundSize: '100% 100%' } : {}}
            >
                <Header />
                <Row style={{ margin: '40px auto' }}>
                    <SecondTitle style={{ justifyContent: 'center' }}>
                        <span>Welcome to the
                            <MoveText delay={0} duration={0.6} bgColor={'#20C954'}>Gamefrog</MoveText><br />
                            <MoveText delay={0} duration={1} bgColor={'#C92064'}>Staking</MoveText>
                            experience
                        </span>
                    </SecondTitle>
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
                <Row>
                    <Column>
                        <Chart imageUrl={chartBg} />
                    </Column>
                    <Column>
                        <Calculate column={true} />
                    </Column>
                </Row>
                <FinalRow>
                    <FinalCol>
                        <LabelFrog>
                            <img src={label} alt={'label frog'} />
                        </LabelFrog>
                        <Social style={{ marginTop: isDesktop ? '25px' : '0', marginBottom: !isDesktop ? '25px' : '0' }}>
                            <img src={social} alt={'label frog'} />
                            <SocialBtnS>
                                <div>
                                    <Text16 center={true}>Latest news and memes</Text16>
                                    <Btn bgImg={socialX} />
                                </div>
                                <div>
                                    <Text16 center={true}>Instant community support</Text16>
                                    <Btn bgImg={socialTG} />
                                </div>
                            </SocialBtnS>
                        </Social>
                    </FinalCol>
                    <FinalCol>
                        <FinalBlock bgImg={isDesktop ? finalForm : finalFormMob}>
                            <FinalForm>
                                <FinalFormInput placeholder={'Name:'} />
                                <FinalFormInput placeholder={'Email:'} />
                                <FinalFormTextarea placeholder={'Message:'} />
                                <FinalFormFooter>
                                    <FinalFormLink href={'mailto:support@gamefrog.io'}>support@gamefrog.io</FinalFormLink>
                                    <FinalFormBtn>Send</FinalFormBtn>
                                </FinalFormFooter>
                            </FinalForm>
                        </FinalBlock>
                    </FinalCol>
                </FinalRow>
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

const Row = styled.div`
  display: flex;
  width: 100%;
  max-width: 1376px;
  padding: 20px 0;
  margin: 0 auto;
  gap: 20px;

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
  overflow: scroll;
`;

const Cards = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1376px;
  margin: 30px auto 0;
  gap: 20px;
  width: 1376px;
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
