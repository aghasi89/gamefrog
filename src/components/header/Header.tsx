import React, { useState } from 'react';
import { HeaderS, NavItem, Navigate, Logo, ButtonBay, HeaderMob, BtnMenu } from './styled';
import { navigateConfig } from './config';
import { useWindowSize } from '../../hooks';
import { Btn, Wrapper2 } from '../../styled'; // Убрали Container, если не используется
// import { NavLink } from 'react-router-dom'; // Можно не использовать, если делаем <a> на '/'.
const socialX = require('../../assets/images/x.png');
const socialTG = require('../../assets/images/telegram.png');
const socialFB = require('../../assets/images/fb.png');
const socialIinsta = require('../../assets/images/insta.png');
const logo = require('../../assets/images/logo-text.png');
const menu = require('../../assets/images/menu.png');

export const Header = () => {
  const { width } = useWindowSize();
  const [show, setShow] = useState<boolean>(false);

  // Функция для формирования ссылки:
  // Если путь начинается с "#" (якорь), то делаем "/#faq" (чтобы всегда вело на главную).
  // Иначе оставляем путь как есть (например, "/stake" или что-то иное).
  const makeLink = (path: string) => {
    if (path.startsWith('#')) {
      // Например, path="#faq" -> "/#faq"
      return `/${path}`;
    }
    // Иначе возвращаем, как есть (например, "/stake")
    return path;
  };

  // --- Мобильная версия ---
  if (width <= 1024) {
    return (
      <HeaderMob>
        {/* Логотип кликабельный → на главную */}
        <a href="/">
          <Logo src={logo} alt={'logo'} />
        </a>

        <ButtonBay onClick={() => { window.location.hash = 'presale'; }}>
          BUY NOW!
        </ButtonBay>

        <BtnMenu imageUrl={menu} onClick={() => setShow(!show)} />

        {show ? (
          <Navigate>
            {navigateConfig.map((item) => (
              <NavItem key={item.name} bgColor={item.bg}>
                {/* используем makeLink(...) */}
                <a href={makeLink(item.path)}>{item.name}</a>
              </NavItem>
            ))}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                marginTop: '10px'
              }}
            >
              <a
                href='https://x.com/gamefrogvip/'
                target='_blank'
                rel='noreferrer'
              >
                <div>
                  <Btn bgImg={socialX} style={{ width: '40px', height: '41px' }} />
                </div>
              </a>
              <a
                href='https://t.me/gamefrogvip/'
                target='_blank'
                rel='noreferrer'
              >
                <div>
                  <Btn bgImg={socialTG} style={{ width: '40px', height: '41px' }} />
                </div>
              </a>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
              }}
            >
              <a
                href='https://www.facebook.com/gamefrogofficial'
                target='_blank'
                rel='noreferrer'
              >
                <div>
                  <Btn bgImg={socialFB} style={{ width: '40px', height: '41px' }} />
                </div>
              </a>
              <a
                href='https://www.instagram.com/gamefrogvip/'
                target='_blank'
                rel='noreferrer'
              >
                <div>
                  <Btn bgImg={socialIinsta} style={{ width: '40px', height: '41px' }} />
                </div>
              </a>
            </div>
          </Navigate>
        ) : null}
      </HeaderMob>
    );
  }

  // --- Десктопная версия ---
  return (
    <Wrapper2
      style={{
        position: 'sticky',
        top: '10px',
        zIndex: 200
      }}
    >
      <HeaderS>
        {/* Логотип кликабельный → на главную */}
        <a href="/">
          <Logo src={logo} alt={'logo'} />
        </a>

        <Navigate>
          {navigateConfig.map((item) => (
            <NavItem key={item.name} bgColor={item.bg}>
              {/* используем makeLink(...) */}
              <a href={makeLink(item.path)}>{item.name}</a>
            </NavItem>
          ))}
        </Navigate>

        <ButtonBay onClick={() => { window.location.hash = 'presale'; }}>
          BUY NOW!
        </ButtonBay>
      </HeaderS>
    </Wrapper2>
  );
};
