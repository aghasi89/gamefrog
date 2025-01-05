import styled from 'styled-components';
import React, { useState } from 'react';
import  XcloseIcon from '../../assets/images/x-close.svg';
const ModalWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: white;
    padding: 48px;
    width: 617px;
    border-radius: 25px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    position: relative;
    flex-direction: column;
    display: flex;
    align-items: center;
    justify-content:space-between;
    gap: 20px;
    border: 1px solid #000  ;
    margin: 0 20px;
    @media (max-width: 768px) {
        padding: 24px 16px 16px 16px;
    }
`;

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
`;

type ModalProps = {
    children: React.ReactNode;
    onClose: () => void;
    style?:any
};


const Modal: React.FC<ModalProps> = ({ children, onClose,style }) => {
    return (
        <ModalWrapper onClick={onClose} style = {style}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}><img src={XcloseIcon}/></CloseButton>
                {children}
            </ModalContent>
        </ModalWrapper>
    );
};
export default Modal;