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
import Filter from "../filter";
import { useSearchParams } from "next/navigation";
import Header from "../header";
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
        aPoints: number;
        bPoints: number;
      };
    }
  ];
}
interface TableData {
  id: number;
  name: string;
  points: number;
}
export default function About() {
  const [tableData, setTableData] = useState<TableData[] | null>([]);
  const { data, loading, error } = useApiService<Item>(
    "rounds?populate=matches.teamA,matches.teamB,"
  );
  const { data: tData } = useApiService<Team>("teams");
  useEffect(() => {
    if (!tData) return;
    if (!tableData?.length) {
      const dd: TableData[] | any = [];
      tData.data.map(({ id, attributes }) => {
        const tt: TableData = {
          id,
          name: attributes.name,
          points: 0,
        };
        dd.push(tt);
      });
      return setTableData(dd);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tData]);
  useEffect(() => {
    if (!tableData?.length) return;
    data?.data.map((round) => {
      round.attributes.matches.data.map((match) => {
        tableData.map((sDate) => {
          if (match.attributes.teamA.data.id === sDate.id) {
            sDate.points += match.attributes?.teamAScore;
          }
          if (match.attributes.teamB.data.id === sDate.id) {
            sDate.points += match.attributes?.teamBScore;
          }
        });
      });
    });
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableData, data]);
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
              <TableCell className="!py-1">
                <small>Team</small>
              </TableCell>
              <TableCell className="!py-1" align="right">
                <small>Points</small>
              </TableCell>
            </TableHead>
            <TableBody>
              {tableData
                ?.sort((a, b) => b.points - a.points)
                .map((team) => {
                  return (
                    <TableRow key={team.id}>
                      <TableCell component="th" scope="row" className="!py-2">
                        {team.name}
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        className="!py-2"
                        align="right"
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
