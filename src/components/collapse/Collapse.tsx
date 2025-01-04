import React, {ReactNode} from 'react';
import {CollapseBody, CollapseButton, CollapseWrapper} from './styled';
import {Text24} from '../../styled';
import {useCollapse} from 'react-collapsed';
import {useWindowSize} from '../../hooks';

const icon = require('../../assets/images/collapse-btn.png');

type Props = {
    btnText: string;
    text: ReactNode;
}

export const Collapse = ({text, btnText}: Props) => {
    const {isExpanded, setExpanded} = useCollapse();
    const {width} = useWindowSize();
    return (
        <CollapseWrapper>
            <CollapseButton icon={icon} isExpanded={isExpanded} onClick={() => setExpanded(!isExpanded)}>
                <Text24>{btnText}</Text24>
            </CollapseButton>
            {isExpanded
                ? <CollapseBody>
                    {text}
                </CollapseBody>
                : null
            }
        </CollapseWrapper>
    );
};
