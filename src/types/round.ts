export interface RoundData {
  data: [Round];
  meta: {
    pagination: {
      pageCount: number;
    };
  };
}
export interface Round {
  id: number;
  name: string;
  gameType: Name;
  matches: [
    {
      id: number;
      sub_matches: [
        {
          id: number;
          matchType: string;
          date: string;
          teamAScore: number;
          teamBScore: number;
          playersA: [NameAndId];
          playersB: [NameAndId];
        }
      ];
      teamA: {
        id: number;
        name: string;
      };
      teamB: {
        id: number;
        name: string;
      };
      teamAScore: number;
      teamBScore: number;
    }
  ];
}

export interface Name {
  name: string;
}
export interface NameAndId {
  name: string;
  id: number;
}
