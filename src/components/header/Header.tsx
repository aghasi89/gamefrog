import React, {useState} from 'react';
import {HeaderS, NavItem, Navigate, Logo, ButtonBay, HeaderMob, BtnMenu} from './styled';
import {navigateConfig} from './config';
import {useWindowSize} from '../../hooks';
import {NavLink} from 'react-router-dom';
import { Btn } from '../../styled';
const socialX = require('../../assets/images/x.png');
const socialTG = require('../../assets/images/telegram.png');
const logo = require('../../assets/images/logo-text.png');
const menu = require('../../assets/images/menu.png');

export const Header = () => {
    const {width} = useWindowSize();
    const [show, setShow] = useState<boolean>(false)
    if (width <= 1023) {
        return (
            <HeaderMob>
                <Logo src={logo} alt={'logo'}/>
                <ButtonBay onClick={()=>{window.location.hash="presale"}}>BUY NOW!</ButtonBay>
                <BtnMenu imageUrl={menu} onClick={() => setShow(!show)} />
                {show ? <Navigate>
                    {navigateConfig.map(item => <NavItem key={item.name} bgColor={item.bg}>{item.name}</NavItem>)}
                    <div style={{display: 'flex', justifyContent: 'center', gap:"10px", width: '100%', marginTop: '10px'}}>
                    <div>
                    <Btn bgImg={socialX} style={{width:'40px', height:"41px"}} />
                  </div>
                  <div>
                    <Btn bgImg={socialTG} style={{width:'40px', height:"41px"}} />
                  </div>
                    </div>
                </Navigate> : null}
                
            </HeaderMob>
        );
    }

    return (
        <HeaderS>
            <Logo src={logo} alt={'logo'}/>
            <Navigate>
                {navigateConfig.map(item => <NavItem key={item.name} bgColor={item.bg} >
                    <NavLink to={item.path}>{item.name}</NavLink>
                </NavItem>)}
            </Navigate>
            <ButtonBay  onClick={()=>{window.location.hash="presale"}}>BUY NOW!</ButtonBay>
        </HeaderS>
    );
};
