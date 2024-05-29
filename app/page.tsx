"use client";
import Image from "next/image";
import { format } from "date-fns";
import useApiService from "./service/useApiService";
import { useEffect } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  capitalize,
} from "@mui/material";

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
                sub_matches: {
                  data: [
                    {
                      id: number;
                      attributes: {
                        matchType: string;
                        date: string;
                        teamAScore: string;
                        teamBScore: string;
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
}
export default function Home() {
  const { data, loading, error } = useApiService<Item>(
    "rounds?populate=matches.teamA,matches.teamB,matches.sub_matches.playerA1,matches.sub_matches.playerA2,matches.sub_matches.playerB1,matches.sub_matches.playerB2"
  );
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <main className="flex min-h-screen flex-col items-center pt-10">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <code className="font-mono font-bold">
            <Image
              src="/Seidor.png"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </code>
        </p>
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <code className="font-mono font-bold">
            Board Game Bonanza Season 2
          </code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0">
            By{" "}
            <Image
              src="/sraddha.png"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>
      <div className="my-14">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className="thead">
              <TableCell colSpan={2} className="!py-1"></TableCell>
              <TableCell align="center" className="!py-1">
                <small>Game points</small>
              </TableCell>
              <TableCell align="center" className="!py-1">
                <small>Match points</small>
              </TableCell>
            </TableHead>
            {data?.data.map((round) => (
              <>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={4}>
                      <strong>{capitalize(round.attributes.gameType)}</strong>
                      {" - "}
                      {round.attributes.name}
                    </TableCell>
                  </TableRow>
                </TableHead>
                {round.attributes.matches.data.map((match) => (
                  <>
                    <TableHead>
                      <TableRow className="header">
                        <TableCell colSpan={3} className="pv6">
                          {match.attributes.teamA.data.attributes.name} <br />
                          {match.attributes.teamB.data.attributes.name}
                        </TableCell>
                        <TableCell align="center" className="pv6">
                          {match.attributes.teamAScore
                            ? match.attributes.teamAScore
                            : "--"}{" "}
                          <br />
                          {match.attributes.teamBScore
                            ? match.attributes.teamBScore
                            : "--"}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* {data.data.map((item) => ( */}
                      {match.attributes.sub_matches.data.map((sMatch) => (
                        <>
                          <TableRow key={round.attributes.name}>
                            <TableCell component="th" scope="row">
                              <small>
                                {sMatch.attributes.matchType} <br />
                                <FormattedDate
                                  isoDateString={sMatch.attributes.date}
                                  dateFormat="MMM dd - hh:mm a"
                                />
                              </small>
                            </TableCell>
                            <TableCell>
                              {
                                sMatch.attributes.playerA1?.data?.attributes
                                  .name
                              }{" "}
                              and{" "}
                              {
                                sMatch.attributes.playerA2?.data?.attributes
                                  .name
                              }{" "}
                              <br />
                              {
                                sMatch.attributes.playerB1?.data?.attributes
                                  .name
                              }{" "}
                              and{" "}
                              {
                                sMatch.attributes.playerB2?.data?.attributes
                                  .name
                              }
                            </TableCell>
                            <TableCell align="center">
                              {sMatch.attributes.teamAScore
                                ? sMatch.attributes.teamAScore
                                : "--"}
                              <br />
                              {sMatch.attributes.teamBScore
                                ? sMatch.attributes.teamBScore
                                : "--"}
                            </TableCell>
                            <TableCell align="right"></TableCell>
                          </TableRow>
                        </>
                      ))}
                    </TableBody>
                  </>
                ))}
              </>
            ))}
          </Table>
        </TableContainer>
      </div>
    </main>
  );
}

interface FormattedDateProps {
  isoDateString: string;
  dateFormat?: string;
}

const FormattedDate: React.FC<FormattedDateProps> = ({
  isoDateString,
  dateFormat = "yyyy-MM-dd HH:mm:ss",
}) => {
  const date = new Date(isoDateString);
  const formattedDate = format(date, dateFormat);

  return <span>{formattedDate}</span>;
};
