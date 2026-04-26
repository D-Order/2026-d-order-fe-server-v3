// components/FilterSheet/MenuFilterSheet.tsx
import { useState, useEffect } from "react";
import * as S from "./MenuFilterSheet.styled";
import { getMenuList, MenuItem } from "../../apis/getMenuList"; // API import

interface MenuFilterSheetProps {
    onClose: () => void;
    initialSelectedMenus: (number | string)[]; // ID가 숫자일수도, 문자일수도 있으므로
    onApply: (selectedIds: (number | string)[]) => void;
}

const MenuFilterSheet = ({ onClose, initialSelectedMenus, onApply }: MenuFilterSheetProps) => {
    const [selectedMenus, setSelectedMenus] = useState<(number | string)[]>(initialSelectedMenus);
    const [menuList, setMenuList] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const hasSelection = selectedMenus.length > 0;

    // API 호출하여 메뉴 목록 가져오기
    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await getMenuList();
                // 필요한 메뉴만 필터링하거나 전체를 사용할 수 있습니다.
                setMenuList(response.data);
            } catch (error) {
                console.error("메뉴 목록을 불러오지 못했습니다.", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMenus();
    }, []);

    const toggleMenu = (id: number | string) => {
        setSelectedMenus((prev) =>
            prev.includes(id) ? prev.filter((menuId) => menuId !== id) : [...prev, id]
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
                        {selectedMenus.map((id) => {
                            const menu = menuList.find((m) => m.id === id);
                            return (
                                <S.SelectedPill key={id}>
                                    {menu?.name.replace("\n", " ")}
                                    <S.PillDeleteBtn onClick={() => toggleMenu(id)}>×</S.PillDeleteBtn>
                                </S.SelectedPill>
                            );
                        })}
                    </S.SelectedListScroll>
                )}

                {/* 메뉴 목록 렌더링 */}
                <S.GridContainer>
                    {isLoading ? (
                        <div>메뉴를 불러오는 중입니다...</div>
                    ) : (
                        menuList.map((menu) => (
                            <S.MenuItem
                                key={menu.id}
                                $isSelected={selectedMenus.includes(menu.id)}
                                onClick={() => toggleMenu(menu.id)}
                            >
                                {/* 이름에 \n이 있으면 줄바꿈, 없으면 그대로 출력 */}
                                {menu.name.split("\n").map((line, idx) => (
                                    <span key={idx}>{line}</span>
                                ))}
                            </S.MenuItem>
                        ))
                    )}
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