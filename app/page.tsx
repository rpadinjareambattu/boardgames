"use client";
import Image from "next/image";
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
} from "@mui/material";

interface Item {
  data: [
    {
      id: number;
      attributes: {
        name: string;
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
                        name: string;
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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>
      <div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            {data.data.map((round) => (
              <>
                {/* {round.attributes.matches.data.map((match) => (
                  <> */}
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={2}>
                      <strong>{round.attributes.name}</strong>
                    </TableCell>
                    <TableCell align="right">Game point</TableCell>
                    <TableCell align="right">Match point</TableCell>
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
                        <TableCell align="right" className="pv6">
                          {match.attributes.teamA.data.attributes.name} <br />
                          {match.attributes.teamB.data.attributes.name}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* {data.data.map((item) => ( */}
                      {match.attributes.sub_matches.data.map((sMatch) => (
                        <>
                          <TableRow
                            key={round.attributes.name}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {sMatch.attributes.name}
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
                            <TableCell align="right">
                              {round.attributes.name}
                            </TableCell>
                            <TableCell align="right">
                              {round.attributes.name}
                            </TableCell>
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
        <ul>
          {data.data.map((item) => (
            <li key={item.id}>{item.attributes.name}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
