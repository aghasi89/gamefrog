import styled from 'styled-components';

type Row = {
    gap?: string;
}

export const Row = styled.div.withConfig({
    shouldForwardProp: prop => !['gap'].includes(prop)
})<Row>`
  max-width: 1440px;
  width: 100%;
  gap: ${({ gap }) => gap || '16px'}; /* Промежуток между колонками */
  
  margin: 0 auto;
  
  display: flex;
  flex-direction: row;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

type Column = {
    size?: number;
    sizeSm?: number;
    sizeXs?: number;
    gap?: string;
    direction?: 'row' | 'column';
    alignCenter?: boolean;
}

export const Column = styled.div.withConfig({
    shouldForwardProp: prop => !['size', 'sizeSm', 'sizeXs', 'gap', 'direction', 'alignCenter'].includes(prop)
})<Column>`
 
  display: flex;
  align-items: ${({alignCenter}) => alignCenter ? 'center' : 'flex-start'};
  flex-direction: ${({ direction }) => direction || 'row'};
  padding: ${({ gap }) => gap || '8px'};
  
  &:nth-child(1){
    width: 64%;
  }
  
  &:last-child{
    width: 36%;
  }

  @media (max-width: 1024px) {
    justify-content: center;
    align-items: center;
   
    &:nth-child(1){
      width: 100%;
    }

    &:last-child{
      width: 100%;
    }
  }
`;
