import React, { ChangeEvent, useState } from 'react';
import { ButtonCalculate, CalculateWrapper, Input } from './styled';
import { ButtonWithBg, FaqCol, FaqRow, Text16, Title20 } from '../../styled';
import { Row } from '../../utils';

// Допустим, у нас APY = 40% (в десятичном виде = 0.4)
const APY = 0.4;

export const Calculate = ({ column }: { column?: boolean }) => {
  // Начальное значение инвестиций
  const [sum, setSum] = useState<number>(1000);
  const [selectPrice, setSelectPrice] = useState<number>(0);
  // Начальное значение прибыли = sum * 0.4
  const [result, setResult] = useState<number>(sum * APY);

  // Когда пользователь вводит новое значение в поле
  const handleSumChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setSum(value);
    // Автоматически пересчитываем потенциальную прибыль
    setResult(value * APY);
  };

  // Если нужно, чтобы кнопка "Calculate" пересчитывала
  // можно оставить логику здесь. Но можно и автоматически
  const calculate = () => {
    setResult(sum * APY);
  };

  return (
    <CalculateWrapper>
      <Title20>
        <span>Discover your potential short-term profits</span>
      </Title20>
      <Row style={{gap:"0px", justifyContent:"space-between"}} >
      <ButtonWithBg bgColor={selectPrice===0?"#FE8903":'#FE890399' } onClick={()=>{setSelectPrice(0)}}><Text16>Current Price (0.01$)</Text16></ButtonWithBg>
      <ButtonWithBg bgColor={selectPrice===1?"#FE8903":'#FE890399'} onClick={()=>{setSelectPrice(1)}}><Text16>Launch Price ($0.10)</Text16></ButtonWithBg>
      <ButtonWithBg bgColor={selectPrice===2?"#FE8903":'#FE890399'} onClick={()=>{setSelectPrice(2)}}><Text16>Mid-Term ($1.00)</Text16></ButtonWithBg>
      <ButtonWithBg bgColor={selectPrice===3?"#FE8903":'#FE890399'} onClick={()=>{setSelectPrice(3)}}><Text16>Long-Term ($10.00)</Text16></ButtonWithBg>

      </Row>
      <FaqRow column={column}>
        {/* Поле "Initial Investment" */}
        <FaqCol column={column}>
          <Text16 center={!column}>Initial Investment</Text16>
          <Input bg="transparent">
            <span>$</span>
            <input
              type="number"
              inputMode="numeric"
              value={sum}
              onChange={handleSumChange}
            />
          </Input>
        </FaqCol>

        {/* Поле "Potential Profit" */}
        <FaqCol column={column}>
          <Text16 center={!column}>Potential Profit (40% APY)</Text16>
          <Input bg="#20C95480">
            <span>$</span>
            {/* Округлим до 2 знаков после запятой */}
            <input readOnly value={result.toFixed(2)} />
          </Input>
        </FaqCol>
      </FaqRow>

      {/* Кнопка - если хотите ручной пересчёт */}
      <ButtonCalculate onClick={calculate}>Calculate</ButtonCalculate>
    </CalculateWrapper>
  );
};
