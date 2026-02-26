import * as S from "./FilterBtn.styled";
import { IMAGE_CONSTANTS } from "@constants/ImageConstants";

interface FilterBtnProps {
    onMenuClick: () => void;
    onTableClick: () => void;
}

const FilterBtn = ({ onMenuClick, onTableClick }: FilterBtnProps) => {
    return (
        <S.Wrapper>
            <S.FilterButton onClick={onMenuClick}>
                <S.FilterIcon src={IMAGE_CONSTANTS.FilterIcon} />
                메뉴
            </S.FilterButton>
            <S.FilterButton onClick={onTableClick}>
                <S.FilterIcon src={IMAGE_CONSTANTS.FilterIcon} />
                테이블
            </S.FilterButton>
        </S.Wrapper>
    );
};

export default FilterBtn;