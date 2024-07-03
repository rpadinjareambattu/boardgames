export interface Round {
  data: [
    {
      id: number;
      attributes: {
        name: string;
        gameType: string;
        matches: {
          data: [
            {
              id: number;
              attributes: {
                sub_matches: {
                  data: [
                    {
                      id: number;
                      attributes: {
                        matchType: string;
                        date: string;
                        teamAScore: number;
                        teamBScore: number;
                        playerA1: {
                          data: {
                            id: number;
                            attributes: {
                              name: string;
                            };
                          };
                        };
                        playerA2: {
                          data: {
                            id: number;
                            attributes: {
                              name: string;
                            };
                          };
                        };
                        playerB1: {
                          data: {
                            id: number;
                            attributes: {
                              name: string;
                            };
                          };
                        };
                        playerB2: {
                          data: {
                            id: number;
                            attributes: {
                              name: string;
                            };
                          };
                        };
                      };
                    }
                  ];
                };
                teamA: {
                  data: {
                    id: number;
                    attributes: {
                      name: string;
                    };
                  };
                };
                teamB: {
                  data: {
                    id: number;
                    attributes: {
                      name: string;
                    };
                  };
                };
                teamAScore: number;
                teamBScore: number;
              };
            }
          ];
        };
      };
    }
  ];
  meta: {
    pagination: {
      pageCount: number;
    };
  };
}
