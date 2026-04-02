import styled from "styled-components";

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: fit-content;
  background-color: ${({ theme }) => theme.colors.Bg};
  box-sizing: border-box;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const TopRow = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

export const TopRowTitle = styled.p`
  ${({ theme }) => theme.fonts.Bold18};
  color: ${({ theme }) => theme.colors.Black01};
`;

export const RefreshButton = styled.button`
  ${({ theme }) => theme.fonts.SemiBold14};
  color: ${({ theme }) => theme.colors.Black01};
  background: ${({ theme }) => theme.colors.White};
  border: none;
  border-radius: 0.75rem;
  padding: 0.5rem 0.75rem;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.05);
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const NoDataWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  gap: 2rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export const NoDataImage = styled.img`
  width: 10rem;
  height: 6rem;
  object-fit: contain;
`;

export const NoDataText = styled.p`
  ${({ theme }) => theme.fonts.ExtraBold24};
  color: ${({ theme }) => theme.colors.Focused};
  text-align: center;
  line-height: 2;
  white-space: pre-line;
`;
