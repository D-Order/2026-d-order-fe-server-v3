import { useState } from "react";
import * as S from "./TableFilterSheet.styled";
import sadKokkiri from "@assets/images/sadKokkiri.png";

interface TableFilterSheetProps {
    onClose: () => void;
}

const TableFilterSheet = ({ onClose }: TableFilterSheetProps) => {
    const [startTable, setStartTable] = useState("");
    const [endTable, setEndTable] = useState("");
    const [activeInput, setActiveInput] = useState<"start" | "end">("start");

    const handleKeyPress = (val: string) => {
        if (activeInput === "start") {
            if (startTable.length < 3) setStartTable((prev) => prev + val);
        } else {
            if (endTable.length < 3) setEndTable((prev) => prev + val);
        }
    };

    const handleDelete = () => {
        if (activeInput === "start") {
            setStartTable((prev) => prev.slice(0, -1));
        } else {
            setEndTable((prev) => prev.slice(0, -1));
        }
    };

    return (
        <S.Overlay onClick={onClose}>
            <S.SheetContainer onClick={(e) => e.stopPropagation()}>
                <S.HandleBar />
                <S.Title>테이블 선택</S.Title>
                
                <S.InputRow>
                    <S.RangeBox 
                        $isActive={activeInput === "start"} 
                        onClick={() => setActiveInput("start")}
                    >
                        {startTable}
                    </S.RangeBox>
                    <S.Tilde>~</S.Tilde>
                    <S.RangeBox 
                        $isActive={activeInput === "end"} 
                        onClick={() => setActiveInput("end")}
                    >
                        {endTable}
                    </S.RangeBox>
                </S.InputRow>

                <S.KeypadGrid>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <S.KeyButton key={num} onClick={() => handleKeyPress(num.toString())}>
                            {num}
                        </S.KeyButton>
                    ))}
                    {/* 코끼리 아이콘 */}
                    <S.KeyButton>
                        <img src={sadKokkiri} alt="kokkiri" />
                    </S.KeyButton>
                    <S.KeyButton onClick={() => handleKeyPress("0")}>0</S.KeyButton>
                    {/* 지우기 버튼 */}
                    <S.KeyButton onClick={handleDelete}>
                        ⌫
                    </S.KeyButton>
                </S.KeypadGrid>

                <S.SubmitButton onClick={onClose}>선택완료</S.SubmitButton>
            </S.SheetContainer>
        </S.Overlay>
    );
};

export default TableFilterSheet;