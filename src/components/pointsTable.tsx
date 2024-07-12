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
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import useApiService from "@/service/useApiService";
import { useRouter } from "next/router";
import Head from "next/head";
import { RoundData } from "@/types/round";

interface TableData {
  id: number;
  name: string;
  points: number;
  played: number;
  won: number; 
  lost: number; 
}

interface GameTypes {
  chess: number;
  ludo: number;
  carroms: number;
  snakeAndLadder: number;
}
interface BannerProps {
  name: string;
}
type StatusType = "played" | "won" | "lost" | "points";

const PointsTable: React.FC<BannerProps> = ({ name }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { game, tournament, tab } = router.query;
  const [tableData, setTableData] = useState<TableData[]>([]);

  const { data, loading, error } = useApiService<RoundData>(
    "v3-rounds?queryType=matches&filters[gameType][name][$eq]=" +
      game +
      "&filters[v_3_tournament][$eq]=" +
      tournament,
    game != "" && tournament != ""
  );
  const { data: tData, loading: tLoading } = useApiService<TeamData>(
    "teams",
    true
  );

  useEffect(() => {
    if (!tab && tournament) {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, tab: "table" },
        },
        undefined,
        { shallow: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  useEffect(() => {
    if (!loading && !tLoading && data && tData) {
      const dd: TableData[] = [];
      tData.data.map(({ id, name }) => {
        const tt: TableData = {
          id,
          name: name,
          points: calcTeamStat(id, "points"),
          played: calcTeamStat(id, "played"),
          won: calcTeamStat(id, "won"),
          lost: calcTeamStat(id, "lost"),
        };
        dd.push(tt);
      });
      return setTableData(dd);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tLoading, loading, game]);

  const calcTeamStat = (id: number, status: StatusType): number => {
    let played = 0;
    let won = 0;
    let lost = 0;
    let points = 0;

    data?.data.forEach((round) => {
      round?.matches.forEach((match) => {
        if (match.teamA.id === id && match?.teamAScore !== undefined) {
          played++;
          if (match.teamAScore > match.teamBScore) {
            won++;
            points += match?.teamAScore;
          } else if (match.teamAScore < match.teamBScore) {
            lost++;
          }
        }
        if (match.teamB.id === id && match?.teamBScore !== undefined) {
          played++;
          if (match.teamBScore > match.teamAScore) {
            won++;
            points += match?.teamBScore;
          } else if (match.teamBScore < match.teamAScore) {
            lost++;
          }
        }
      });
    });

    switch (status) {
      case "played":
        return played;
      case "won":
        return won;
      case "lost":
        return lost;
      case "points":
        return points;
      default:
        return 0;
    }
  };
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Head>
        <title>Points Table | {name} </title>
      </Head>
      <main className="flex min-h-screen flex-col items-center max-md:text-sm">
        <div className="container flex flex-wrap max-w-6xl px-6">
          <TableContainer component={Paper} className="justify-center flex">
            {!loading && (
              <Table
                sx={{
                  width: { xs: "100%", sm: "100%" },
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
                      <small>Won</small>
                    </TableCell>
                    <TableCell className="!py-1" align="center">
                      <small>Lost</small>
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
                          <TableCell
                            component="th"
                            scope="row"
                            className="!py-2"
                          >
                            {team.name}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className="!py-2"
                            align="center"
                          >
                            {team.played}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className="!py-2"
                            align="center"
                          >
                            {team.won}
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            className="!py-2"
                            align="center"
                          >
                            {team.lost}
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
            )}
          </TableContainer>

          {loading && (
            <div className="mt-20 w-full justify-center items-center flex">
              <CircularProgress color="secondary" />
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default PointsTable;
