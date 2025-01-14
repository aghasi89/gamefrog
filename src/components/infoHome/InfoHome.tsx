import React from 'react';
import {InfoCard, InfoText} from './styled';
import {InfoButton} from '../../styled';
const joinBg = require('../../assets/images/join-bg.png');
const learnBg = require('../../assets/images/learn-bg.png');

export const InfoHome = () => {
    return (
        <InfoCard>
            <InfoText>Join the GAMEFROG revolution today.<br/>Don’t miss your chance to secure tokens<br/>before the public launch!</InfoText>
            <InfoButton bgColor='#FE8903'>Join the Presale Now</InfoButton>
            <InfoButton bgColor='#20C954'>Learn More About GAMEFROG</InfoButton>
        </InfoCard>
    );
};
