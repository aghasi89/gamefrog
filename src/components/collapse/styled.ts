import styled from 'styled-components';

export const CollapseWrapper = styled.div`
  background-color: #ffffff;
  border-top-width: 1px;
  border-left-width: 1px;
  border-right-width: 1px;
  border-bottom-width: 2px;
  border-style: solid;
  border-color: black;
  border-radius: 24px;
  max-width: 592px;
  width: 100%;
  margin-bottom: 10px;
  
  &:hover{
    cursor: pointer;
  }
`
export const CollapseHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 104px;
  padding: 20px 20px 20px 20px;
  &:hover{
    cursor: pointer;
  }
`
export const CollapseButton = styled.div.withConfig({
    shouldForwardProp: prop => !['bgColor','isExpanded'].includes(prop)
})<{isExpanded?: boolean,bgColor?: string}>`
  border: 1px solid #000000;
  box-shadow: 0 2px 2px #000000;
  background-color: ${({bgColor}) => bgColor};
  border-radius: 8px;
  margin: 0 5px;
  font-family: var(--font);
  font-size: 20px;
  font-weight: 500;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  & span {
    transition: transform 0.3s;
    display: inline-block;
    width: 24px;
    height: 24px;
    background-size: cover;
    transform: ${({isExpanded}) => isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`

export const CollapseBody = styled.div`
  padding: 0 20px 20px;
`
