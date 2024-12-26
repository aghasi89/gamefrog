import styled from 'styled-components';

export const InfoCard = styled.div`
  max-width: 438px;
  width: 100%;
  height: 294px;
  border: 1px solid #000000;
  box-shadow: 0 2px 2px #000000;
  border-radius: 24px;
  padding: 20px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 40px;
  
  @media(max-width: 1024px){
    margin-top: 400px;
  }
`

export const InfoText = styled.p`
  margin: 0 0 10px;
  font-size: 24px;
  font-weight: 500;
  font-family: var(--font); 
  text-align: center;

  @media(max-width: 1024px){
    font-size: 18px;
    margin: 0;
  }
`
