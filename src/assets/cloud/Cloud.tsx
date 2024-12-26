import React from 'react';
import styled, {keyframes} from 'styled-components';

const moveClouds = keyframes`
  0% {
    transform: translateX(-100%); /* Начинаем за пределами левого края */
  }
  100% {
    transform: translateX(100%); /* Заканчиваем за пределами правого края */
  }
`;

// Стиль для контейнера облаков
export const CloudContainer = styled.div`
  position: absolute;
  overflow: hidden;
  height: 300px; /* Высота контейнера */
  background: transparent; /* Фон для имитации неба */
  top: 150px;
  left: 0;
  right: 0;
  z-index: 0;
`;

// Стиль для облаков
export const Cloud = styled.div.withConfig({
    shouldForwardProp: prop => !['top', 'duration', 'delay'].includes(prop)
})<{ top: number, duration: number, delay: number }>`
  position: absolute;
  top: ${({top}) => top}px; /* Позиция облака по вертикали */
  width: 100%; /* Ширина облака */
  height: 60px; /* Высота облака */
  animation: ${moveClouds} ${({duration}) => duration}s linear infinite;
  animation-delay: ${({delay}) => delay}s;

  svg {
    width: 100%; /* Адаптивная ширина для SVG */
    height: 100%;
  }
`;
