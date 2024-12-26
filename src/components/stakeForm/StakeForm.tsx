import React, { useState } from 'react';
import styled from 'styled-components';
import { Text32, Text16, InfoButton } from '../../styled';

const walletBg = require('../../assets/images/btn-wallet.png');

type Props = {
  title: string;
  text: string;
  value: string;
  buttonText: string;
  onAction?: (amount: string) => void; // ← callback для родительского компонента
};

export const StakeForm = ({
  title,
  buttonText,
  text,
  value,
  onAction
}: Props) => {
  const [amount, setAmount] = useState(''); // ← локальное состояние для инпута

  return (
    <Card>
      <Text32 center={true}>{title}</Text32>
      <Input>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
        <InputBtn onClick={() => setAmount(value)}>MAX</InputBtn>
      </Input>
      <TextWrap>
        <Text16 center={false}>{text}</Text16>
        <Text16 center={false}>{value}</Text16>
      </TextWrap>
      <InfoButton
        imageUrl={walletBg}
        style={{ textTransform: 'none', marginTop: '30px' }}
        onClick={() => {
          // При клике вызываем onAction, если он передан
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
