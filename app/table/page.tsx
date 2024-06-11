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
import { useEffect, useState } from "react";

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
export default function About() {
  const [tableData, setTableData] = useState<TableData[]>([]);
  const { data, loading, error } = useApiService<Item>(
    "rounds?populate=matches.teamA,matches.teamB,"
  );
  const { data: tData, loading: tLoading } = useApiService<Team>("teams");
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
  if (loading)
    return (
      <div className="min-h-screen justify-center items-center flex">
        <CircularProgress color="secondary" />
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div>
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
                        {"/5"}
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
