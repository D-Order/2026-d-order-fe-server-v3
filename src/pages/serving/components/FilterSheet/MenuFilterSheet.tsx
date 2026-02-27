import { useState } from "react";
import * as S from "./MenuFilterSheet.styled";

interface MenuFilterSheetProps {
    onClose: () => void;
}

const MOCK_MENUS = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    name: "박지성의\n동동동"
}));

const MenuFilterSheet = ({ onClose }: MenuFilterSheetProps) => {
    const [selectedMenus, setSelectedMenus] = useState<number[]>([]);

    const toggleMenu = (id: number) => {
        setSelectedMenus((prev) => 
            prev.includes(id) ? prev.filter((menuId) => menuId !== id) : [...prev, id]
        );
    };

    return (
        <S.Overlay onClick={onClose}>
            <S.SheetContainer onClick={(e) => e.stopPropagation()}>
                <S.HandleBar />
                <S.Title>메뉴 선택</S.Title>
                
                <S.GridContainer>
                    {MOCK_MENUS.map((menu) => (
                        <S.MenuItem 
                            key={menu.id} 
                            $isSelected={selectedMenus.includes(menu.id)}
                            onClick={() => toggleMenu(menu.id)}
                        >
                            {menu.name.split('\n').map((line, idx) => (
                                <span key={idx}>{line}</span>
                            ))}
                        </S.MenuItem>
                    ))}
                </S.GridContainer>

                <S.SubmitButton onClick={onClose}>선택완료</S.SubmitButton>
            </S.SheetContainer>
        </S.Overlay>
    );
};

export default MenuFilterSheet;