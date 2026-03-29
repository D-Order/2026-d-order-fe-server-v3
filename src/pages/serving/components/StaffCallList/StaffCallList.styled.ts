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
