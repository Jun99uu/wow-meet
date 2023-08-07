import styled from "@emotion/styled";
import { CELL_HEIGHT, CELL_WIDTH } from "~/components/Meeting/Table/const";
import { COLORS } from "~/styles/colors";

const GET_COLOR_BY_WEIGHT = (weight: number) => {
  if (weight === 0) return COLORS.grey100;
  else if (weight === 1) return COLORS.blue1;
  else if (weight === 2) return COLORS.blue2;
  else if (weight >= 3) return COLORS.blue3;
};

interface DateCellProps {
  id: string;
  weight: number;
  onSelect?: (id: string) => void;
  onClick?: (id: string) => void;
  isMySeleted: boolean;
}

const DateCell = (props: DateCellProps) => {
  const dragEnter = (id: string) => {
    props.onSelect?.(id);
  };

  return (
    <CellContainer
      weight={props.weight}
      mySelected={props.isMySeleted}
      onClick={() => props.onClick?.(props.id)}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => dragEnter(props.id)}
      draggable
    />
  );
};

export default DateCell;

const CellContainer = styled.div`
  width: ${CELL_WIDTH};
  height: ${CELL_HEIGHT};
  border: 1px dotted gray;
  background-color: ${({
    weight,
    mySelected,
  }: {
    weight: number;
    mySelected: boolean;
  }) => (mySelected ? COLORS.black : GET_COLOR_BY_WEIGHT(weight))};
  display: table-cell;
`;
