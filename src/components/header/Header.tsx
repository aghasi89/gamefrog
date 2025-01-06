import React, { useState } from 'react';
import { HeaderS, NavItem, Navigate, Logo, ButtonBay, HeaderMob, BtnMenu } from './styled';
import { navigateConfig } from './config';
import { useWindowSize } from '../../hooks';
import { NavLink } from 'react-router-dom';
import { Btn, Container, Wrapper2 } from '../../styled';
const socialX = require('../../assets/images/x.png');
const socialTG = require('../../assets/images/telegram.png');
const logo = require('../../assets/images/logo-text.png');
const menu = require('../../assets/images/menu.png');

export const Header = () => {
    const { width } = useWindowSize();
    const [show, setShow] = useState<boolean>(false)
    if (width <= 1023) {
        return (
            <HeaderMob>
                <a href='/'><Logo src={logo} alt={'logo'} /></a>
                <ButtonBay onClick={() => { window.location.hash = "presale" }}>BUY NOW!</ButtonBay>
                <BtnMenu imageUrl={menu} onClick={() => setShow(!show)} />
                {show ? <Navigate>
                    {navigateConfig.map(item => <NavItem key={item.name} bgColor={item.bg}><a href={item.path}>{item.name}</a></NavItem>)}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: "10px", width: '100%', marginTop: '10px' }}>
                        <a href='https://x.com/gamefrogvip/' target='_blank'><div>
                            <Btn bgImg={socialX} style={{ width: '40px', height: "41px" }} />
                        </div></a>
                        <a href='https://x.com/gamefrogvip/' target='_blank'>
                        <div>
                            <Btn bgImg={socialTG} style={{ width: '40px', height: "41px" }} />
                        </div></a>
                    </div>
                </Navigate> : null}

            </HeaderMob>
        );
    }

    return (
        <Wrapper2 style={{
            position: 'sticky',
            top: '10px',
            zIndex: 200
        }} >
            <HeaderS>
                <a href='/'><Logo src={logo} alt={'logo'} /></a>
                <Navigate>
                    {navigateConfig.map(item => <NavItem key={item.name} bgColor={item.bg} >
                        <a href={item.path}>{item.name}</a>
                    </NavItem>)}
                </Navigate>
                <ButtonBay onClick={() => { window.location.hash = "presale" }}>BUY NOW!</ButtonBay>
            </HeaderS>
        </Wrapper2>
    );
};
