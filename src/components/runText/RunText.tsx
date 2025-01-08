import React from 'react';
import styled from 'styled-components';
const RunningText = styled.div`
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    box-sizing: border-box;
    background-color: #C71C1C;
    color: white;
    padding: 8px 0;
    width: 100%;
    font-size: 24px;
    z-index: 3;
    border: 1px solid black;
    line-height: 24px;
    &:after {
        content: '';
        display: inline-block;
        width: 100%;
    }

    span {
     font-family: "Roboto Condensed", sans-serif;
        display: inline-block;
        animation: marquee 30s linear infinite;
    }

    @keyframes marquee {
        0% {
            transform: translate(0, 0);
        }
        100% {
            transform: translate(-100%, 0);
        }
    }
        @media (max-width: 1024px) {
        transform: translateY(30px);
        line-height:24px
}
`;


interface RunTextProps {
    text: string;
}

const RunText: React.FC<RunTextProps> = ({ text }) => {
    return (
        <RunningText>
            <span>{text}</span>
            <span>{text}</span>
        </RunningText>
    );
};

export default RunText;