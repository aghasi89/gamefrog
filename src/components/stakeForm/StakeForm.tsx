import React, { useState } from 'react';
import styled from 'styled-components';
import { Text32, Text16, InfoButton } from '../../styled';

const walletBg = require('../../assets/images/btn-wallet.png');

type Props = {
  title: string;
  text: string;         // Текст, который может содержать несколько строк (через \n)
  value: string;        // Справа какой-то вывод (или "MAX"?)
  buttonText: string;
  onAction?: (amount: string) => void;         // callback при нажатии кнопки
  onAmountChange?: (val: number) => void;      // callback при вводе числа
};

export const StakeForm = ({
  title,
  buttonText,
  text,
  value,
  onAction,
  onAmountChange,
}: Props) => {
  const [amount, setAmount] = useState(''); // локальное состояние инпута

  // Хендлер изменения поля
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Разрешим только цифры и точку
    if (!/^\d*\.?\d*$/.test(val)) return;
    setAmount(val);

    // Если родитель передал onAmountChange
    if (onAmountChange) {
      const num = parseFloat(val) || 0;
      onAmountChange(num);
    }
  };

  return (
    <Card>
      <Text32 center={true}>{title}</Text32>

      {/* Поле ввода + кнопка MAX */}
      <Input>
        <input
          value={amount}
          onChange={handleChange}
          placeholder="Enter amount"
        />
        <InputBtn onClick={() => setAmount(value)}>MAX</InputBtn>
      </Input>

      {/* Основной текст (может содержать переносы \n) */}
      <TextWrap>
        <Text16 
          center={false} 
          style={{ whiteSpace: 'pre-line' }} // Чтобы переносы \n отображались
        >
          {text}
        </Text16>
        <Text16 center={false}>{value}</Text16>
      </TextWrap>

      {/* Кнопка действия */}
      <InfoButton
        bgColor='#20C954'
        style={{ textTransform: 'none', marginTop: '30px' }}
        onClick={() => {
          if (onAction) {
            onAction(amount);
          }
        }}
      >
        {buttonText}
      </InfoButton>
    </Card>
  );
};

// ====== Стили ======
const Card = styled.div`
  width: 100%;
  border-radius: 24px;
  border: 1px solid #000000;
  background-color: #FECF03;
  padding: 30px;
  @media (max-width: 1024px) {
    padding: 30px 12px;
  }

`;

const Input = styled.div`
  background-color: transparent;
  border: 1px solid #000000;
  border-radius: 13px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 62px;
  padding-right: 10px;

  & input {
    flex-grow: 1;
    height: 100%;
    border: none;
    outline: none;
    font-family: var(--font);
    font-size: 24px;
    font-weight: 500;
    color: var(--color-black);
    background-color: transparent;
    padding-left: 10px;
    width: 50%;
  }
   
`;

const InputBtn = styled.button`
  background-color: #20C954;
  height: 38px;
  width: 83px;
  font-family: var(--font);
  font-size: 24px;
  font-weight: 500;
  color: var(--color-black);
  text-transform: uppercase;
  border-radius: 8px;
`;

const TextWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
