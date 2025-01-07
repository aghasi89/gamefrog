import React, { ChangeEvent, useState } from 'react';
import { ButtonCalculate, CalculateWrapper, Input } from './styled';
import { ButtonWithBg, FaqCol, FaqRow, Text16, Title20 } from '../../styled';
import { Row } from '../../utils';

type Props = {
  column?: boolean;
  // Наш реальный APY (доля). Пример: 0.40 => 40%
  apyDecimal: number; 
};

export const Calculate = ({ column, apyDecimal }: Props) => {
  // Начальное значение инвестиций
  const [sum, setSum] = useState<number>(1000);
  const [selectPrice, setSelectPrice] = useState<number>(0);

  // При старте считаем result = sum * apyDecimal
  const [result, setResult] = useState<number>(sum * apyDecimal);

  // Когда пользователь вводит новое значение
  const handleSumChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setSum(event.target.value);
    setResult(value * apyDecimal);
  };

  // Если нужна кнопка «Calculate» (можно автопересчёт)
  const calculate = () => {
    setResult(sum * apyDecimal);
  };

  // Допустим, вы хотите учесть выбранную «цену» (selectPrice) 
  // (Например, 0 => 0.01$, 1 => 0.10$, 2 => 1.00$, 3 => 10.00$).
  // Можно сделать: profit = (кол-во токенов) * (рост) - sum...
  // Но оставим упрощённо, как сейчас.

  return (
    <CalculateWrapper>
      <Title20>
        <span>Discover your potential short-term profits</span>
      </Title20>
      <Row style={{ gap: "0px", justifyContent: "space-between" }}>
        <ButtonWithBg
          bgColor={selectPrice === 0 ? "#FE8903" : '#FE890399'}
          onClick={() => setSelectPrice(0)}
        >
          <Text16>Current Price (0.01$)</Text16>
        </ButtonWithBg>

        <ButtonWithBg
          bgColor={selectPrice === 1 ? "#FE8903" : '#FE890399'}
          onClick={() => setSelectPrice(1)}
        >
          <Text16>Launch Price ($0.10)</Text16>
        </ButtonWithBg>

        <ButtonWithBg
          bgColor={selectPrice === 2 ? "#FE8903" : '#FE890399'}
          onClick={() => setSelectPrice(2)}
        >
          <Text16>Mid-Term ($1.00)</Text16>
        </ButtonWithBg>

        <ButtonWithBg
          bgColor={selectPrice === 3 ? "#FE8903" : '#FE890399'}
          onClick={() => setSelectPrice(3)}
        >
          <Text16>Long-Term ($10.00)</Text16>
        </ButtonWithBg>
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
          <Text16 center={!column}>
            Potential Profit ({(apyDecimal * 100).toFixed(0)}% APY)
          </Text16>
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
