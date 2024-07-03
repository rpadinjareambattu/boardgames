"use client";

import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  capitalize,
  CircularProgress,
} from "@mui/material";
import Filter from "./filter";
import FormattedDate from "./formattedDate";
import useApiService from "@/service/useApiService";
import { Round } from "@/types/round";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";
interface BannerProps {
  name: string;
}
const Matches: React.FC<BannerProps> = ({ name }) => {
  const router = useRouter();
  const { game, date, team, tournament, tab } = router.query;
  useEffect(() => {
    if (!tab && tournament) {
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, tab: "matches" },
        },
        undefined,
        { shallow: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  const { data, loading } = useApiService<Round>(
    "rounds?populate=matches.teamA,matches.teamB,matches.sub_matches.playerA1,matches.sub_matches.playerA2,matches.sub_matches.playerB1,matches.sub_matches.playerB2&filters[gameType][$eq]=" +
      game,
    game != ""
  );
  return (
    <>
      <Head>
        <title>Matches | {name} </title>
      </Head>
      <main className="flex min-h-screen flex-col items-center max-md:text-sm pb-11">
        <div className="container flex flex-wrap max-w-6xl px-6">
          <TableContainer component={Paper} className="justify-center flex">
            {data?.meta.pagination.pageCount !== 0 && (
              <Table
                sx={{
                  width: { xs: "300px", sm: "100%" },
                }}
                aria-label="simple table"
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
                                    String(date)
                                  ).toDateString();
                                  return itemDate === filterDateStr;
                                }
                              ).length && (
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
                                              {sMatch.attributes.playerA2
                                                ?.data &&
                                                `and ${sMatch.attributes.playerA2?.data?.attributes.name} `}
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
                                              {sMatch.attributes.playerB2
                                                ?.data &&
                                                `and ${sMatch.attributes.playerB2?.data?.attributes.name} `}
                                            </span>
                                          </TableCell>
                                        </TableRow>
                                      </>
                                    ))}
                                </TableBody>
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
            <div className="mt-20 w-full justify-center items-center flex">
              <CircularProgress color="secondary" />
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Matches;
