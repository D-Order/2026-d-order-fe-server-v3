import * as S from "./ResetBtn.styled";

import { IMAGE_CONSTANTS } from "@constants/ImageConstants";

interface ResetBtnProps {
  isVisible: boolean;
}

const ResetBtn = ({ isVisible }: ResetBtnProps) => {
  return (
    <S.Wrapper $isVisible={isVisible}>
      <S.ResetBtnIcon src={IMAGE_CONSTANTS.ResetBtn} />
      테이블 초기화
    </S.Wrapper>
  );
};

export default ResetBtn;
