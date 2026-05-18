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
  padding: 0.5rem 1.5rem 2rem 1.5rem;
  box-sizing: border-box;
  animation: ${slideUp} 0.3s ease-out;
  display: flex;
  flex-direction: column;
`;

export const HandleBar = styled.div`
  width: 2.5rem;
  height: 0.25rem;
  background-color: #e0e0e0;
  border-radius: 2px;
  margin: 0 auto 1.5rem auto;
`;

export const Title = styled.h2`
  ${({ theme }) => theme.fonts?.Bold20 || "700 20px sans-serif"};
  color: ${({ theme }) => theme.colors?.Black || "#000000"};
  margin: 0 0 1rem 0;
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
  aspect-ratio: 7 / 5.2;
  border-radius: 0.75rem;
  background-color: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors?.Orange00 : "#FAFAFA"};
  color: ${({ $isSelected, theme }) =>
    $isSelected ? theme.colors?.Black02 : "#C0C0C0"};
  border: 1px solid
    ${({ $isSelected, theme }) =>
      $isSelected ? theme.colors?.Orange01 : "#FAFAFA"};
  ${({ theme }) => theme.fonts?.SemiBold14};
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

export const SubmitButton = styled.button<{ $active: boolean }>`
  width: 100%;
  height: 3.5rem;
  border-radius: 0.75rem;
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.Orange01 : theme.colors.Black02};
  color: ${({ theme }) => theme.colors?.White || "#FFFFFF"};
  ${({ theme }) => theme.fonts?.Bold16 || "700 16px sans-serif"};
  border: none;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
`;

// 가로 스크롤 및 숨김 처리
export const SelectedListScroll = styled.div`
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 1rem;

  /* 스크롤바 숨기기 (선택사항) */
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const SelectedPill = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 10px;
  gap: 0.2rem;
  border: 1px solid #ff5c39; /* 메인 테마색 */
  color: ${({ theme }) => theme.colors?.Orange01};
  border-radius: 0.6rem;
  ${({ theme }) => theme.fonts?.Bold14};
`;

export const PillDeleteBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 6px;
  color: #c4c4c4;
  cursor: pointer;
  background-color: #c0c0c0;
  width: 1rem;
  height: 1rem;
  border-radius: 1rem;
  font-size: 0.65rem;
  color: white;
  font-weight: bold;
`;
