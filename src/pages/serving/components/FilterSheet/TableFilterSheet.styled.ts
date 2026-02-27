import styled, { keyframes } from "styled-components";

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
`;

export const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: flex-end;
`;

export const SheetContainer = styled.div`
    width: 100%;
    max-width: 500px;
    background-color: ${({ theme }) => theme.colors?.White || "#FFFFFF"};
    border-radius: 1.5rem 1.5rem 0 0;
    padding: 1rem 1.5rem 2rem 1.5rem;
    box-sizing: border-box;
    animation: ${slideUp} 0.3s ease-out;
    display: flex;
    flex-direction: column;
`;

export const HandleBar = styled.div`
    width: 2.5rem;
    height: 0.25rem;
    background-color: #E0E0E0;
    border-radius: 2px;
    margin: 0 auto 1.5rem auto;
`;

export const Title = styled.h2`
    font: ${({ theme }) => theme.fonts?.Bold20 || "700 20px sans-serif"};
    margin: 0 0 1.5rem 0;
`;

export const InputRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 2rem;
`;

export const RangeBox = styled.div<{ $isActive: boolean }>`
    flex: 1;
    height: 3.5rem;
    border-radius: 0.75rem;
    border: 1px solid ${({ $isActive, theme }) => 
        $isActive ? (theme.colors?.Orange01 || "#FF6B00") : "#E0E0E0"};
    display: flex;
    justify-content: center;
    align-items: center;
    font: ${({ theme }) => theme.fonts?.SemiBold16 || "600 20px sans-serif"};
    color: ${({ theme }) => theme.colors?.Black || "#000000"};
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors?.White || "#FFFFFF"};
`;

export const Tilde = styled.span`
    font: ${({ theme }) => theme.fonts?.Bold20 || "700 20px sans-serif"};
    color: #A0A0A0;
`;

export const KeypadGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin-bottom: 2rem;
`;

export const KeyButton = styled.button`
    aspect-ratio: 2 / 1;
    border-radius: 0.75rem;
    background-color: #F8F8F8;
    border: none;
    font: ${({ theme }) => theme.fonts?.Medium16 || "500 20px sans-serif"};
    color: #A0A0A0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:active {
        background-color: #EFEFEF;
    }
    
    img {
        width: 2.5rem;
        height: auto;
    }
`;

export const SubmitButton = styled.button`
    width: 100%;
    height: 3.5rem;
    border-radius: 0.75rem;
    background-color: ${({ theme }) => theme.colors?.Black || "#333333"};
    color: ${({ theme }) => theme.colors?.White || "#FFFFFF"};
    font: ${({ theme }) => theme.fonts?.Bold16 || "700 16px sans-serif"};
    border: none;
    cursor: pointer;
`;