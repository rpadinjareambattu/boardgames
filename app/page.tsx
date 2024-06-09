"use client";
import Image from "next/image";
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
import { useSearchParams } from "next/navigation";
import Header from "./header";
import useApiService from "./service/useApiService";

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

export default function Page() {
  const searchParams = useSearchParams();
  let date = searchParams.get("date") || "";
  let team = searchParams.get("team") || "";
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
    <main className="flex min-h-screen flex-col items-center">
      <div className="mb-14">
        <code className="font-mono font-bold from-zinc-200 pb-4 pt-8 block">
          Board Game Bonanza Season 2
        </code>
        <TableContainer component={Paper}>
          <Table
            sx={{
              width: { xs: "300px", md: "800px" },
              marginBottom: { xs: "60px", md: 0 },
            }}
            aria-label="simple table"
          >
            <TableHead className="thead">
              <TableCell colSpan={3} className="!py-1">
                <small>Fixtures and Results</small>
              </TableCell>
              <TableCell colSpan={1} className="!py-1" align="right">
                <Filter />
              </TableCell>
            </TableHead>
            {data?.data
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
                    .map((match) => (
                      <>
                        {!!match.attributes.sub_matches.data.filter((item) => {
                          if (!date) return true;
                          const itemDate = new Date(
                            item.attributes.date
                          ).toDateString();
                          const filterDateStr = new Date(date).toDateString();
                          return itemDate === filterDateStr;
                        }).length && (
                          <>
                            <TableHead>
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
                                <TableCell className="pv6 !py-1" align="left">
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
                            </TableHead>
                            <TableBody>
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
                                          {sMatch.attributes.teamAScore !=
                                          undefined
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
                        )}
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
