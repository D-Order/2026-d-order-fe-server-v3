// components/FilterSheet/TableFilterSheet.tsx
import { useState, useEffect } from "react";
import * as S from "./TableFilterSheet.styled";
import sadKokkiri from "@assets/images/sadKokkiri.png";
import { getTableNum } from "../../apis/getTableNum"; // API import

interface Range {
    start: string;
    end: string;
}

interface TableFilterSheetProps {
    onClose: () => void;
    initialRanges: Range[];
    onApply: (ranges: Range[]) => void;
}

const TableFilterSheet = ({ onClose, initialRanges, onApply }: TableFilterSheetProps) => {
    const [ranges, setRanges] = useState<Range[]>(initialRanges);
    const [startTable, setStartTable] = useState("");
    const [endTable, setEndTable] = useState("");
    const [activeInput, setActiveInput] = useState<"start" | "end">("start");
    
    // 최대 테이블 개수 상태
    const [maxTable, setMaxTable] = useState<number | null>(null);

    // API 호출하여 최대 테이블 수 가져오기
    useEffect(() => {
        const fetchMaxTable = async () => {
            try {
                const max = await getTableNum();
                setMaxTable(max);
            } catch (error) {
                console.error("테이블 정보를 불러오지 못했습니다.", error);
            }
        };
        fetchMaxTable();
    }, []);

    const handleKeyPress = (val: string) => {
        const targetValue = activeInput === "start" ? startTable : endTable;
        const newValue = targetValue + val;
        const newNum = parseInt(newValue, 10);

        // 🌟 방어 로직: 입력된 값이 maxTable을 넘어가면 무시
        if (maxTable && newNum > maxTable) {
            // 원한다면 여기에 토스트 메시지를 띄울 수도 있습니다. "최대 테이블 번호는 N번입니다."
            return; 
        }

        if (activeInput === "start") {
            if (startTable.length < 3) setStartTable(newValue);
        } else {
            if (endTable.length < 3) setEndTable(newValue);
        }
    };

    const handleDelete = () => {
        if (activeInput === "start") {
            setStartTable((prev) => prev.slice(0, -1));
        } else {
            setEndTable((prev) => prev.slice(0, -1));
        }
    };

    const removeRange = (index: number) => {
        setRanges((prev) => prev.filter((_, i) => i !== index));
    };

    // // 현재 입력 중인 범위를 배열로 확정
    // const confirmRange = () => {
    //     if (startTable && endTable) {
    //         // 시작 번호가 끝 번호보다 크면 스왑
    //         const start = parseInt(startTable, 10);
    //         const end = parseInt(endTable, 10);
            
    //         const finalStart = Math.min(start, end).toString();
    //         const finalEnd = Math.max(start, end).toString();

    //         setRanges((prev) => [...prev, { start: finalStart, end: finalEnd }]);
    //         // 입력창 초기화
    //         setStartTable("");
    //         setEndTable("");
    //         setActiveInput("start");
    //     }
    // };

    const handleComplete = () => {
        let finalRanges = [...ranges];
        // 만약 작성 중인 범위가 있다면 포함해서 저장
        if (startTable && endTable) {
            const start = parseInt(startTable, 10);
            const end = parseInt(endTable, 10);
            finalRanges.push({ 
                start: Math.min(start, end).toString(), 
                end: Math.max(start, end).toString() 
            });
        }
        onApply(finalRanges);
        onClose();
    };

    return (
        <S.Overlay onClick={onClose}>
            <S.SheetContainer onClick={(e) => e.stopPropagation()}>
                <S.HandleBar />
                <S.Title>테이블 선택 {maxTable && `(최대 ${maxTable}번)`}</S.Title>

                {/* 선택된 테이블 범위 리스트 */}
                {ranges.length > 0 && (
                    <S.SelectedListScroll>
                        {ranges.map((r, i) => (
                            <S.SelectedPill key={i}>
                                {r.start}~{r.end}
                                <S.PillDeleteBtn onClick={() => removeRange(i)}>×</S.PillDeleteBtn>
                            </S.SelectedPill>
                        ))}
                    </S.SelectedListScroll>
                )}

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
                    <S.KeyButton>
                        <img src={sadKokkiri} alt="kokkiri" />
                    </S.KeyButton>
                    <S.KeyButton onClick={() => handleKeyPress("0")}>0</S.KeyButton>
                    <S.KeyButton onClick={handleDelete}>⌫</S.KeyButton>
                </S.KeypadGrid>

                <S.SubmitButton onClick={handleComplete}>선택완료</S.SubmitButton>
            </S.SheetContainer>
        </S.Overlay>
    );
};

export default TableFilterSheet;