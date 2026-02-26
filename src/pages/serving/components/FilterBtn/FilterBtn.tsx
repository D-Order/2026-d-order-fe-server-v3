import * as S from "./FilterBtn.styled";

import { IMAGE_CONSTANTS } from "@constants/ImageConstants";

const FilterBtn = () => {
    return (
        <S.Wrapper>
            <S.FilterButton>
                <S.FilterIcon src={IMAGE_CONSTANTS.FilterIcon} />
                메뉴
            </S.FilterButton>
            <S.FilterButton>
                <S.FilterIcon src={IMAGE_CONSTANTS.FilterIcon} />
                테이블
            </S.FilterButton>
        </S.Wrapper>
    );
};

export default FilterBtn;
