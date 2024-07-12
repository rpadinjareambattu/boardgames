"use client";
import { Card, CircularProgress } from "@mui/material";
import { ReactElement, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useApiService from "@/service/useApiService";
import { NextPageWithLayout } from "../_app";
import Layout from "@/components/layout";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { TournamentListData } from "@/types/tournament";

const About: NextPageWithLayout = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data, loading, error } = useApiService<TournamentListData>(
    "v3tournaments?populate[media][fields][0]=name&populate[media][fields][1]=url&populate[cover][fields][1]=url"
  );
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
  if (loading)
    return (
      <div className="min-h-screen justify-center items-center flex">
        <CircularProgress color="secondary" />
      </div>
    );
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Head>
        <title>Shraddha Games</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center max-md:text-sm">
        <div className="container flex flex-wrap max-w-6xl px-6">
          <div className="font-mono font-bold from-zinc-200 flex-1 content-center max-md:col my-6">
            Tournaments
          </div>
          {data?.data?.map((el) => {
            return (
              <Card
                key={el.id}
                className="w-full mb-5"
                component={Link}
                href={`/${el.id}`}
              >
                <div className="flex w-full flex-wrap p-5">
                  <div className="pr-4">
                    <Image
                      src={
                        el.cover?.url
                          ? process.env.NEXT_PUBLIC_UPLOADS + el.cover.url
                          : "/placeholder.jpg"
                      }
                      alt="Logo"
                      className="max-md:w-16"
                      width={100}
                      height={100}
                      priority
                    />
                  </div>
                  <div className="flex-auto flex flex-col">
                    <h1 className="text-2xl font-mono  font-semibold drop-shadow max-md:text-base">
                      {el?.name || "Tournament"}
                    </h1>
                    <div className="flex-auto">
                      <p className="text-base  drop-shadow max-md:text-sm">
                        <span className="border-r-2 border-blue-300 pr-3 mr-3">
                          {el.startDate != null
                            ? el.startDate +
                              (el.endDate != null
                                ? " to " + el.endDate
                                : " to TBD")
                            : "Date: TBD"}
                        </span>
                        {el?.views || "0"} Views
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </>
  );
};

About.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default About;
