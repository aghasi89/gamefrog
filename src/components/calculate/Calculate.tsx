import React, { ChangeEvent, useState } from 'react';
import { ButtonCalculate, CalculateWrapper, Input } from './styled';
import { FaqCol, FaqRow, Text16, Title20 } from '../../styled';

// Допустим, у нас APY = 40% (в десятичном виде = 0.4)
const APY = 0.4;

export const Calculate = ({ column }: { column?: boolean }) => {
  // Начальное значение инвестиций
  const [sum, setSum] = useState<number>(1000);
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
          <Input bg="#20C954">
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
