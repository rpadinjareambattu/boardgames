export interface TournamentData {
  data: Tournament;
}
export interface Tournament {
  id: number;
  attributes: {
    name: string;
    isActive: boolean;
    views: number;
    startDate: string;
    endDate: string;
    cover: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
    games: {
      data: [
        {
          id: number;
          attributes: {
            name: string;
          };
        }
      ];
    };
    activeGame: {
      data: {
        id: number;
      };
    };
  };
}
export interface TournamentToUpdate {
  data: {
    views: number;
  };
}
