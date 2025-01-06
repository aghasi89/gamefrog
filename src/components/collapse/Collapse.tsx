import React, {ReactNode, useEffect} from 'react';
import {CollapseBody, CollapseButton, CollapseHeader, CollapseWrapper} from './styled';
import {Text24} from '../../styled';
import {useCollapse} from 'react-collapsed';
import {useWindowSize} from '../../hooks';
import Icon from '../../assets/images/arrow-down.svg';

type Props = {
    btnText: string;
    text: ReactNode;
    open?: boolean;
    onPress?: (b:boolean) => void;
}

export const Collapse = ({text, btnText,open,onPress}: Props) => {
    const {isExpanded, setExpanded} = useCollapse();
    const {width} = useWindowSize();
    useEffect(() => {
            setExpanded(open ?? false)
    }
    ,[open])
    return (
        <CollapseWrapper >
        <CollapseHeader onClick={() => {
            setExpanded(!isExpanded)
            onPress && onPress(!isExpanded)
            }}>
         <Text24 style={{maxWidth:"80%"}}>{btnText}</Text24>
        <CollapseButton bgColor='#8BC6FE' isExpanded={isExpanded} >
        <span>
            <img src={Icon}/>
        </span>
        </CollapseButton>
        
        </CollapseHeader>
            {isExpanded
                ? <CollapseBody>
                    {text}
                </CollapseBody>
                : null
            }
        </CollapseWrapper>
    );
};
