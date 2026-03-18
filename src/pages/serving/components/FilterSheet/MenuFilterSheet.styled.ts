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
    max-width: 500px; /* 모바일 환경 고려 */
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
    color: ${({ theme }) => theme.colors?.Black || "#000000"};
    margin: 0 0 1.5rem 0;
`;

export const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.75rem;
    margin-bottom: 2rem;
    max-height: 50vh;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 0.25rem; /* 스크롤바 너비 */
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
    display: none;
    }
`;

export const MenuItem = styled.button<{ $isSelected: boolean }>`
    aspect-ratio: 1 / 1;
    border-radius: 0.75rem;
    background-color: ${({ $isSelected, theme }) => 
        $isSelected ? (theme.colors?.Orange01 || "#FF6B00") : "#F8F8F8"};
    color: ${({ $isSelected, theme }) => 
        $isSelected ? (theme.colors?.White || "#FFFFFF") : "#A0A0A0"};
    border: none;
    font: ${({ theme }) => theme.fonts?.SemiBold14 || "600 14px sans-serif"};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    line-height: 1.3;
    padding: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
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