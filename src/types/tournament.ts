import { Round } from "./round";

export interface TournamentData {
  data: Tournament;
  meta: {
    pagination: {
      pageCount: number;
    };
  };
}
export interface TournamentListData {
  data: [Tournament];
}
export interface Tournament {
  id: number;
  name: string;
  isActive: boolean;
  views: number;
  startDate: string;
  endDate: string;
  rounds: [Round];
  cover: {
    url: string;
  };
  gallery: [
    {
      url: string;
    }
  ];
  games: [
    {
      id: number;
      name: string;
    }
  ];
  activeGame: {
    id: number;
  };
}
export interface TournamentToUpdate {
  data: {
    views: number;
  };
}
