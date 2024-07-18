import { NameAndId } from "./round";

export interface TeamData {
  data: [
    {
      id: number;
      name: string;
      points: number;
      players: [NameAndId];
    }
  ];
}
