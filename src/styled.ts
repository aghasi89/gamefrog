import styled, {keyframes} from 'styled-components';

export type ContainerProps = {
    imageUrl: string;
    height?: number;
    isPadding?: boolean;
}

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 1024px) {
    background-color: #FE9F8B;
  }
`;

export const Container = styled.div.withConfig({
    shouldForwardProp: prop => !['imageUrl', 'height', 'isPadding'].includes(prop)
})<ContainerProps>`
  width: 100%;
  //max-width: 1440px; 
  margin: 0 auto;
  height: ${({height}) => height?height+"px":"auto"};
  padding: ${({isPadding}) => isPadding ? '0 20px 0' : '100px 20px 0'};
  background-image: url(${({imageUrl}) => imageUrl});
  background-repeat: no-repeat;
  background-size: cover; //1440px;
  background-position: center center;
  position: relative;
  overflow: hidden;

  @media (max-width: 1024px) {
    background-size: 100%;
    background-position: top;
    padding: 0 5px;
  }
`;

export const TitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 35px;
  padding: 0 10px;

  @media (max-width: 1024px) {
    padding: 0;
    margin-top: 80px;
  }
`;
export const ModalTitle = styled.h1.withConfig({
    shouldForwardProp: prop => !['color'].includes(prop)
})<{ color?: string }>`
  font-family: var(--font-arco);
  font-size: 48px;
text-shadow: rgb(0, 0, 0) 3px 0px 0px, rgb(0, 0, 0) 2.83487px 0.981584px 0px, rgb(0, 0, 0) 2.35766px 1.85511px 0px, rgb(0, 0, 0) 1.62091px 2.52441px 0px, rgb(0, 0, 0) 0.705713px 2.91581px 0px, rgb(0, 0, 0) -0.287171px 2.98622px 0px, rgb(0, 0, 0) -1.24844px 2.72789px 0px, rgb(0, 0, 0) -2.07227px 2.16926px 0px, rgb(0, 0, 0) -2.66798px 1.37182px 0px, rgb(0, 0, 0) -2.96998px 0.42336px 0px, rgb(0, 0, 0) -2.94502px -0.571704px 0px, rgb(0, 0, 0) -2.59586px -1.50383px 0px, rgb(0, 0, 0) -1.96093px -2.27041px 0px, rgb(0, 0, 0) -1.11013px -2.78704px 0px, rgb(0, 0, 0) -0.137119px -2.99686px 0px, rgb(0, 0, 0) 0.850987px -2.87677px 0px, rgb(0, 0, 0) 1.74541px -2.43999px 0px, rgb(0, 0, 0) 2.44769px -1.73459px 0px, rgb(0, 0, 0) 2.88051px -0.838247px 0px;  color: ${({color}) => color ? color : 'var(--color-black)'};
  text-align: center;
  margin: 0;
  @media (max-width: 1024px) {
    font-size: 32px;
  }
`;
export const Title = styled.h1`
  margin: 0;
  font-family: var(--font-arco);
  font-size: 64px;
  text-shadow: 2px 2px 0 black,
  -2px 2px 0 black,
    2px -2px 0 black,
    -2px -2px 0 black;

  & span {
    display: inline-block;
    margin: 0 5px;

    &:nth-child(1) {
      color: #ffffff;
    }

    &:nth-child(2) {
      color: var(--orange);
    }

    &:nth-child(3) {
      color: #ffffff;
    }

    &:nth-child(4) {
      color: var(--green);
    }
  }

  @media (max-width: 1024px) {
    font-size: 32px;
  }
`;

export const SecondTitle = styled.div.withConfig({
    shouldForwardProp: prop => !['textDirection', 'column'].includes(prop)
})<{ textDirection?: string; column?: boolean}>`
  text-align: ${({textDirection}) => textDirection ? textDirection : 'center'};
  width: 100%;
  display: flex;
  flex-direction: ${({column}) => column ? 'column' : 'row'};
  position: relative;
  z-index: 1;
  & span {
    display: inline-block;
    font-family: var(--font-arco);
    font-size: 64px;

    &:nth-child(1) {
      color: var(--color-black);
    }

    &:nth-child(2) {
      color: #ffffff;
    }

    @media (max-width: 1024px) {
      font-size: 32px;
    }
  }
`;
export const SecondTitleInStaking = styled.div.withConfig({
  shouldForwardProp: prop => !['textDirection', 'column'].includes(prop)
})<{ textDirection?: string; column?: boolean}>`
text-align: ${({textDirection}) => textDirection ? textDirection : 'center'};
width: 100%;
display: flex;
flex-direction: ${({column}) => column ? 'column' : 'row'};
position: relative;
z-index: 1;
text-shadow: rgb(255, 255, 255) 3px 0px 0px, rgb(255, 255, 255) 2.83487px 0.981584px 0px, rgb(255, 255, 255) 2.35766px 1.85511px 0px, rgb(255, 255, 255) 1.62091px 2.52441px 0px, rgb(255, 255, 255) 0.705713px 2.91581px 0px, rgb(255, 255, 255) -0.287171px 2.98622px 0px, rgb(255, 255, 255) -1.24844px 2.72789px 0px, rgb(255, 255, 255) -2.07227px 2.16926px 0px, rgb(255, 255, 255) -2.66798px 1.37182px 0px, rgb(255, 255, 255) -2.96998px 0.42336px 0px, rgb(255, 255, 255) -2.94502px -0.571704px 0px, rgb(255, 255, 255) -2.59586px -1.50383px 0px, rgb(255, 255, 255) -1.96093px -2.27041px 0px, rgb(255, 255, 255) -1.11013px -2.78704px 0px, rgb(255, 255, 255) -0.137119px -2.99686px 0px, rgb(255, 255, 255) 0.850987px -2.87677px 0px, rgb(255, 255, 255) 1.74541px -2.43999px 0px, rgb(255, 255, 255) 2.44769px -1.73459px 0px, rgb(255, 255, 255) 2.88051px -0.838247px 0px;
&>span {
  display: inline-block;
  font-family: var(--font-arco);
  font-size: 64px;
  &>div>span{
  text-shadow: none;
  padding: 15px 50px;
  @media (max-width: 1024px) {
    padding: 8px 24px;
    }


  }

  &>span{
  text-shadow: none;
  padding: 15px 50px;
  @media (max-width: 1024px) {
    padding: 8px 24px;
    }


  }
  @media (max-width: 1024px) {
    font-size: 32px;
  }
}
`;

export const Title20 = styled.div`
  text-align: center;
  width: 100%;
  margin-bottom: 30px;

  & span {
    font-family: var(--font-arco);
    font-size: 20px;
    display: block;

    &:nth-child(1) {
      color: var(--color-black);

    }

    &:nth-child(2) {
      color: #ffffff;

    }

    @media (max-width: 1024px) {
      font-size: 16px;
    }
  }
`;

export const SixTitle = styled.div`
  text-align: left;
  width: 100%;

  & span {
    font-family: var(--font-arco);
    font-size: 48px;
    display: block;

    &:nth-child(1) {
      color: var(--color-black);

    }

    &:nth-child(2) {
      color: #ffffff;

    }

    @media (max-width: 1024px) {
      font-size: 32px;
      text-align: center;
    }
  }
`;

export const SubTitle = styled.span`
  font-family: var(--font-arco);
  font-size: 64px;
  color: var(--color-black);
  text-shadow: 2px 2px 0 #ffffff,
  -2px 2px 0 #ffffff,
    2px -2px 0 #ffffff,
    -2px -2px 0 #ffffff;

  @media (max-width: 1024px) {
    font-size: 32px;
  }
`;

export const Space = styled.div`
  width: 100%;
  height: 70px;
  background-color: #ffffff;
`;

export const CenterButton = styled.div.withConfig({
    shouldForwardProp: prop => !['top'].includes(prop)
})<{ top: number }>`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: ${({top}) => top}px;
  position: relative;
  z-index: 3;
`;

export const InfoButton = styled.div.withConfig({
    shouldForwardProp: prop => !['imageUrl','width'].includes(prop)
})<{ imageUrl: string, width?: number, height?: number }>`
  width: ${({width}) =>width?width+"px":'100%'};
  max-width: ${({width}) =>width?"95%":'450px'};
  height: ${({height}) => height ? height + 'px' : '62px'};
  padding: 10px 20px;
  background-image: url(${({imageUrl}) => imageUrl});
  background-repeat: no-repeat;
  background-size: ${({width}) =>width?"95%":'100%'};
  background-position: center center;
  transition: 0.3s;
  transform: scale(1);

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 24px;
  font-weight: 500;
  font-family: var(--font);
  color: #ffffff;
  border-radius: 12px;
  text-transform: uppercase;

  & svg {
    margin-right: 10px;
  }

  &:active {
    transition: 0.3s;
    transform: scale(0.98);
    box-shadow: 3px 3px 6px #000000;
  }

  &:hover {
    cursor: pointer;
  }

  @media (max-width: 1024px) {
    font-size: 16px;
  }
`;

export const CardRow = styled.div`
  display: flex;
  width: 100%;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 30px;
  justify-content: center;
`;

export const CardVideo = styled.div`
  border-radius: 24px;
  background-color: #ffffff;
  padding: 20px 10px 10px;
  width: 381px;
  height: 247px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  @media (max-width: 1024px) {
    height: 226px;
  }
`;

export const CardImgWrap = styled.div`
  width: 100%;
  border-radius: 24px;
  overflow: hidden;

  & img {
    width: 100%;
    object-fit: cover;
  }
`;

export const Text14 = styled.p.withConfig({
    shouldForwardProp: prop => !['center', 'color'].includes(prop)
})<{ center: boolean, color?: string }>`
  font-family: var(--font);
  font-size: 14px;
  font-weight: 500;
  color: ${({color}) => color ? color : 'var(--color-black)'};
  text-align: ${({center}) => center ? 'center' : 'left'};
  margin: 3px 0;
`;

export const Text16 = styled.p.withConfig({
    shouldForwardProp: prop => !['center', 'color','weight'].includes(prop)
})<{ center?: boolean, color?: string,weight?:string }>`
  font-family: var(--font);
  font-size: 16px;
  font-weight: ${({weight})=>weight?weight:"500"};
  color: ${({color}) => color ? color : 'var(--color-black)'};
  text-align: ${({center}) => center ? 'center' : 'left'};
  margin: 3px 0;
`;
export const Text16Span = styled.span.withConfig({
  shouldForwardProp: prop => !['center', 'color','weight'].includes(prop)
})<{ center?: boolean, color?: string,weight?:string }>`
font-family: var(--font);
font-size: 16px;
font-weight: ${({weight})=>weight?weight:"500"};
color: ${({color}) => color ? color : 'var(--color-black)'};
text-align: ${({center}) => center ? 'center' : 'left'};
margin: 3px 0;
`;

export const Text24 = styled.p.withConfig({
    shouldForwardProp: prop => !['center', 'color','weight'].includes(prop)
})<{ center?: boolean, color?: string ,weight?:string}>`
  font-family: var(--font);
  font-size: 24px;
  font-weight: ${({weight})=>weight?weight:"500"};
  color: ${({color}) => color ? color : 'var(--color-black)'};
  text-align: ${({center}) => center ? 'center' : 'left'};
  margin: 0;
`;

export const Text20 = styled.p.withConfig({
  shouldForwardProp: prop => !['center', 'color','weight'].includes(prop)
})<{ center?: boolean, color?: string ,weight?:string}>`
font-family: var(--font);
font-size: 20px;
font-weight: ${({weight})=>weight?weight:"500"};
color: ${({color}) => color ? color : 'var(--color-black)'};
text-align: ${({center}) => center ? 'center' : 'left'};
margin: 0;
`;

export const Text32 = styled.p.withConfig({
    shouldForwardProp: prop => !['center', 'color'].includes(prop)
})<{ center?: boolean, color?: string }>`
  font-family: var(--font-arco);
  font-size: 32px;
  font-weight: 500;
  color: ${({color}) => color ? color : 'var(--color-black)'};
  text-align: center;
  margin: 0;
`;
export const Text48 = styled.p.withConfig({
  shouldForwardProp: prop => !['center', 'color'].includes(prop)
})<{ center?: boolean, color?: string }>`
font-family: var(--font-arco);
font-size: 48px;
font-weight: 500;
color: ${({color}) => color ? color : 'var(--color-black)'};
text-align: center;
margin: 0;
@media (max-width: 1024px) {
  font-size: 32px;
}
`;

export const FaqRow = styled.div.withConfig({
    shouldForwardProp: prop => !['column'].includes(prop)
})<{column?: boolean}>`
  display: flex;
  flex-direction: ${({column}) => column ? 'column' : 'row'};
  gap: 20px;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const FaqCol = styled.div.withConfig({
    shouldForwardProp: prop => !['column'].includes(prop)
})<{column?: boolean}>`
  width: ${({column}) => column ? '100%' : '50%'};

  @media (max-width: 1024px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;


export const FinalRow = styled.div`
  max-width: 1376px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 25px;
  position: relative;
  z-index: 100;
  margin: 0 auto;

  @media (max-width: 1024px) {
    flex-direction: column-reverse;
    align-items: center
  }
`;

export const FinalCol = styled.div`
  width: 100%;
  max-width: 550px;

  @media (max-width: 1024px) {
    width: 100%;
    
    &:nth-child(1){
      display: flex;
      flex-direction: column-reverse;
    }
  }
`;

export const LabelFrog = styled.div`
  width: 100%;
  //border-radius: 24px;
  //overflow: hidden;

  & img {
    width: 100%;
    object-fit: cover;
  }
`;

export const Social = styled.div`
  display: flex;
  align-items: flex-end;
  position: relative;

  max-width: 550px;
  width: 100%;
  height: 450px;

  & img {
    max-width: 550px;
    width: 100%;
    height: 450px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;

    @media (max-width: 1024px) {
      height: 350px;
    }
  }

  @media (max-width: 1024px) {
    height: 350px;
  }
`;

export const SocialBtnS = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  position: absolute;
  bottom: 20px;
  z-index: 2;
  width: 100%;
  padding: 0 50px 30px;

  @media (max-width: 1024px) {
    padding: 0;
  }
`;

export const Btn = styled.button.withConfig({
    shouldForwardProp: prop => !['bgImg'].includes(prop)
})<{ bgImg?: string }>`
  max-width: 64px;
  width: 64px;
  height: 66px;
  background-image: url(${({bgImg}) => bgImg});
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
  border: none;
  outline: none;
  margin-top: 10px;

  &:hover {
    cursor: pointer;
  }

  &:active {
    transform: scale(0.99);
  }
`;


export const FinalBlock = styled.div.withConfig({
    shouldForwardProp: prop => !['bgImg'].includes(prop)
})<{ bgImg: string }>`
  max-width: 550px;
  width: 100%;
  height: 698px;
  background-image: url(${({bgImg}) => bgImg});
  background-repeat: no-repeat;
  background-size: cover;
  padding-top: 250px;

  @media (max-width: 1024px) {
    height: 700px;
    padding-top: 220px; 
    background-size: 100% 100%;
  }
`;

export const FinalForm = styled.div`
  gap: 10px;
  padding: 0 40px;

  @media (max-width: 1024px){
    padding: 0 10px;
  }
`;

export const FinalFormInput = styled.input`
  background-color: #E8E8E8;
  border-radius: 12px;
  border: 1px solid #000000;
  font-size: 24px;
  font-family: var(--font);
  color: black;
  width: 100%;
  height: 64px;
  margin-bottom: 10px;
  padding: 10px;

  &::placeholder {
    color: rgba(0, 0, 0, 0.33);
  }
`;

export const FinalFormTextarea = styled.textarea`
  background-color: #E8E8E8;
  border-radius: 12px;
  border: 1px solid #000000;
  font-size: 24px;
  font-family: var(--font);
  color: black;
  width: 100%;
  height: 182px;
  resize: none;
  padding: 10px;

  &::placeholder {
    color: rgba(0, 0, 0, 0.33);
  }
`;

export const FinalFormFooter = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: 10px;

  @media (max-width: 1024px){
    flex-direction: column-reverse;
  }
`;

export const FinalFormLink = styled.a`
  font-family: var(--font);
  font-size: 20px;
  color: black;
`;

export const FinalFormBtn = styled.button`
  border: 1px solid #000000;
  border-radius: 12px;
  background-color: #20C954;
  font-family: var(--font);
  font-size: 24px;
  color: black;
  
  width: 176px;
  height: 64px;

  @media (max-width: 1024px){
    width: 100%;
    margin-bottom: 20px;
  }
`;

const moveText = (angel:number=5) => keyframes`
  0% {
    transform: rotate(${angel}deg);
  }
  50% {
    transform: rotate(-${angel}deg);
  }
  100% {
    transform: rotate(${angel}deg);
  }
`;

export const MoveText = styled.span.withConfig({
    shouldForwardProp: prop => !['duration', 'delay', 'bgColor','amplitude','color','size'].includes(prop)
})<{ duration: number, delay: number, bgColor: string, amplitude?: number, color?: string, size?: number }>`
  display: inline-block;
  animation: ${({amplitude}) =>moveText(amplitude ?? 5)} ${({duration}) => duration}s ease-in-out infinite;
  animation-delay: ${({delay}) => delay}s;
  background-color: ${({bgColor}) => bgColor};
  font-family: var(--font-arco);
  padding: 5px;
  border-radius: 8px;
  border: 1px solid #000000;
  color: ${({color}) => color ? color : 'black'};
  font-size: ${({size}) => size ? size + 'px' : 'inherit'};
  -webkit-box-shadow: 0px 3px 0px 0px rgba(0,0,0,1);
  -moz-box-shadow: 0px 3px 0px 0px rgba(0,0,0,1);
  box-shadow: 0px 3px 0px 0px rgba(0,0,0,1);
  svg {
    width: 100%; /* Адаптивная ширина для SVG */
    height: 100%;
  }
`;
export const Border = styled.div.withConfig({
  shouldForwardProp: prop => !['color','raduis'].includes(prop)
})<{ color: string,raduis?:number, width?:number }>`
  border: ${({ width }) => width?width:"1"}px solid ${({ color }) => color};
  width: 100%;
  border-radius: ${({raduis})=>raduis?raduis:0}px;
  margin-top: 20px;
  margin-bottom: 20px;
  height: auto;
  padding: 17px;
`;

export const ButtonWithBg = styled.div.withConfig({
  shouldForwardProp: prop => !['bgColor','textColor'].includes(prop)
})<{ bgColor: string,textColor?:string }>`
border: 1px solid #000000;
box-shadow: 0 2px 2px #000000;
background-color: ${({bgColor}) => bgColor};
border-radius: 8px;
margin: 0 5px;
font-family: var(--font);
font-size: 20px;
font-weight: 500;
padding: 7px 12px;
color: ${({textColor}) => textColor ? textColor : 'var(--color-black)'};
& a {
  height: 100%;
  width: 100%;
  color: inherit;
  text-decoration: none;
  padding: 7px 12px;
  display: inline-block;
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
}
`;
