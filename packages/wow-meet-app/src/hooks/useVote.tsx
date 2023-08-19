import { useEffect, useState } from "react";
import { api } from "~/utils/api";

export type VoteItemType = {
  item: string;
  users: string[];
};

export type VoteConfigType = {
  voteList: VoteItemType[];
  userVote: string[];
  isVoted: (item: string, user: string) => boolean;
  vote: (item: string, user: string) => void;
  getTotalVoters: () => number;
  isChanged: () => boolean;
  innevitable: boolean;
  innevitableCheck: () => void;
  handleUpdateVoteList: (mid: string, userVote: string[]) => void;
};

export const useVote = (listArray: VoteItemType[]): VoteConfigType => {
  const [voteList, setVoteList] = useState<VoteItemType[]>(listArray);
  const [innevitable, setInnevitable] = useState(false);
  const [userVote, setUserVote] = useState<string[]>([]);

  const { data } = api.meeting.read.useQuery({
    meetingId: "clk2i27t80000ajufx0hsc633",
  });

  /** user가 item에 투표했는가? */
  const isVoted = (item: string, user: string): boolean => {
    const foundItem = voteList.find((voteItem) => voteItem.item === item);
    if (foundItem) {
      return foundItem.users.includes(user);
    }
    return false;
  };

  /** 화면에 보여지는 투표 후보들 관리하는 함수 */
  const manageAllVoteList = (item: string, user: string): void => {
    setVoteList((prevVoteList) => {
      const newVoteList = prevVoteList.map((voteItem) => {
        if (voteItem.item === item) {
          if (voteItem.users.includes(user)) {
            // user가 이미 투표했다면 투표를 제거
            return {
              ...voteItem,
              users: voteItem.users.filter((voter) => voter !== user),
            };
          } else {
            // user가 아직 투표하지 않았다면 투표를 추가
            return { ...voteItem, users: [...voteItem.users, user] };
          }
        }
        return voteItem;
      });

      return newVoteList;
    });
  };

  /** 사용자 한명의 투표 관리하는 함수 */
  const manageUserVoteList = (item: string): void => {
    setUserVote((prev) => {
      if (prev.includes(item)) return prev.filter((obj) => obj !== item);
      return [...prev, item];
    });
  };

  /** user가 item에 투표하기 */
  const vote = (item: string, user: string): void => {
    manageAllVoteList(item, user);
    manageUserVoteList(item);
  };

  /** 전체 투표자 수 구하는 함수 */
  const getTotalVoters = (): number => {
    const allVoters = new Set();
    voteList.forEach((voteItem) => {
      voteItem.users.forEach((user) => {
        allVoters.add(user);
      });
    });

    return allVoters.size;
  };

  const innevitableCheck = () => {
    setInnevitable((prev) => !prev);
  };

  const isChanged = () => {
    if (JSON.stringify(listArray) === JSON.stringify(voteList)) {
      return false;
    } else {
      return true;
    }
  };

  /** vote db 연동 */
  const updateVoteList = api.meeting.addVoteItem.useMutation({
    onSuccess(data) {
      console.log(data);
    },
    onError(err) {
      console.log(err);
    },
  });

  /** vote db 업데이트 함수 */
  const handleUpdateVoteList = (mid: string, userVote: string[]) => {
    updateVoteList.mutate({
      meetingId: mid,
      toBeAddedlist: userVote,
    });
  };

  useEffect(() => {
    getTotalVoters();
  }, [voteList]);

  return {
    voteList,
    userVote,
    isVoted,
    vote,
    getTotalVoters,
    isChanged,
    innevitable,
    innevitableCheck,
    handleUpdateVoteList,
  };
};
