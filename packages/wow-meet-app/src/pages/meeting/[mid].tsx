import { css, type SerializedStyles } from "@emotion/react";
import styled from "@emotion/styled";
import { produce } from "immer";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { dummydata, dummyUrl } from "~/assets/dummydata";
import { Header } from "~/components/Bar";
import { Button } from "~/components/Create";
import Frame, { frameStyle } from "~/components/Frame";
import Caption from "~/components/Meeting/Caption";
import SummarizeBox from "~/components/Meeting/SummarizeBox";
import TimeTable from "~/components/Meeting/Table";
import {
  MOCK_UP_DAY_LIST,
  MOCK_UP_SELECTED_LIST,
  type ScheduleElement,
} from "~/components/Meeting/Table/MOCK";
import { Toast } from "~/components/Popup";
import { ToastType } from "~/components/Popup/Toast";
import { VoteTalk } from "~/components/Vote";
import { modeState, type Mode } from "~/store/modeAtom";
import { mq } from "~/styles/breakpoints";
import { COLORS } from "~/styles/colors";
import { TYPO } from "~/styles/typo";

type ComponentType = {
  mode: Mode;
  button: {
    title: string;
    style: SerializedStyles;
  };
};

const Meeting = () => {
  /**--- router ---*/
  const router = useRouter();

  /**--- config ---*/
  const buttonConfigs = {
    view: {
      title: "내 스케줄 입력하기",
      style: buttonStyles.view,
    },
    check: {
      title: "완료하고 스케줄보기",
      style: buttonStyles.check,
    },
  };

  /**--- state ---*/
  const [mode, setMode] = useAtom(modeState);
  const [mid, setMid] = useState(0);
  const [mySelectedDate, setMySelectedDate] = useState<ScheduleElement[]>([]);
  const [curComp, setCurComp] = useState<ComponentType>({
    mode: "View",
    button: buttonConfigs.view,
  });
  const [toast, setToast] = useState({
    open: false,
    content: "",
    type: ToastType.Postive,
  });

  /**--- function ---*/
  const settingMid = () => {
    if (router.query.mid) {
      const newMid = router.query.mid[0];
      setMid(Number(newMid));
    }
  };

  const clipboard = () => {
    try {
      void navigator.clipboard.writeText(`${dummyUrl}/meeting/${mid}`);
      setToast({
        open: true,
        content: "미팅 주소가 클립보드에 복사되었습니다!",
        type: ToastType.Postive,
      });
    } catch (error) {
      setToast({
        open: true,
        content: "미팅 주소 복사에 실패하였습니다.",
        type: ToastType.Negative,
      });
    }
  };

  const close = () => {
    setToast((prev) => {
      return {
        ...prev,
        open: false,
      };
    });
  };

  const changeMode = () => {
    switch (curComp.mode) {
      case "View":
        setCurComp({ mode: "Check", button: buttonConfigs.check });
        setMode("Check");
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "Check":
        setCurComp({ mode: "View", button: buttonConfigs.view });
        setMode("View");
        setMySelectedDate([]);
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
    }
  };

  const voting = () => {
    void router.push(`/meeting/${mid}/vote`);
  };

  const handlerTouchTimeSlot = (id: string) => {
    setMySelectedDate(
      produce((draft) => {
        const targetIdx = draft.findIndex((data) => data.date === id);
        if (targetIdx === -1) {
          draft.push({ date: id, weight: 1 });
        } else {
          draft.splice(targetIdx, 1);
        }
      })
    );
  };

  /**--- useEffect ---*/
  useEffect(() => {
    settingMid();
  }, [router.query.mid]);

  return (
    <Frame css={frameStyle}>
      <Header title={dummydata.title} sharing={clipboard} prev={changeMode} />
      {toast.open && <Toast {...toast} close={close} />}
      <Container>
        <SummarizeBox />
        <Caption />
        <TimeTable
          mode={mode}
          dayList={MOCK_UP_DAY_LIST}
          selectedList={MOCK_UP_SELECTED_LIST}
          mySelected={mySelectedDate}
          onSelect={handlerTouchTimeSlot}
        />
        <Button css={curComp.button.style} onClick={changeMode}>
          {curComp.button.title}
        </Button>
      </Container>
      <VoteTalk onClick={voting} />
    </Frame>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  gap: 1.5rem;

  padding: 0rem 2rem;
  ${mq[4]} {
    padding: 0rem;
  }
`;

const buttonStyles = {
  view: css`
    width: 100%;
    ${TYPO.text2.Bd};
    background-color: ${COLORS.grey600};
    color: white;
  `,
  check: css`
    width: 100%;
    ${TYPO.text2.Bd};
    background-color: ${COLORS.blue3};
    color: white;
  `,
};

export default Meeting;