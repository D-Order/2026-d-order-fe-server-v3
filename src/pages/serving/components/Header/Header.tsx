import * as S from "./Header.styled";

import { IMAGE_CONSTANTS } from "@constants/ImageConstants";

const Header = () => {
  return (
    <S.Wrapper>
      <S.Title>멋쟁이사자처럼</S.Title>
      <S.ExitBtn src={IMAGE_CONSTANTS.ExitBtn} />
    </S.Wrapper>
  );
};

export default Header;
