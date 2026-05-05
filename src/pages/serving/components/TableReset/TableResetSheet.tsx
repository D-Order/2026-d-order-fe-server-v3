import { useMemo, useState } from "react";
import * as S from "./TableResetSheet.styled";

import { IMAGE_CONSTANTS } from "@constants/ImageConstants";
interface TableResetSheetProps {
  onClose: () => void;
  onSubmit: (tableNumber: string) => Promise<boolean>;
  validTables: number[];
  onInvalidSubmit?: (message: string) => void;
}

const TableResetSheet = ({ onClose, onSubmit, validTables, onInvalidSubmit }: TableResetSheetProps) => {
  const [tableNumber, setTableNumber] = useState("");

  const isValidTableNumber = useMemo(() => {
    const n = Number(tableNumber);
    if (!Number.isInteger(n) || n <= 0) return false;
    return validTables.includes(n);
  }, [tableNumber, validTables]);

  const handleKeyPress = (val: string) => {
    if (tableNumber.length < 3) setTableNumber((prev) => prev + val);
  };

  const handleDelete = () => {
    setTableNumber((prev) => prev.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (!isValidTableNumber) {
      onInvalidSubmit?.("주문 내역이 없는 테이블 번호입니다");
      return;
    }

    const success = await onSubmit(tableNumber);
    if (success) {
      onClose();
    }
  };

  return (
    <S.Overlay onClick={onClose}>
      <S.SheetContainer onClick={(e) => e.stopPropagation()}>
        <S.HandleBar />

        <S.InputBox>
          {tableNumber ? (
            <S.InputText>{tableNumber}</S.InputText>
          ) : (
            <S.Placeholder>테이블 번호를 입력해주세요</S.Placeholder>
          )}
        </S.InputBox>
        <S.KeypadGrid>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <S.KeyButton key={num} onClick={() => handleKeyPress(num.toString())}>
              {num}
            </S.KeyButton>
          ))}
          <S.KeyButton>
            <img src={IMAGE_CONSTANTS.nomalKokkiri} alt="kokkiri" />
          </S.KeyButton>
          <S.KeyButton onClick={() => handleKeyPress("0")}>0</S.KeyButton>
          <S.KeyButton onClick={handleDelete}>
            <img src={IMAGE_CONSTANTS.deleteKey} alt="delete" style={{ width: 30 }} />
          </S.KeyButton>
        </S.KeypadGrid>
        <S.SubmitButton type="button" $active={isValidTableNumber} disabled={!isValidTableNumber} onClick={handleSubmit}>
          선택완료
        </S.SubmitButton>
      </S.SheetContainer>
    </S.Overlay>
  );
};

export default TableResetSheet;
