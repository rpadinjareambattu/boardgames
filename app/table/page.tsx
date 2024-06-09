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
export default function About() {
  const searchParams = useSearchParams();
  let date = searchParams.get("date") || "";
  const { data, loading, error } = useApiService<Item>(
    "rounds?populate=matches.teamA,matches.teamB,"
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
      <div>
        <code className="font-mono font-bold from-zinc-200 pb-4 pt-8 block">
          Board Game Bonanza Season 2
        </code>
        TBD
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
