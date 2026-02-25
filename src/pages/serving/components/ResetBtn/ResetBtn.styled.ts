import styled from "styled-components";

export const Wrapper = styled.button`
  position: fixed;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: fit-content;
  height: fit-content;
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.White};
  border-radius: 1.125rem;
  ${({ theme }) => theme.fonts.ExtraBold16};
  color: ${({ theme }) => theme.colors.Orange01};
  border: 1.5px solid ${({ theme }) => theme.colors.Orange01};
  opacity: 0.9;
  box-sizing: border-box;
  padding: 1rem 2rem;
  box-shadow: 0 10px 20px 0 rgba(255, 110, 63, 0.15);
  backdrop-filter: blur(5px);
  cursor: pointer;
`;

export const ResetBtnIcon = styled.img`
  width: 1.5rem;
  height: 1.5rem;
  object-fit: contain;
`;
