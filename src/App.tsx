import React from 'react';
import styled from 'styled-components';

// Локальные хуки и компоненты
import { useWindowSize } from './hooks';
import { Header } from './components/header';
import { Form } from './components/form'; // ← Важно: именно ваша форма
import RunText from './components/runText/RunText';
import { Collapse } from './components/collapse';
import { FaqData } from './config';
import { Calculate } from './components/calculate';

// Стили и утилиты
import {
  Btn,
  CardImgWrap,
  CardRow,
  CardVideo,
  CenterButton,
  Container,
  FaqCol,
  FaqRow,
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
  SecondTitle,
  SixTitle,
  Social,
  SocialBtnS,
  SubTitle,
  Text16,
  Text24,
  Title,
  TitleWrap,
  Wrapper,
  MoveText,
  Text14,
  Border,
  ButtonWithBg,
  Text20,
  Text16Span,
  Text48,
  Text32,
} from './styled';

import { Column, Row } from './utils';
import { StageIcon } from './assets/stages';
import { Cloud, CloudContainer } from './assets/cloud';

// Lottie-анимация
import Lottie from 'lottie-react';
import animationJson2 from './assets/video/Text2.json';
import animationJson from './assets/video/Text1.json';
import animationJsonInfoGraphic from './assets/video/Infographics.json';
import { Block, ColStaking, RowStaking, TextBorder } from './Staking';

// Изображения
const logoText = require('./assets/images/logo_staking.png');

const walletBg = require('./assets/images/btn-wallet.png');
const bg = require('./assets/images/first-bg.png');
const bgMob = require('./assets/images/first-bg-mob.png');
const bgSecond = require('./assets/images/second-bg.png');
const bgSecondMob = require('./assets/images/second-bg-mob.png');
const bgThird = require('./assets/images/third-bg.png');
const bgThirdMob = require('./assets/images/third-bg-mob.png');
const bgFourth = require('./assets/images/fourth-bg.png');
const bgFourthMob = require('./assets/images/fourth-bg-mob.png');
const bgFive = require('./assets/images/five-bg.png');
const bgFiveMob = require('./assets/images/five-bg-mob.png');
const bgSix = require('./assets/images/six-bg.png');
const bgSixMob = require('./assets/images/six-bg-mob.png');
const bgSeven = require('./assets/images/seven-bg.png');
const bgSevenMob = require('./assets/images/seven-bg-mob.png');
const bgNinth = require('./assets/images/ninth-bg.png');
const bgNinthMob = require('./assets/images/ninth-bg-mob.png');
const bgFaq = require('./assets/images/faq-bg.png');
const bgFaqMob = require('./assets/images/faq-bg-mob.png');
const bgFinal = require('./assets/images/final-bg.png');
const bgFinalMob = require('./assets/images/final-bg-mob.png');
const socialXText = require('./assets/images/x_text.png');
const socialTGText = require('./assets/images/telegram_text.png');
const socialX = require('./assets/images/x.png');
const socialTG = require('./assets/images/telegram.png');

const card1 = require('./assets/images/card1.png');
const card2 = require('./assets/images/card2.png');
const card3 = require('./assets/images/card3.png');
const card4 = require('./assets/images/card4.png');
const frogImage = require('./assets/images/frog.png');
const videoAndriod = require('./assets/video/Animation -vp9-chrome.webm');
const videoIos = require('./assets/video/Animation -hevc-safari.mp4');

// Функция для вычисления новой высоты в зависимости от ширины
export function calculateNewHeight(originalHeight: number, realWidth: number) {
  const originalWidth = 1440;
  if (originalWidth <= 0 || originalHeight <= 0 || realWidth <= 0) {
    throw new Error('All parameters must be positive.');
  }
  const aspectRatio = originalHeight / originalWidth;
  return Math.round(realWidth * aspectRatio);
}

export function App() {
  const { width } = useWindowSize();
  const isDesktop = width >= 1024;

  // Параметры для анимации облаков
  const clouds = [
    { top: 0, delay: 0, duration: 30 },
    { top: 20, delay: 0, duration: 50 },
    { top: 180, delay: 0, duration: 30 },
    { top: 220, delay: 0, duration: 40 },
    { top: 80, delay: 0, duration: 80 },
    { top: 240, delay: 0, duration: 20 },
  ];
  let videoArg = {};
  if(isDesktop){
    videoArg = {
      width
    }
    } else {
    videoArg = {
      height: 750
    }
    }
  return (
    <Wrapper>
      {/* Бегущая строка */}
      {!isDesktop && <Header />}
      <RunText text="This could be the very last 🚀 1000x opportunity in history—our 🤖 AI is making it happen! — This could be the very last 🚀 1000x opportunity in history—our 🤖 AI is making it happen!" />
      {isDesktop && <Header />}
      {/* Шапка */}
      

      {/* --- 1-й контейнер --- */}
      <Container
        imageUrl={isDesktop ? bg : bgMob}
        height={isDesktop ? (2142 * width) / 1440 : undefined}
        style={{ marginTop: isDesktop ? '-115px' : '-100px', backgroundPosition: 'top center'}}
      >
        {!isDesktop && <img src={frogImage} style={{ position: "absolute", top: (0.229 * width + 62.124) + 'px', left: "calc(50% - 160.5px)", width: "321px" }} />}
        <FinalRow
          style={{
            marginTop: isDesktop ? '30px' : (0.229 * width + 274.124) + 'px',
            flexDirection: isDesktop ? 'row' : 'column-reverse',
            alignItems: isDesktop ? 'start' : 'center',
          }}
        >
          <FinalCol  style={{marginTop: isDesktop ? '0' : '508px'}}>
            <FaqCard>
              <Border
                color="#E5E5E5"
                width={1}
                raduis={16}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', marginTop: '20px' }}
              >
                <Text24>🚀 Launch price: </Text24>
                <ButtonWithBg bgColor="#23BB52" textColor="#FFF">
                  $ 0.01
                </ButtonWithBg>
              </Border>
              <Border
                color="#E5E5E5"
                width={1}
                raduis={16}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', marginTop: '20px' }}
              >
                <Text24>💎 Staking rewards:</Text24>
                <ButtonWithBg bgColor="#C71C1C" textColor="#FFF">
                  1425%
                </ButtonWithBg>
              </Border>
              <Collapse
                btnText="How It Works?"
                text={
                  <Text16 color="var(--text-grey)" center={false}>
                    Presale participants lock in incredibly low entry prices ...
                  </Text16>
                }
              />
              <Collapse
                btnText="Stability Backed by Strategy"
                text={
                  <Text16 color="var(--text-grey)" center={false}>
                    Your investment isn’t left floating ...
                  </Text16>
                }
              />
              <Collapse
                btnText="Why Buy Now?"
                text={
                  <Text16 color="var(--text-grey)" center={false}>
                    • Unbeatable Entry: ...
                  </Text16>
                }
              />
              <Text16Span center={false} weight="400" color="#00000080">
                <Text16Span> Join the presale 🙌 💎</Text16Span>, hold tight, and let our{' '}
                <Text16Span>AI-empowered team—and</Text16Span> the mighty{' '}
                <Text16Span>Gamefrog Pepe</Text16Span> — carry your investment upwards. The earlier
                you jump in, the stronger <Text16Span>💪 your position</Text16Span> as we scale 🚀
                toward <Text16Span>unprecedented heights! 💯</Text16Span>
              </Text16Span>
            </FaqCard>
          </FinalCol>

          <FinalCol>
            {!isDesktop && <Block style={{ padding: "26px", marginBottom: "20px" }}>
              <Text32 color='#FFF' center={true}><TextBorder>$GMF TOKEN</TextBorder></Text32>
              <Text24 color='#FFF' center={true}><TextBorder>Crypto Presale</TextBorder></Text24>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text24 color='#000'>💎 Staking rewards: </Text24>
                <ButtonWithBg bgColor="#C71C1C" textColor="#FFF">
                  1591%
                </ButtonWithBg>
              </div>
            </Block>}
            {/* ВАЖНО: Форма теперь только UI, логика подключения Metamask/WalletConnect/Coinbase берётся из WebProvider */}
            <Form />
          </FinalCol>
        </FinalRow>

        {/* Фоновое видео */}
        <Video
          {...videoArg}
          controls={false}
          autoPlay
          muted
          loop
          style={{
            bottom: isDesktop ? (0.857 * width - 744.286) + 'px' : 'none',
            top: isDesktop ? 'none' : (0.208 * width + 952) + 'px',
            left: isDesktop ? '0' : (0.555 * width - 568.012) + 'px',
          }}
        >
          <source src={videoAndriod} type="video/webm" />
          <source src={videoIos} type="video/mp4" />
        </Video>

        {/* Lottie-анимации */}
        {isDesktop && <Lottie
          style={{
            width: width / (isDesktop ? 2.5 : 1.8) + 'px',
            position: 'absolute',
            bottom: isDesktop ? (0.902 * width - 808.571) + 'px' : 'none',
            top: isDesktop ? 'none' : (1.549 * width - 5.701) + 'px',
            left: isDesktop ? '25%' : '15%',
          }}
          animationData={animationJson2}
          loop={true}
        />}
        {isDesktop && <Lottie
          style={{
            width: width / (isDesktop ? 4 : 3) + 'px',
            position: 'absolute',
            bottom: isDesktop ? (0.804 * width - 657.143) + 'px' : 'none',
            top: isDesktop ? 'none' : (1.186 * width - 14.915) + 'px',
            left: isDesktop ? '0' : '3%',
          }}
          animationData={animationJson}
          loop={true}
        />}
      </Container>

      {/* --- 2-й контейнер --- */}
      <Container
        imageUrl={isDesktop ? bgSecond : bgSecondMob}
        height={isDesktop ? calculateNewHeight(1056, width) : (1010 * width) / 375 - 2}
        style={{ marginTop: isDesktop ? '0' : '80px' }}
      >
        <SecondTitle
          style={{
            justifyContent: 'center',
            flexDirection: isDesktop ? 'row' : 'column',
          }}
        >
          <span>Why Choose</span>
          <span>GAMEFROG?</span>
        </SecondTitle>
        <Row gap="5px">
          <Column direction="column" size={8} sizeSm={12}>
            {/* Ваш контент/блоки, тексты, иконки и т.д. */}
          </Column>
          {isDesktop ? (
            <Column alignCenter={true} size={4} sizeSm={12}>
              <Form />
            </Column>
          ) : null}
        </Row>
      </Container>

      {/* --- 3-й контейнер --- */}
      <Container
        imageUrl={isDesktop ? bgThird : bgThirdMob}
        style={{ backgroundPositionY: isDesktop ? 'top' : 'bottom' }}
        height={isDesktop ? calculateNewHeight(1413, width) : (872 * width) / 375 - 2}
      >
        <SecondTitle column={true}>
          <span>Join The presale:</span>
          <span>limited time, big 🤟😎 rewards!</span>
        </SecondTitle>
        <CenterButton top={isDesktop ? 170 : 32}>
          {isDesktop ? (
            <InfoButton imageUrl={walletBg} style={{ textTransform: 'none' }} onClick={() => { }}>
              Secure Your Tokens Now
              <svg
                style={{ marginLeft: '10px' }}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.19 0H5.81C2.17 0 0 2.17 0 5.81V14.18C0 17.83 2.17 20 5.81 20H14.18C17.82 20 19.99 17.83 19.99 14.19V5.81C20 2.17 17.83 0 14.19 0ZM16.53 10.53L12.24 14.82C12.09 14.97 11.9 15.04 11.71 15.04C11.52 15.04 11.33 14.97 11.18 14.82C10.89 14.53 10.89 14.05 11.18 13.76L14.19 10.75H4C3.59 10.75 3.25 10.41 3.25 10C3.25 9.59 3.59 9.25 4 9.25H14.19L11.18 6.24C10.89 5.95 10.89 5.47 11.18 5.18C11.47 4.89 11.95 4.89 12.24 5.18L16.53 9.47C16.67 9.61 16.75 9.8 16.75 10C16.75 10.2 16.67 10.39 16.53 10.53Z"
                  fill="black"
                />
              </svg>
            </InfoButton>
          ) : (
            <InfoButton
              imageUrl={walletBg}
              width={width * 0.95}
              style={{ color: '#000' }}
              onClick={() => { }}
            >
              Secure Your Tokens Now
              <svg
                style={{ marginLeft: '10px' }}
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.19 0H5.81C2.17 0 0 2.17 0 5.81V14.18C0 17.83 2.17 20 5.81 20H14.18C17.82 20 19.99 17.83 19.99 14.19V5.81C20 2.17 17.83 0 14.19 0ZM16.53 10.53L12.24 14.82C12.09 14.97 11.9 15.04 11.71 15.04C11.52 15.04 11.33 14.97 11.18 14.82C10.89 14.53 10.89 14.05 11.18 13.76L14.19 10.75H4C3.59 10.75 3.25 10.41 3.25 10C3.25 9.59 3.59 9.25 4 9.25H14.19L11.18 6.24C10.89 5.95 10.89 5.47 11.18 5.18C11.47 4.89 11.95 4.89 12.24 5.18L16.53 9.47C16.67 9.61 16.75 9.8 16.75 10C16.75 10.2 16.67 10.39 16.53 10.53Z"
                  fill="black"
                />
              </svg>
            </InfoButton>
          )}
        </CenterButton>
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

        <StageIcon index={0} style={{ transform: 'scale(1.5)' }} />
      </Container>

      {/* --- 4-й контейнер --- */}
      <Container imageUrl={isDesktop ? bgFourth : bgFourthMob} height={isDesktop ? calculateNewHeight(1762, width) : (1618 * width) / 375 - 2}>
        <SecondTitle
          column={true}
          style={{ marginBottom: isDesktop ? '60px' : '30px', marginTop: isDesktop ? '60px' : '30px' }}
        >
          <span>Our mission:</span>
          <span>Financial freedom for all</span>
        </SecondTitle>
        {isDesktop ? (
          <Text24 center={true} color="#FFF" weight="400" style={{ width: '80%', maxWidth: '705px', margin: '0 auto', letterSpacing: '0.5px' }}>
            <MoveText delay={0} duration={1} bgColor="#20C954" amplitude={2}>
              Gamefrog
            </MoveText>{' '}
            is more than a token — it’s a movement inspired by the{' '}
            <MoveText delay={0.2} duration={1.1} bgColor="#FFB949" amplitude={2}>
              Resilience
            </MoveText>{' '}
            of everyday people. Our goal is to create a decentralized financial system that{' '}
            <MoveText delay={0.3} duration={1.2} bgColor="#F66D3B" amplitude={3}>
              Empowers
            </MoveText>{' '}
            everyone, regardless of background or resources
          </Text24>
        ) : (
          <Text20 center={true} color="#FFF" weight="400" style={{ width: '80%', maxWidth: '705px', margin: '0 auto', letterSpacing: '0.5px' }}>
            <MoveText delay={0} duration={1} bgColor="#20C954" amplitude={2} size={12}>
              Gamefrog
            </MoveText>{' '}
            is more than a token — it’s a movement inspired by the{' '}
            <MoveText delay={0.2} duration={1.1} bgColor="#FFB949" amplitude={2} size={12}>
              Resilience
            </MoveText>{' '}
            of everyday people. Our goal is to create a decentralized financial system that{' '}
            <MoveText delay={0.3} duration={1.2} bgColor="#F66D3B" amplitude={3} size={12}>
              Empowers
            </MoveText>{' '}
            everyone, regardless of background or resources
          </Text20>
        )}
      </Container>

      {/* --- 5-й контейнер --- */}
      <Container
        imageUrl={isDesktop ? bgFive : bgFiveMob}
        height={isDesktop ? calculateNewHeight(1125, width) : (972 * width) / 375 - 2}
        style={{
          backgroundPositionY: isDesktop ? 'bottom' : 'bottom',
          height: isDesktop ? calculateNewHeight(1125, width) + 'px' : 'fit-content',
          paddingBottom: isDesktop ? '0' : (430 * width) / 375 + 'px',
        }}
      >
        <SecondTitle
          column={false}
          style={{ marginBottom: '10px', justifyContent: 'center', flexWrap: 'wrap', gap: '7px', marginTop: isDesktop ? '60px' : '30px' }}
        >
          <span>Why</span>
          <span>Gamefrog</span>
          <span>Matters</span>
        </SecondTitle>
        <Text16 weight="400" center={true} color="#FFF" style={{ width: '80%', maxWidth: '705px', margin: '0 auto', letterSpacing: '0.5px' }}>
          The “David vs. Goliath” inspiration behind{' '}
          <MoveText delay={0} duration={1} bgColor="#20C954" amplitude={2} size={12}>
            Gamefrog
          </MoveText>{' '}
          stems from the idea of{' '}
          <MoveText delay={0} duration={1} bgColor="#953BF6" amplitude={2} size={12} color="#FFF">
            💪 EmpowerING
          </MoveText>{' '}
          everyday{' '}
          <MoveText delay={0} duration={1} bgColor="#3B8CF6" amplitude={2} size={12} color="#FFF">
            Individuals
          </MoveText>{' '}
          to challenge and overcome the dominance of centralized financial systems and large
          institutions. Much like David’s resilience and resourcefulness in{' '}
          <MoveText delay={0} duration={1} bgColor="#4E4E4E" amplitude={2} size={12} color="#FFF">
            defeating 😤
          </MoveText>{' '}
          a seemingly{' '}
          <MoveText delay={0} duration={1} bgColor="#FF4949" amplitude={2} size={12} color="#FFF">
            INVINCIBLE OPPONENt 😱
          </MoveText>
          , GAMEFROG champions the power of decentralized finance (DeFi) to level the playing field,
          offering fair opportunities and financial{' '}
          <MoveText delay={0} duration={1} bgColor="#FFB949" amplitude={2} size={12}>
            Freedom
          </MoveText>{' '}
          to everyone, regardless of their background. By embracing this ethos, GAMEFROG symbolizes
          the collective strength of a united{' '}
          <MoveText delay={0} duration={1} bgColor="#B5DFF4" amplitude={2} size={12}>
            Community ✊
          </MoveText>{' '}
          challenging the status quo and rewriting the rules of finance.
        </Text16>
      </Container>

      {/* --- 6-й контейнер --- */}
      <Container
        imageUrl={isDesktop ? bgSix : bgSixMob}
        height={isDesktop ? calculateNewHeight(922, width) : (1837 * width) / 375 - 2}
        style={{
          height: 'fit-content',
          background: 'linear-gradient(0deg, rgba(245,166,124,1) 0%, rgba(255,102,102,1) 100%)',
        }}
      >
        <Row gap="5px">
          <Column direction="column" size={8} sizeSm={12}>
            <SixTitle>
              <span>hoW To participate</span>
              <span>in the presale</span>
            </SixTitle>
            <CardRow>
              <CardVideo>
                {isDesktop ? <Text24>1. Create a crypto wallet</Text24> : <Text20>1. Create a crypto wallet</Text20>}
                <CardImgWrap>
                  <img src={card1} alt="card1" />
                </CardImgWrap>
              </CardVideo>
              <CardVideo>
                {isDesktop ? <Text24>2. Fund your wallet with ETH/USDT</Text24> : <Text20>2. Fund your wallet with ETH/USDT</Text20>}
                <CardImgWrap>
                  <img src={card2} alt="card2" />
                </CardImgWrap>
              </CardVideo>
              <CardVideo>
                {isDesktop ? <Text24>3. Connect to the GAMEFROG</Text24> : <Text20>3. Connect to the GAMEFROG</Text20>}
                <CardImgWrap>
                  <img src={card3} alt="card3" />
                </CardImgWrap>
              </CardVideo>
              <CardVideo>
                {isDesktop ? <Text24>4. Buy GAMEFROG</Text24> : <Text20>4. Buy GAMEFROG</Text20>}
                <CardImgWrap>
                  <img src={card4} alt="card4" />
                </CardImgWrap>
              </CardVideo>
            </CardRow>
          </Column>
          <Column alignCenter={false} size={4} sizeSm={12}>
            <Form />
          </Column>
        </Row>
      </Container>

      {/* --- 7-й контейнер --- */}
      <Container
        imageUrl={isDesktop ? bgSeven : bgSevenMob}
        height={isDesktop ? calculateNewHeight(922, width) : (910 * width) / 375 - 2}
      >
        {isDesktop && <Lottie
          style={{ width: '75%', position: 'absolute', left: 0.093 * width - 9.714 + 'px', top: 0.222 * width - 14.143 + 'px' }}
          animationData={animationJsonInfoGraphic}
          loop={true}
        />}
      </Container>

      {/* --- 8-й контейнер --- */}
      <Container
        imageUrl={isDesktop ? bgNinth : bgNinthMob}
        height={isDesktop ? calculateNewHeight(1237, width) : (1388 * width) / 375 - 2}
      />

      {/* --- 9-й контейнер (FAQ) --- */}
      <Container
        imageUrl={isDesktop ? bgFaq : bgFaqMob}
        height={isDesktop ? calculateNewHeight(1050, width) : (1221 * width) / 375 - 2}
        style={{ backgroundSize: '100% 100%', height: 'auto', paddingBottom: '50px' }}
      >
        <FaqRow>
          <FaqCol>
            <SixTitle style={{ marginBottom: '30px' }}>
              <span>FAQ</span>
            </SixTitle>
            {FaqData.map((item, idx) => (
              <Collapse
                key={idx}
                btnText={item.btnText}
                text={
                  typeof item.text === 'string' ? (
                    <Text16 color="var(--text-grey)" center={false}>
                      {item.text}
                    </Text16>
                  ) : (
                    item.text.map((t, tIdx) => (
                      <Text16 key={tIdx} color="var(--text-grey)" center={false}>
                        {t}
                      </Text16>
                    ))
                  )
                }
              />
            ))}
          </FaqCol>
          <FaqCol style={{ marginTop: isDesktop ? '85px' : '0px' }}>
            <Calculate />
          </FaqCol>
        </FaqRow>
      </Container>

      {/* --- 10-й (финальный) контейнер --- */}
      <Container
        imageUrl={isDesktop ? bgFinal : bgFinalMob}
        height={isDesktop ? calculateNewHeight(979, width) : (1198 * width) / 375 - 2}
        style={
          !isDesktop
            ? {
              backgroundSize: '100% 100%',
              height: 'fit-content',
              backgroundPosition: 'bottom center',
              paddingBottom: '50px',
            }
            : {}
        }
      >
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
              <RowStaking style={{ height: 'auto', flexDirection: 'row' }}>
                <div>
                  {isDesktop && <Text16 center={true}>Latest news and memes</Text16>}
                  <Btn style={{ width: isDesktop ? '160px' : "64px", maxWidth: isDesktop ? '160px' : '64px' }} bgImg={isDesktop ? socialXText : socialX} />
                </div>
                <div>
                  {isDesktop && <Text16 center={true}>Instant community support</Text16>}
                  <Btn style={{ width: isDesktop ? '183px' : "64px", maxWidth: isDesktop ? '183px' : '64px' }} bgImg={isDesktop ? socialTGText : socialTG} />
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
    </Wrapper>
  );
}

// Cтили, связанные с видео и карточками FAQ
const Video = styled.video`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

const FaqCard = styled.div`
  background-color: #fff;
  border-radius: 24px;
  padding: 20px;
`;

