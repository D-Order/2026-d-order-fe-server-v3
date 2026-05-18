// components/FilterSheet/MenuFilterSheet.tsx
import { useState, useEffect } from "react";
import * as S from "./MenuFilterSheet.styled";
import { isVisibleServingFilterMenu, ServingFilterMenuOption } from "../../apis/servingApi";

interface MenuFilterSheetProps {
    onClose: () => void;
    menuOptions: ServingFilterMenuOption[];
    initialSelectedMenus: string[];
    onApply: (selectedNames: string[]) => void;
}

const MenuFilterSheet = ({ onClose, menuOptions, initialSelectedMenus, onApply }: MenuFilterSheetProps) => {
    const [selectedMenus, setSelectedMenus] = useState<string[]>(initialSelectedMenus);
    const hasSelection = selectedMenus.length > 0;

    useEffect(() => {
        setSelectedMenus(initialSelectedMenus);
    }, [initialSelectedMenus]);

    const toggleMenu = (menuName: string) => {
        setSelectedMenus((prev) =>
            prev.includes(menuName)
                ? prev.filter((selectedName) => selectedName !== menuName)
                : [...prev, menuName]
        );
    };

    const handleComplete = () => {
        if (!hasSelection) return;
        onApply(selectedMenus);
        onClose();
    };

    return (
        <S.Overlay onClick={onClose}>
            <S.SheetContainer onClick={(e) => e.stopPropagation()}>
                <S.HandleBar />
                <S.Title>메뉴 선택</S.Title>

                {/* 선택된 메뉴 리스트 (가로 스크롤) */}
                {selectedMenus.length > 0 && (
                    <S.SelectedListScroll>
                        {selectedMenus.map((menuName) => {
                            return (
                                <S.SelectedPill key={menuName}>
                                    {menuName.replace("\n", " ")}
                                    <S.PillDeleteBtn onClick={() => {
                                        const next = selectedMenus.filter((selectedName) => selectedName !== menuName);
                                        setSelectedMenus(next);
                                        onApply(next);
                                    }}>×</S.PillDeleteBtn>
                                </S.SelectedPill>
                            );
                        })}
                    </S.SelectedListScroll>
                )}

                {/* 메뉴 목록 렌더링 */}
                <S.GridContainer>
                    {menuOptions.filter(isVisibleServingFilterMenu).map((menu) => (
                            <S.MenuItem
                                key={menu.id}
                                $isSelected={selectedMenus.includes(menu.name)}
                                onClick={() => toggleMenu(menu.name)}
                            >
                                {menu.name.split("\n").map((line, idx) => (
                                    <span key={idx}>{line}</span>
                                ))}
                            </S.MenuItem>
                        ))}
                </S.GridContainer>

                <S.SubmitButton
                    type="button"
                    $active={hasSelection}
                    disabled={!hasSelection}
                    onClick={handleComplete}
                >
                    선택완료
                </S.SubmitButton>
            </S.SheetContainer>
        </S.Overlay>
    );
};

export default MenuFilterSheet;
