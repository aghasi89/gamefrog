import styled from 'styled-components';

export const CalculateWrapper = styled.div`
  max-width: 760px;
  width: 100%;
 // height: 283px;
  background-color: #E7FF7A;
  border: 1px solid #000000;
  border-radius: 24px;
  padding: 20px;
  
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  
`;

export const Input = styled.div.withConfig({
    shouldForwardProp: prop => !['bg'].includes(prop)
})<{ bg: string }>`
  background-color: ${({bg}) => bg};
  font-size: 24px;
  font-family: var(--font);
  color: var(--color-black);
  width: 100%;
  height: 62px;
  
  display: flex;
  border: 1px solid #000000;
  border-radius: 12px;
  
  & span {
    width: 10%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  & input {
    border: none;
    outline: none;
    font-size: inherit;
    font-family: var(--font);
    color: var(--color-black);
    height: 100%;
    width: 90%;
    background-color: transparent;

    &::placeholder {
      color: var(--text-grey);
    }
  }
`;

export const ButtonCalculate = styled.button`
  border: 1px solid #000000;
  border-radius: 12px;
  background-color: #20C954;
  font-size: 24px;
  font-family: var(--font);
  font-weight: 500;
  width: 200px;
  height: 62px;
  
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0 0 auto;

  @media(max-width: 1024px){
    width: 100%;
  }
`;
