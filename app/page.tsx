"use client";
import Image from "next/image";
import { format } from "date-fns";
import useApiService from "./service/useApiService";
import {
  CircularProgress,
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
}
export default function Home() {
  const { data, loading, error } = useApiService<Item>(
    "rounds?populate=matches.teamA,matches.teamB,matches.sub_matches.playerA1,matches.sub_matches.playerA2,matches.sub_matches.playerB1,matches.sub_matches.playerB2"
  );
  if (loading)
    return (
      <div className="min-h-screen justify-center items-center flex">
        <CircularProgress color="secondary" />
      </div>
    );
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
          <Table
            sx={{
              width: { xs: "300px",  md: "800px" },
              marginBottom: { xs: "60px", md: 0 },
            }}
            aria-label="simple table"
          >
            <TableHead className="thead">
              <TableCell colSpan={4} className="!py-1">
                <small>Fixtures and Results</small>
              </TableCell>
            </TableHead>
            {data?.data
              .sort((a, b) =>
                b.attributes.name.localeCompare(a.attributes.name)
              )
              .map((round) => (
                <>
                  {round.attributes.matches.data.map((match) => (
                    <>
                      <TableHead>
                        <TableRow className="header">
                          <TableCell>
                            <strong>
                              {capitalize(round.attributes.gameType)}
                            </strong>
                            {" - "}
                            {round.attributes.name}
                          </TableCell>
                          <TableCell align="right">
                            <span
                              className={
                                match.attributes.teamAScore === 3
                                  ? "text-green-700"
                                  : ""
                              }
                            >
                              {match.attributes.teamA.data.attributes.name}
                            </span>
                          </TableCell>
                          <TableCell align="center">
                            <span
                              className={
                                match.attributes.teamAScore === 3
                                  ? "text-green-700"
                                  : ""
                              }
                            >
                              {match.attributes.teamAScore != undefined
                                ? match.attributes.teamAScore
                                : "-"}{" "}
                            </span>
                            {" - "}
                            <span
                              className={
                                match.attributes.teamBScore === 3
                                  ? "text-green-700"
                                  : ""
                              }
                            >
                              {match.attributes.teamBScore != undefined
                                ? match.attributes.teamBScore
                                : "-"}
                            </span>
                          </TableCell>
                          <TableCell className="pv6" align="left">
                            <span
                              className={
                                match.attributes.teamBScore === 3
                                  ? "text-green-700"
                                  : ""
                              }
                            >
                              {match.attributes.teamB.data.attributes.name}
                            </span>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {match.attributes.sub_matches.data
                          .sort(
                            (a, b) =>
                              new Date(b.attributes.date).getTime() -
                              new Date(a.attributes.date).getTime()
                          )
                          .map((sMatch) => (
                            <>
                              <TableRow key={round.attributes.name}>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  className="!py-2 !pr-0"
                                  align="right"
                                >
                                  <small className="border-r-2 block pr-4">
                                    {sMatch.attributes.matchType} <br />
                                    <FormattedDate
                                      isoDateString={sMatch.attributes.date}
                                      dateFormat="MMM dd - hh:mm a"
                                    />
                                  </small>
                                </TableCell>
                                <TableCell align="right" sx={{ padding: {xs: 1, sm: 2}}}>
                                  <span
                                    className={
                                      sMatch.attributes.teamAScore >= 2
                                        ? "text-green-700"
                                        : ""
                                    }
                                  >
                                    {
                                      sMatch.attributes.playerA1?.data
                                        ?.attributes.name
                                    }{" "}
                                    and{" "}
                                    {
                                      sMatch.attributes.playerA2?.data
                                        ?.attributes.name
                                    }{" "}
                                  </span>
                                  {/* <br /> */}
                                </TableCell>
                                <TableCell
                                  sx={{ minWidth: "65px" }}
                                  align="center"
                                >
                                  <span
                                    className={
                                      sMatch.attributes.teamAScore >= 2
                                        ? "text-green-700"
                                        : ""
                                    }
                                  >
                                    {sMatch.attributes.teamAScore != undefined
                                      ? sMatch.attributes.teamAScore
                                      : "--"}
                                  </span>
                                  {" - "}
                                  <span
                                    className={
                                      sMatch.attributes.teamBScore >= 2
                                        ? "text-green-700"
                                        : ""
                                    }
                                  >
                                    {sMatch.attributes.teamBScore != undefined
                                      ? sMatch.attributes.teamBScore
                                      : "--"}
                                  </span>
                                </TableCell>
                                <TableCell align="left" sx={{ padding: {xs: 1, sm: 2}}}>
                                  <span
                                    className={
                                      sMatch.attributes.teamBScore >= 2
                                        ? "text-green-700"
                                        : ""
                                    }
                                  >
                                    {
                                      sMatch.attributes.playerB1?.data
                                        ?.attributes.name
                                    }{" "}
                                    and{" "}
                                    {
                                      sMatch.attributes.playerB2?.data
                                        ?.attributes.name
                                    }
                                  </span>
                                </TableCell>
                              </TableRow>
                            </>
                          ))}
                      </TableBody>
                    </>
                  ))}
                  {!round.attributes.matches.data.length && (
                    <TableBody className="header">
                      <TableRow key={round.attributes.name}>
                        <TableCell
                          colSpan={4}
                          component="th"
                          scope="row"
                          align="center"
                        >
                          <strong>
                            {capitalize(round.attributes.gameType)}
                          </strong>
                          {" - "}
                          {round.attributes.name} {" - TBD"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
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

  return <span>{formattedDate ? formattedDate : "TBD"}</span>;
};
