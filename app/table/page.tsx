"use client";
import { format } from "date-fns";
import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import useApiService from "../service/useApiService";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Item {
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
}
interface Team {
  data: [
    {
      id: number;
      attributes: {
        name: string;
        points: number;
      };
    }
  ];
}
interface TableData {
  id: number;
  name: string;
  points: number;
  played: number;
}
interface GameList {
  data: [
    {
      id: number;
      attributes: {
        name: string;
        isActive: boolean;
      };
    }
  ];
}
interface GameTypes {
  chess: number;
  ludo: number;
  carroms: number;
  snakeAndLadder: number;
}
export default function About() {
  const searchParams = useSearchParams();
  let game = searchParams.get("game") || "";
  const router = useRouter();
  const pathname = usePathname();
  const gameInput = useRef<HTMLSelectElement>(null);
  const [tableData, setTableData] = useState<TableData[]>([]);
  const played: GameTypes = {
    chess: 3,
    ludo: 3,
    carroms: 5,
    snakeAndLadder: 5,
  };
  const { data, loading, error } = useApiService<Item>(
    "rounds?populate=matches.teamA,matches.teamB&filters[gameType][$eq]=" +
      game,
    game != ""
  );
  const { data: tData, loading: tLoading } = useApiService<Team>("teams");
  const { data: gameList, loading: gameListLoading } =
    useApiService<GameList>("games");
  useEffect(() => {
    if (!loading && !tLoading && data && tData) {
      const dd: TableData[] = [];
      tData.data.map(({ id, attributes }) => {
        const tt: TableData = {
          id,
          name: attributes.name,
          points: calcPoints(id),
          played: calcPlayed(id),
        };
        dd.push(tt);
      });
      return setTableData(dd);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tLoading, loading]);
  const calcPoints = (id: number) => {
    let p = 0;
    data?.data.map((round) => {
      round.attributes.matches.data.map((match) => {
        if (match.attributes.teamA.data.id === id) {
          p += match.attributes?.teamAScore;
        }
        if (match.attributes.teamB.data.id === id) {
          p += match.attributes?.teamBScore;
        }
      });
    });
    return p;
  };
  const calcPlayed = (id: number) => {
    let p = 0;
    data?.data.map((round) => {
      round.attributes.matches.data.map((match) => {
        if (match.attributes.teamA.data.id === id) {
          if (match.attributes?.teamAScore != undefined) {
            p++;
          }
        }
        if (match.attributes.teamB.data.id === id) {
          if (match.attributes?.teamBScore != undefined) {
            p++;
          }
        }
      });
    });
    return p;
  };
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const gameType = event.target.value;
    router.push(pathname + "?" + createQueryString("game", gameType));
  };
  if (loading)
    return (
      <div className="min-h-screen justify-center items-center flex">
        <CircularProgress color="secondary" />
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;

  return (
    <main className="flex min-h-screen flex-col items-center  max-md:px-4 max-md:text-sm">
      <div>
        <div className="flex flex-wrap">
          <code className="font-mono font-bold from-zinc-200 flex-1 content-center max-md:col my-6">
            Board Game Bonanza Season 2
          </code>
          <div className="md:flex-none flex items-center max-md:flex-initial max-md:w-1/3 pl-2">
            {!gameListLoading && (
              <select
                onChange={handleChange}
                ref={gameInput}
                name="team"
                defaultValue={game}
                className="bg-gray-50 capitalize border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                {gameList?.data.map((t) => (
                  <option key={t.id} value={t.attributes.name}>
                    {t.attributes.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        <TableContainer component={Paper} className="justify-center flex">
          <Table
            sx={{
              width: { xs: "100%", md: "800px" },
            }}
            aria-label="simple table"
          >
            <TableHead className="thead">
              <TableRow>
                <TableCell className="!py-1 !max-w-10 w-5">
                  <small>#</small>
                </TableCell>
                <TableCell className="!py-1">
                  <small>Team</small>
                </TableCell>
                <TableCell className="!py-1" align="center">
                  <small>Played</small>
                </TableCell>
                <TableCell className="!py-1" align="center">
                  <small>Points</small>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData
                ?.sort((a, b) => b.points - a.points)
                .map((team, i) => {
                  return (
                    <TableRow key={team.id}>
                      <TableCell
                        component="th"
                        scope="row"
                        className="!py-2 !max-w-10"
                      >
                        {i + 1}
                      </TableCell>
                      <TableCell component="th" scope="row" className="!py-2">
                        {team.name}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        className="!py-2"
                        align="center"
                      >
                        {team.played}
                        {"/"}
                        {(played as any)[game]}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        className="!py-2"
                        align="center"
                      >
                        {team.points}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </main>
  );
}
