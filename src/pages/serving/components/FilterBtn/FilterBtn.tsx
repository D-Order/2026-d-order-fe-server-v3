// components/FilterBtn/FilterBtn.tsx
import * as S from "./FilterBtn.styled";
import { IMAGE_CONSTANTS } from "@constants/ImageConstants";

interface FilterBtnProps {
    onMenuClick: () => void;
    onTableClick: () => void;
    // 🌟 부모로부터 선택된 필터 정보를 받습니다
    selectedMenuName?: string; 
    selectedTableRanges?: { start: string; end: string }[];
    onMenuClear?: (e: React.MouseEvent) => void;
    onTableClear?: (e: React.MouseEvent) => void;
    }

const FilterBtn = ({
    onMenuClick,
    onTableClick,
    selectedMenuName,
    selectedTableRanges,
    onMenuClear,
    onTableClear,
    }: FilterBtnProps) => {
    
    // 테이블 범위 텍스트 포맷팅 함수
    const getTableFilterText = () => {
        if (!selectedTableRanges || selectedTableRanges.length === 0) return "테이블";
        const firstRange = `${selectedTableRanges[0].start}~${selectedTableRanges[0].end}`;
        if (selectedTableRanges.length === 1) return firstRange;
        return `${firstRange} 외 ${selectedTableRanges.length - 1}건`;
    };

    const isMenuSelected = !!selectedMenuName;
    const isTableSelected = !!(selectedTableRanges && selectedTableRanges.length > 0);
    return (
        <S.Wrapper>
        <S.FilterButton $isActive={isMenuSelected} onClick={onMenuClick}>
            <S.FilterIcon src={IMAGE_CONSTANTS.FilterIcon} />
            <S.ButtonText>{isMenuSelected ? selectedMenuName : "메뉴"}</S.ButtonText>
            {isMenuSelected && (
            <S.ClearIcon onClick={onMenuClear}>×</S.ClearIcon>
            )}
        </S.FilterButton>

        <S.FilterButton $isActive={isTableSelected} onClick={onTableClick}>
            <S.FilterIcon src={IMAGE_CONSTANTS.FilterIcon} />
            <S.ButtonText>{getTableFilterText()}</S.ButtonText>
            {isTableSelected && (
            <S.ClearIcon onClick={onTableClear}>×</S.ClearIcon>
            )}
        </S.FilterButton>
        </S.Wrapper>
    );
};

export default FilterBtn;