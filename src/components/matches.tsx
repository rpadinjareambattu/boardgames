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
import { Round, RoundData } from "@/types/round";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";
import { Tournament, TournamentData } from "@/types/tournament";
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

  const { data, loading } = useApiService<RoundData>(
    "v3-rounds?queryType=matches&filters[gameType][name][$eq]=" +
      game +
      "&filters[v_3_tournament][$eq]=" +
      tournament,
    game != ""
  );
  return (
    <>
      <Head>
        <title>Matches | {name} </title>
      </Head>
      <main className="flex min-h-screen flex-col items-center max-md:text-xl pb-11">
        <div className="container flex flex-wrap max-w-6xl px-6">
          <TableContainer component={Paper} className="justify-center flex">
            {data?.meta?.pagination?.pageCount !== 0 && (
              <Table
                sx={{
                  width: { xs: "100%", sm: "100%" },
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
                    .sort((a, b) => b.name.localeCompare(a.name))
                    .map((round) => (
                      <>
                        {round.matches
                          .filter((match) => {
                            if (!team) return match;
                            return (
                              +team === match.teamA?.id ||
                              +team === match.teamB?.id
                            );
                          })
                          .map((match, i) => (
                            <>
                              {!!match.sub_matches.filter((item) => {
                                if (!date) return true;
                                const itemDate = new Date(
                                  item.date
                                ).toDateString();
                                const filterDateStr = new Date(
                                  String(date)
                                ).toDateString();
                                return itemDate === filterDateStr;
                              }).length && (
                                <TableBody key={`${i + 1000}`}>
                                  <TableRow className="header">
                                    <TableCell className="!py-1">
                                      <strong>
                                        {capitalize(round?.gameType.name)}
                                      </strong>
                                      {" - "}
                                      {round.name}
                                    </TableCell>
                                    <TableCell className="!py-1" align="right">
                                      <span
                                        className={
                                          match.teamAScore === 3
                                            ? "text-green-700"
                                            : ""
                                        }
                                      >
                                        {match.teamA.name}
                                      </span>
                                    </TableCell>
                                    <TableCell className="!py-1" align="center">
                                      <span
                                        className={
                                          match.teamAScore === 3
                                            ? "text-green-700"
                                            : ""
                                        }
                                      >
                                        {match.teamAScore != undefined
                                          ? match.teamAScore
                                          : "-"}{" "}
                                      </span>
                                      {" - "}
                                      <span
                                        className={
                                          match.teamBScore === 3
                                            ? "text-green-700"
                                            : ""
                                        }
                                      >
                                        {match.teamBScore != undefined
                                          ? match.teamBScore
                                          : "-"}
                                      </span>
                                    </TableCell>
                                    <TableCell
                                      className="pv6 !py-1"
                                      align="left"
                                    >
                                      <span
                                        className={
                                          match.teamBScore === 3
                                            ? "text-green-700"
                                            : ""
                                        }
                                      >
                                        {match.teamB.name}
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                  {match.sub_matches
                                    .filter((item) => {
                                      if (!date) return item;
                                      const itemDate = new Date(
                                        item.date
                                      ).toDateString();
                                      const filterDateStr = new Date(
                                        String(date)
                                      ).toDateString();
                                      return itemDate === filterDateStr;
                                    })
                                    .sort(
                                      (a, b) =>
                                        new Date(b.date).getTime() -
                                        new Date(a.date).getTime()
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
                                              {sMatch.matchType} <br />
                                              <FormattedDate
                                                isoDateString={sMatch.date}
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
                                                sMatch.teamAScore >= 2
                                                  ? "text-green-700"
                                                  : ""
                                              }
                                            >
                                              {sMatch.playersA.map((e, i) => {
                                                const and =
                                                  i === 0 ? `` : ` and `;
                                                return and + e.name;
                                              })}
                                            </span>
                                          </TableCell>
                                          <TableCell
                                            sx={{ minWidth: "65px" }}
                                            align="center"
                                          >
                                            <span
                                              className={
                                                sMatch.teamAScore >= 2
                                                  ? "text-green-700"
                                                  : ""
                                              }
                                            >
                                              {sMatch.teamAScore != undefined
                                                ? sMatch.teamAScore
                                                : "--"}
                                            </span>
                                            {" - "}
                                            <span
                                              className={
                                                sMatch.teamBScore >= 2
                                                  ? "text-green-700"
                                                  : ""
                                              }
                                            >
                                              {sMatch.teamBScore != undefined
                                                ? sMatch.teamBScore
                                                : "--"}
                                            </span>
                                          </TableCell>
                                          <TableCell
                                            align="left"
                                            sx={{ padding: { xs: 1, sm: 2 } }}
                                          >
                                            <span
                                              className={
                                                sMatch.teamBScore >= 2
                                                  ? "text-green-700"
                                                  : ""
                                              }
                                            >
                                              {sMatch.playersB.map((e, i) => {
                                                const and =
                                                  i === 0 ? `` : ` and `;
                                                return and + e.name;
                                              })}
                                            </span>
                                          </TableCell>
                                        </TableRow>
                                      </>
                                    ))}
                                </TableBody>
                              )}
                            </>
                          ))}
                        {!round.matches.length && (
                          <TableBody className="header">
                            <TableRow key={round.name}>
                              <TableCell colSpan={4} scope="row" align="center">
                                <strong>
                                  {capitalize(round?.gameType.name)}
                                </strong>
                                {" - "}
                                {round.name} {" - TBD"}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        )}
                      </>
                    ))}
              </Table>
            )}

            {data?.meta?.pagination?.pageCount === 0 && !loading && (
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
