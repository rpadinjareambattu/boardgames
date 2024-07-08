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
import { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import useApiService from "@/service/useApiService";
import { useRouter } from "next/router";
import Head from "next/head";
import { Round } from "@/types/round";

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
interface BannerProps {
  name: string;
}
const PointsTable: React.FC<BannerProps> = ({ name }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { game, tournament, tab } = router.query;
  const [tableData, setTableData] = useState<TableData[]>([]);
  const played: GameTypes = {
    chess: 3,
    ludo: 3,
    carroms: 5,
    snakeAndLadder: 5,
  };
  const { data, loading, error } = useApiService<Round>(
    "rounds?populate=matches.teamA,matches.teamB&filters[gameType][$eq]=" +
      game +
      "&filters[tournament][$eq]=" +
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
          points: calcPoints(id),
          played: calcPlayed(id),
        };
        dd.push(tt);
      });
      return setTableData(dd);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tLoading, loading, game]);
  const calcPoints = (id: number) => {
    let p = 0;

    console.log("-->", data);
    data?.data.map((round) => {
      round.matches.map((match) => {
        if (match.teamA.id === id) {
          p += match?.teamAScore;
        }
        if (match.teamB.id === id) {
          p += match?.teamBScore;
        }
      });
    });
    return p;
  };
  const calcPlayed = (id: number) => {
    let p = 0;
    data?.data.map((round) => {
      round.matches.map((match) => {
        if (match.teamA.id === id) {
          if (match?.teamAScore != undefined) {
            p++;
          }
        }
        if (match.teamB.id === id) {
          if (match?.teamBScore != undefined) {
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
                            {"/"}
                            {(played as any)[String(game)]}
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
