import styled from "styled-components";

import { IMAGE_CONSTANTS } from "@constants/ImageConstants";

const Header = () => {
  const boothName = "멋쟁이사자처럼";
  return (
    <Wrapper>
      <Title>{boothName}</Title>
      <ExitBtn src={IMAGE_CONSTANTS.ExitBtn} />
    </Wrapper>
  );
};

export default Header;

export const Wrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;

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
