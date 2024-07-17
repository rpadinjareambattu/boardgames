"use client";
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
import { useEffect, useState } from "react";
import useApiService from "@/service/useApiService";
import { useRouter } from "next/router";
import Head from "next/head";
import { TeamData } from "@/types/team";
import { RoundData } from "@/types/round";

interface TableData {
  id: number;
  teamId?: number;
  name?: string;
  points: number;
  played?: number;
  won?: number;
  lost?: number;
}

interface PageProps {
  name: string;
}
type StatusType = "played" | "won" | "lost" | "points";

const LeaderBoard: React.FC<PageProps> = ({ name }) => {
  const router = useRouter();
  const { game, tournament, tab } = router.query;
  const [tableData, setTableData] = useState<TableData[]>([]);

  const { data, loading, error } = useApiService<RoundData>(
    "v3-rounds?" +
      (game === "prediction"
        ? "populate[roundDetails][populate][players][populate][players][fields]=name"
        : "queryType=matches") +
      "&filters[v_3_tournament][$eq]=" +
      tournament,
    tournament != ""
  );
  const { data: teamData, loading: teamLoading } = useApiService<TeamData>(
    `teams?filters[v3tournaments][$eq]=${tournament}&populate[players][fields][0]=name&fields[0]=id`,
    tournament != ""
  );

  useEffect(() => {
    if (teamData && !tableData.length && data) {
      if (data?.data[0]?.roundDetails?.length) {
        const dd: TableData[] = [];
        data?.data[0]?.roundDetails[0]?.players?.forEach(
          ({ id, players, score }) => {
            const tt: TableData = {
              id,
              name: players.reduce((acc, player, index) => {
                return acc + (index > 0 ? " and " : "") + player.name;
              }, ""),
              points: score,
            };
            dd.push(tt);
          }
        );
        return setTableData([...tableData, ...dd]);
      } else {
        const dd: TableData[] = [];
        teamData.data.forEach((element) => {
          element.players.forEach(({ id, name }) => {
            const tt: TableData = {
              id,
              name: name,
              teamId: element.id,
              points: calcTeamStat(id, "points", data),
              played: calcTeamStat(id, "played", data),
              won: calcTeamStat(id, "won", data),
              lost: calcTeamStat(id, "lost", data),
            };
            dd.push(tt);
          });
        });
        return setTableData([...tableData, ...dd]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamData, data]);
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

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Head>
        <title>Points Table | {name} </title>
      </Head>
      <main className="flex min-h-screen flex-col items-center max-md:text-sm">
        <div className="container flex flex-wrap max-w-6xl px-6 pb-5">
          {game === "prediction" && !tableData.length && !loading ? (
            <div className="w-full p-8 bg-white border-2 rounded-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl lg:text-4xl block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                  Results
                </span>{" "}
                Are On Their Way!
              </h2>
              <h2 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl dark:text-white">
                We appreciate your enthusiasm and participation.
              </h2>
              <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">
                Our team is working hard to finalize the results. Check back
                soon to see if you are one of the winners!
              </p>
            </div>
          ) : (
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
                        <small>Name</small>
                      </TableCell>
                      {game != "prediction" && (
                        <>
                          <TableCell className="!py-1" align="center">
                            <small>
                              M<span className="max-md:hidden">atch </span>P
                              <span className="max-md:hidden">layed</span>
                            </small>
                          </TableCell>
                          <TableCell className="!py-1" align="center">
                            <small>
                              W<span className="max-md:hidden">on</span>
                            </small>
                          </TableCell>
                          <TableCell className="!py-1" align="center">
                            <small>
                              L<span className="max-md:hidden">ost</span>
                            </small>
                          </TableCell>
                        </>
                      )}
                      <TableCell className="!py-1" align="center">
                        <small>
                          P<span className="max-md:hidden">oints</span>
                          <span className="md:hidden">ts</span>
                        </small>
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
                            {game != "prediction" && (
                              <>
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
                              </>
                            )}
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
          )}

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

export default LeaderBoard;

const calcTeamStat = (
  id: number,
  status: StatusType,
  data: RoundData
): number => {
  let played = 0;
  let won = 0;
  let lost = 0;
  let points = 0;

  data?.data.forEach((round) => {
    round.matches?.forEach((match) => {
      let sMatchPoints =
        match.teamAScore > match.teamBScore
          ? match.teamAScore
          : match.teamBScore;
      match.sub_matches.forEach((subMatch) => {
        if (
          subMatch.playersA.some((player) => player.id === id) &&
          subMatch.teamAScore !== undefined
        ) {
          played++;
          if (subMatch.teamAScore > subMatch.teamBScore) {
            won++;
            points += sMatchPoints;
          } else if (subMatch.teamAScore < subMatch.teamBScore) {
            lost++;
            points -= Number((sMatchPoints / 2).toFixed(1));
          }
        }
        if (
          subMatch.playersB.some((player) => player.id === id) &&
          subMatch.teamBScore !== undefined
        ) {
          played++;
          if (subMatch.teamBScore > subMatch.teamAScore) {
            won++;
            points += sMatchPoints;
          } else if (subMatch.teamBScore < subMatch.teamAScore) {
            lost++;
            points -= Number((sMatchPoints / 2).toFixed(1));
          }
        }
      });
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
