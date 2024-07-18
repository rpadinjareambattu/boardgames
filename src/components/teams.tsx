"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useEffect } from "react";
import useApiService from "@/service/useApiService";
import { useRouter } from "next/router";
import Head from "next/head";
import { TeamData } from "@/types/team";

interface PageProps {
  name: string;
}

const Team: React.FC<PageProps> = ({ name }) => {
  const router = useRouter();
  const { tournament, tab } = router.query;

  const { data, loading, error } = useApiService<TeamData>(
    "teams" + "?filters[v3tournaments][$eq]=" + tournament,
    true
  );

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
      <main className="flex min-h-screen flex-col items-center max-md:text-sm pb-5">
        <div className="container flex flex-wrap max-w-6xl px-6">
          {loading ? (
            <div className="mt-20 w-full justify-center items-center flex">
              <CircularProgress color="secondary" />
            </div>
          ) : data?.data?.length ? (
            data?.data
              ?.sort((a, b) => a.name.localeCompare(b.name))
              .map(({ name, id }) => (
                <Accordion className="w-full" key={id}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    {name}
                  </AccordionSummary>
                  <AccordionDetails className="!p-0">
                    <PlayerList id={id} />
                  </AccordionDetails>
                </Accordion>
              ))
          ) : (
            "No media found"
          )}
        </div>
      </main>
    </>
  );
};

export default Team;

const PlayerList: React.FC<{ id: number }> = ({ id }) => {
  const { data, loading, error } = useApiService<TeamData>(
    "players?filters[teams][$eq]=" + id,
    !!id
  );

  return (
    <TableContainer component={Paper} className="justify-center flex">
      {!loading && (
        <Table
          sx={{
            width: { xs: "100%", sm: "100%" },
          }}
          aria-label="simple table"
        >
          <TableBody>
            {data?.data
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(({ name, id }) => (
                <TableRow key={id}>
                  <TableCell
                    component="th"
                    scope="row"
                    className="!py-2 !max-w-10"
                  >
                    {name}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};
