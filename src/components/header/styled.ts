import styled from 'styled-components';
import {NavLink} from 'react-router-dom';

export const HeaderS = styled.header`
  margin: 10px auto 0;
  background-color: #ffffff;
  width: 100%;
  max-width: 1376px;
  height: 104px;
  border-radius: 24px;
  border: 1px solid #000000;
  box-shadow: 0 2px 2px #000000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  position: sticky;
  top: 10px;
  z-index: 200;
`;

export const Logo = styled.img`
  max-width: 193px;
  width: 100%;
  object-fit: cover;
  
  @media(max-width: 1024px){
    width: 112px;
    object-fit: contain;
  }
`;

export const Navigate = styled.div`
  display: flex;
  
  @media(max-width: 1024px){
    position: absolute;
    flex-direction: column;
    background-color: #ffffff;
    padding: 10px;
    border-radius: 8px;
      border: 1px solid #000000;
  box-shadow: 0 2px 2px #000000;

    right: 0;
    top: 60px;
  }
`;

export const NavItem = styled.div.withConfig({
    shouldForwardProp: prop => !['bgColor'].includes(prop)
})<{ bgColor: string}>`
  border: 1px solid #000000;
  box-shadow: 0 2px 2px #000000;
  background-color: ${({bgColor}) => bgColor};
  border-radius: 8px;
  margin: 0 5px;
  font-family: var(--font);
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  & a {
    height: 100%;
    width: 100%;
    color: inherit;
    text-decoration: none;
    padding: 7px 24px;
    display: inline-block;
    text-align: center;
  }

  &:active{
    transition: 0.3s;
    transform: scale(0.9);
    box-shadow: 3px 3px 6px #000000;
  }
  
  &:hover{
    cursor: pointer;
  }

  @media(max-width: 1024px){
    margin: 5px 0;
    width: 144px;
    padding: 8px 0;
    display: flex;
    justify-content: center
  }
`;

export const ButtonBay = styled.button`
  padding: 7px 12px;
  border: 1px solid #000000;
  box-shadow: 0 2px 2px #000000;
  border-radius: 8px;
  background-color: var(--orange);
  font-family: var(--font);
  font-size: 20px;
  font-weight: 500;

  &:active{
    transition: 0.3s;
    transform: scale(0.9);
    box-shadow: 3px 3px 6px #000000;
  }

  &:hover{
    cursor: pointer;
  }

  @media(max-width: 1024px){
   margin-left: auto;
    margin-right: 10px;
    display: inline-flex;
    padding: 0 10px;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }
`

export const HeaderMob = styled.div`
  border: 1px solid #000000;
  border-radius: 8px;
  box-shadow: 0 2px 2px #000000;
  padding: 10px;
  background-color: #ffffff;
  justify-content: space-between;
  display: flex;
  width: 92%;
  z-index: 200;
  position: sticky;
  top: 10px;
  margin: 0 auto;
`

export const BtnMenu = styled.div.withConfig({
    shouldForwardProp: prop => !['imageUrl'].includes(prop)
})<{imageUrl: string}>`
  background-image: url(${({imageUrl}) => imageUrl});
  background-repeat: no-repeat;
  background-size: cover;
  width: 28px;
  height: 28px;
  border-radius: 4px;
`