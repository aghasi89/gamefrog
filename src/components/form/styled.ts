import styled from 'styled-components';

export const FormS = styled.div.withConfig({
  shouldForwardProp: prop => !['imageUrl'].includes(prop)
}) <{ imageUrl?: string }>`
  ${({imageUrl})=>imageUrl?` background-image: url(${imageUrl})`:"border: 1px solid #000000;box-shadow: 0 2px 2px #000000;background-color: var(--color-about); border-radius: 24px;"};
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
 // width: 100%;
  max-width: 499px;
  //min-height: 665px;

  padding: 20px;
  margin-left: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  @media(max-width: 1024px){
    margin: 0 auto;
    width: 100%;
  }
`;

export const FormTitle = styled.p`
  font-family: var(--font-arco);
  font-size: 20px;
  font-weight: 400;
  color: var(--color-black);
  text-align: center;
`;

export const CountDown = styled.div`
  display: flex; 
  justify-content: center;
  margin: 0 auto;
`;

export const CountDownItem = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  background-color: var(--orange);
  font-weight: 500;
  font-style: italic;
  font-size: 54px;
  line-height: 48px;
  font-family: var(--font);

  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  
  @media(max-width: 1200px){
    width: 60px;
    height: 60px;
    font-size: 34px;
  }
`;

export const CountDownItemSubtext = styled.span`
  font-family: var(--font);
  font-size: 16px;
  line-height: 16px;
  font-weight: 400;
  color: var(--color-black);
  text-align: center;
  opacity: 0.5;
  text-transform: uppercase;
  display: block;
  margin-top: 10px;
`;

export const CountDownSeparator = styled.span`
  display: inline-block;
  margin: 30px 5px 0;

  @media(max-width: 1200px){
    margin: 20px 5px 0;
  }
`;

export const Text16 = styled.p.withConfig({
  shouldForwardProp: prop => !['center'].includes(prop)
}) <{ center: boolean }>`
  font-family: var(--font);
  font-size: 16px;
  font-weight: 500;
  color: var(--color-black);
  text-align: ${({ center }) => center ? 'center' : 'text-left'};
  margin: 3px 0;
`;

export const Text24 = styled.p`
  font-family: var(--font);
  font-size: 24px;
  font-weight: 500;
  color: var(--color-black);
  text-align: center;
`;

export const TextBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StyledProgress = styled.progress`
  appearance: none;
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #ccc;

  &::-webkit-progress-bar {
    background-color: #e0e0e0;
  }

  &::-webkit-progress-value {
    background: linear-gradient(90deg, #006fff, #00a7ff);
    border-radius: 10px 0 0 10px;
  }

  &::-moz-progress-bar {
    background: linear-gradient(90deg, #006fff, #00a7ff);
    border-radius: 10px 0 0 10px;
  }
`;

export const Box = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 20px 0;
`;

export const BoxItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 48%;
`;

export const Input = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 13px;
  border: 1px solid #000000;
  font-weight: 500;
  font-size: 16px;
  color: #000000;
  font-family: var(--font);
  background-color: #FECF03;
  padding: 2px 10px;
  overflow: hidden;
  
  & input {
    padding: 12px 8px;
    width: 85%;
    font: inherit;
    border: none;
    outline: none;
    background-color: transparent;
    font-weight: 500;
    font-size: 24px;
    color: #000000;
    font-family: var(--font);
    &::placeholder,
    &::-webkit-input-placeholder {
      color: #00000080;
    }
    &:-ms-input-placeholder {
      color: #00000080;
    }
  }
`;

export const InputText = styled.span`
  font-weight: 500;
  font-size: 24px;
  color: #00000080;
  font-family: var(--font);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-right: 6px;
  
`
export const Loader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 500;
  color: #FFF;
  font-family: var(--font-arco);
  border-radius: 24px;
  overflow: hidden;
`;