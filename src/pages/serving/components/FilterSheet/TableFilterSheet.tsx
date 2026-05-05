import { useState } from "react";
import * as S from "./TableFilterSheet.styled";
import sadKokkiri from "@assets/images/sadKokkiri.png";

interface Range {
    start: string;
    end: string;
}

interface NumericRange {
    start: number;
    end: number;
}

interface TableFilterSheetProps {
    onClose: () => void;
    tableOptions: number[];
    initialRanges: Range[];
    onApply: (ranges: Range[]) => void;
}

const normalizeRange = (range: NumericRange): NumericRange => ({
    start: Math.min(range.start, range.end),
    end: Math.max(range.start, range.end),
});

const intersectRange = (existing: NumericRange, incoming: NumericRange): NumericRange | null => {
    const current = normalizeRange(existing);
    const next = normalizeRange(incoming);
    const start = Math.max(current.start, next.start);
    const end = Math.min(current.end, next.end);

    if (start > end) return null;

    return { start, end };
};

const applyNarrowingRange = (existingRanges: NumericRange[], incomingRange: NumericRange): NumericRange[] => {
    const normalizedIncoming = normalizeRange(incomingRange);

    if (existingRanges.length === 0) {
        return [normalizedIncoming];
    }

    const nextRanges: NumericRange[] = [];
    let hasIntersection = false;

    existingRanges.forEach((range) => {
        const intersection = intersectRange(range, normalizedIncoming);

        if (intersection) {
            nextRanges.push(intersection);
            hasIntersection = true;
            return;
        }

        nextRanges.push(normalizeRange(range));
    });

    if (!hasIntersection) {
        nextRanges.push(normalizedIncoming);
    }

    return nextRanges.sort((a, b) => a.start - b.start);
};

const TableFilterSheet = ({ onClose, tableOptions, initialRanges, onApply }: TableFilterSheetProps) => {
    const [ranges, setRanges] = useState<Range[]>(initialRanges);
    const [startTable, setStartTable] = useState("");
    const [endTable, setEndTable] = useState("");
    const [activeInput, setActiveInput] = useState<"start" | "end">("start");

    const maxTable = tableOptions.length > 0 ? Math.max(...tableOptions) : null;
    const minTable = tableOptions.length > 0 ? Math.min(...tableOptions) : null;

    const isValidRangeInput = (() => {
        if (minTable === null || maxTable === null) return false;
        const start = Number(startTable);
        const end = Number(endTable);
        if (!Number.isInteger(start) || !Number.isInteger(end)) return false;
        return start >= minTable && start <= maxTable && end >= minTable && end <= maxTable;
    })();

    const hasValidRangeToSubmit = ranges.length > 0 || isValidRangeInput;

    const handleKeyPress = (val: string) => {
        const targetValue = activeInput === "start" ? startTable : endTable;
        const newValue = targetValue + val;
        const newNum = parseInt(newValue, 10);

        if (maxTable !== null && newNum > maxTable) return;

        if (activeInput === "start") {
        if (startTable.length < 3) setStartTable(newValue);
        } else {
        if (endTable.length < 3) setEndTable(newValue);
        }
    };

    const handleDelete = () => {
        if (activeInput === "start") setStartTable((prev) => prev.slice(0, -1));
        else setEndTable((prev) => prev.slice(0, -1));
    };

    const removeRange = (index: number) => {
        const next = ranges.filter((_, i) => i !== index);
        setRanges(next);
        onApply(next);
    };

    const handleComplete = () => {
        if (!hasValidRangeToSubmit) return;

        const numericRanges: NumericRange[] = ranges
        .map((r) => ({ start: Number(r.start), end: Number(r.end) }))
        .filter((r) => Number.isInteger(r.start) && Number.isInteger(r.end));

        const nextRanges = isValidRangeInput
            ? applyNarrowingRange(numericRanges, { start: Number(startTable), end: Number(endTable) })
            : numericRanges.map(normalizeRange).sort((a, b) => a.start - b.start);

        onApply(nextRanges.map((range) => ({ start: String(range.start), end: String(range.end) })));
        onClose();
    };

    return (
        <S.Overlay onClick={onClose}>
        <S.SheetContainer onClick={(e) => e.stopPropagation()}>
            <S.HandleBar />
            <S.Title>테이블 선택 {maxTable && `(최대 ${maxTable}번)`}</S.Title>

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
            <S.RangeBox $isActive={activeInput === "start"} onClick={() => setActiveInput("start")}>
                {startTable}
            </S.RangeBox>
            <S.Tilde>~</S.Tilde>
            <S.RangeBox $isActive={activeInput === "end"} onClick={() => setActiveInput("end")}>
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

            <S.SubmitButton type="button" $active={hasValidRangeToSubmit} disabled={!hasValidRangeToSubmit} onClick={handleComplete}>
            선택완료
            </S.SubmitButton>
        </S.SheetContainer>
        </S.Overlay>
    );
};

export default TableFilterSheet;
