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

export const CollapseButton = styled.div.withConfig({
    shouldForwardProp: prop => !['icon','isExpanded'].includes(prop)
})<{icon: string,isExpanded?: boolean}>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 104px;
  position: relative;
  padding: 20px 70px 20px 20px;
  &:after {
    content: url(${({icon}) => icon});
    width: 40px;
    height: 40px;
    display: inline-block;
    position: absolute;
    right: 20px;
    transform: ${({isExpanded}) => isExpanded ? 'rotate(0deg)' : 'rotate(180deg)'};

  }
`

export const CollapseBody = styled.div`
  padding: 0 20px 20px;
`
