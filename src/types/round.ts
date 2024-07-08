export interface Round {
  data: [
    {
      id: number;
      name: string;
      gameType: string;
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
              playerA1: {
                id: number;
                name: string;
              };
              playerA2: {
                id: number;
                name: string;
              };
              playerB1: {
                id: number;
                name: string;
              };
              playerB2: {
                id: number;
                name: string;
              };
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
  ];
  meta: {
    pagination: {
      pageCount: number;
    };
  };
}
