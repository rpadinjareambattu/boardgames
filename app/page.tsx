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
  capitalize,
} from "@mui/material";
import Filter from "./filter";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Header from "./header";
import useApiService from "./service/useApiService";
import { useCallback, useEffect, useRef, useState } from "react";

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
  meta: {
    pagination: {
      pageCount: number;
    };
  };
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

export default function Page() {
  const searchParams = useSearchParams();
  let date = searchParams.get("date") || "";
  let team = searchParams.get("team") || "";
  let game = searchParams.get("game") || "";
  const router = useRouter();
  const pathname = usePathname();
  const gameInput = useRef<HTMLSelectElement>(null);
  const { data, loading, error } = useApiService<Item>(
    "rounds?populate=matches.teamA,matches.teamB,matches.sub_matches.playerA1,matches.sub_matches.playerA2,matches.sub_matches.playerB1,matches.sub_matches.playerB2&filters[gameType][$eq]=" +
      game,
    game != ""
  );
  const { data: gameList, loading: gameListLoading } =
    useApiService<GameList>("games");
  useEffect(() => {
    gameList?.data.forEach((element) => {
      if (element.attributes.isActive && game === "" && gameInput.current) {
        gameInput.current.value = element.attributes.name;
        router.push(
          pathname + "?" + createQueryString("game", element.attributes.name)
        );
      }
    });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameList, gameInput.current]);
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

  if (error) return <p>Error: {error.message}</p>;

  return (
    <main className="flex min-h-screen flex-col items-center max-md:px-4 max-md:text-sm">
      <div className="mb-14">
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
          {data?.meta.pagination.pageCount !== 0 && (
            <Table
              sx={{
                width: { xs: "300px", md: "800px" },
              }}
              aria-label="simple table"
              // className="bg-white shadow-lg shadow-black rounded-sm"
            >
              <TableHead className="thead">
                {data && !loading && (
                  <TableRow>
                    <TableCell colSpan={3} className="!py-1">
                      <small>Fixtures and Results</small>
                    </TableCell>
                    <TableCell colSpan={1} className="!py-1" align="right">
                      <Filter />
                    </TableCell>
                  </TableRow>
                )}
              </TableHead>
              {!loading &&
                data?.data
                  .sort((a, b) =>
                    b.attributes.name.localeCompare(a.attributes.name)
                  )
                  .map((round) => (
                    <>
                      {round.attributes.matches.data
                        .filter((match) => {
                          if (!team) return match;
                          return (
                            +team === match.attributes.teamA.data.id ||
                            +team === match.attributes.teamB.data.id
                          );
                        })
                        .map((match, i) => (
                          <>
                            {!!match.attributes.sub_matches.data.filter(
                              (item) => {
                                if (!date) return true;
                                const itemDate = new Date(
                                  item.attributes.date
                                ).toDateString();
                                const filterDateStr = new Date(
                                  date
                                ).toDateString();
                                return itemDate === filterDateStr;
                              }
                            ).length && (
                              <>
                                <TableBody key={`${i + 1000}`}>
                                  <TableRow className="header">
                                    <TableCell className="!py-1">
                                      <strong>
                                        {capitalize(round.attributes.gameType)}
                                      </strong>
                                      {" - "}
                                      {round.attributes.name}
                                    </TableCell>
                                    <TableCell className="!py-1" align="right">
                                      <span
                                        className={
                                          match.attributes.teamAScore === 3
                                            ? "text-green-700"
                                            : ""
                                        }
                                      >
                                        {
                                          match.attributes.teamA.data.attributes
                                            .name
                                        }
                                      </span>
                                    </TableCell>
                                    <TableCell className="!py-1" align="center">
                                      <span
                                        className={
                                          match.attributes.teamAScore === 3
                                            ? "text-green-700"
                                            : ""
                                        }
                                      >
                                        {match.attributes.teamAScore !=
                                        undefined
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
                                        {match.attributes.teamBScore !=
                                        undefined
                                          ? match.attributes.teamBScore
                                          : "-"}
                                      </span>
                                    </TableCell>
                                    <TableCell
                                      className="pv6 !py-1"
                                      align="left"
                                    >
                                      <span
                                        className={
                                          match.attributes.teamBScore === 3
                                            ? "text-green-700"
                                            : ""
                                        }
                                      >
                                        {
                                          match.attributes.teamB.data.attributes
                                            .name
                                        }
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                  {match.attributes.sub_matches.data
                                    .filter((item) => {
                                      if (!date) return item;
                                      const itemDate = new Date(
                                        item.attributes.date
                                      ).toDateString();
                                      const filterDateStr = new Date(
                                        date
                                      ).toDateString();
                                      return itemDate === filterDateStr;
                                    })
                                    .sort(
                                      (a, b) =>
                                        new Date(b.attributes.date).getTime() -
                                        new Date(a.attributes.date).getTime()
                                    )
                                    .map((sMatch, ii) => (
                                      <>
                                        <TableRow key={`${2000 + ii + i}`}>
                                          <TableCell
                                            scope="row"
                                            className="!py-2 !pr-0"
                                            align="right"
                                          >
                                            <small className="border-r-2 block pr-4">
                                              {sMatch.attributes.matchType}{" "}
                                              <br />
                                              <FormattedDate
                                                isoDateString={
                                                  sMatch.attributes.date
                                                }
                                                dateFormat="MMM dd - hh:mm a"
                                              />
                                            </small>
                                          </TableCell>
                                          <TableCell
                                            align="right"
                                            sx={{ padding: { xs: 1, sm: 2 } }}
                                          >
                                            <span
                                              className={
                                                sMatch.attributes.teamAScore >=
                                                2
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
                                                sMatch.attributes.teamAScore >=
                                                2
                                                  ? "text-green-700"
                                                  : ""
                                              }
                                            >
                                              {sMatch.attributes.teamAScore !=
                                              undefined
                                                ? sMatch.attributes.teamAScore
                                                : "--"}
                                            </span>
                                            {" - "}
                                            <span
                                              className={
                                                sMatch.attributes.teamBScore >=
                                                2
                                                  ? "text-green-700"
                                                  : ""
                                              }
                                            >
                                              {sMatch.attributes.teamBScore !=
                                              undefined
                                                ? sMatch.attributes.teamBScore
                                                : "--"}
                                            </span>
                                          </TableCell>
                                          <TableCell
                                            align="left"
                                            sx={{ padding: { xs: 1, sm: 2 } }}
                                          >
                                            <span
                                              className={
                                                sMatch.attributes.teamBScore >=
                                                2
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
                            )}
                          </>
                        ))}
                      {!round.attributes.matches.data.length && (
                        <TableBody className="header">
                          <TableRow key={round.attributes.name}>
                            <TableCell colSpan={4} scope="row" align="center">
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
          )}

          {data?.meta.pagination.pageCount === 0 && !loading && (
            <TableBody className="header">
              <TableRow>
                <TableCell colSpan={4} scope="row" align="center">
                  {"TBD"}
                </TableCell>
              </TableRow>
            </TableBody>
          )}
        </TableContainer>
        {loading && (
          <div className="mt-20 justify-center items-center flex">
            <CircularProgress color="secondary" />
          </div>
        )}
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
  if (isoDateString === null) return <span>TBD</span>;
  const date = new Date(isoDateString);
  const formattedDate = format(date, dateFormat);
  return <span>{formattedDate}</span>;
};
