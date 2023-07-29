export interface RankProps {
  date: string;
  member: string[];
  color: string;
}

export const dummydata = {
  title: "와우랩 여름 휴가 대작전",
  rank: [
    {
      date: "11. 11(수)",
      member: ["이준규", "최다현", "봉승우", "권시경", "홍길동", "로봇토끼"],
      color: "#2C5BF7",
    },
    {
      date: "11. 12(목)",
      member: ["이준규", "최다현", "봉승우"],
      color: "#3654B9",
    },
    {
      date: "11. 13(금)",
      member: ["이준규", "최다현"],
      color: "#08268C",
    },
  ],
};

export const dummyVoteData = {
  title: "여름 휴가 장소 투표",
  list: [
    { title: "코타키나발루" },
    { title: "세부" },
    { title: "괌" },
    { title: "태국" },
    { title: "싱가폴" },
  ],
};

export const dummyUrl = "http://localhost:3000";
