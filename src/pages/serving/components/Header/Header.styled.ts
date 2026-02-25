import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: fit-content;
  background-color: ${({ theme }) => theme.colors.White};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1rem;
  box-sizing: border-box;
  border-bottom: 1px solid ${({ theme }) => theme.colors.BorderGray};
`;

export const Title = styled.h1`
  ${({ theme }) => theme.fonts.Bold18};
  color: ${({ theme }) => theme.colors.Black02};
`;

export const ExitBtn = styled.img`
  width: 20px;
  height: 20px;
`;
