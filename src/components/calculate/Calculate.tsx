import React, {ChangeEvent, useState} from 'react';
import {ButtonCalculate, CalculateWrapper, Input} from './styled';
import {FaqCol, FaqRow, Text16, Title20} from '../../styled';
const INIT_RESULT = 1000;

export const Calculate = ({column}:{column?: boolean}) => {
    const [result, setResult] = useState<number>(INIT_RESULT);
    const [sum, setSum] = useState<number>(1000);

    const calculate = () => {
        setResult(sum * INIT_RESULT);
    };

    return (
        <CalculateWrapper>
            <Title20>
                <span>Discover your potential short-term profits</span>
            </Title20>
            <FaqRow column={column}>
                <FaqCol column={column}>
                    <Text16 center={!column}>Initial Investment</Text16>
                    <Input bg={'transparent'}>
                        <span>$</span>
                        <input
                            type={'number'}
                            inputMode={'numeric'}
                            value={sum}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                const value = Number(event.target.value);
                                setSum(value);
                            }}/>
                    </Input>
                </FaqCol>
                <FaqCol column={column}>
                    <Text16 center={!column}>Potential Profit</Text16>
                    <Input bg={'#20C954'}>
                        <span>$</span>
                        <input readOnly value={result}/>
                    </Input>
                </FaqCol>
            </FaqRow>
            <ButtonCalculate onClick={calculate}>Calculate</ButtonCalculate>
        </CalculateWrapper>
    );
};
