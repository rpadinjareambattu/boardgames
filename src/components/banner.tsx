"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useCallback } from "react";
import { CircularProgress, Dialog, DialogContent } from "@mui/material";
import { Tournament } from "@/types/tournament";
import { useRouter } from "next/router";

const pages = [
  { text: "matches", tab: "matches" },
  { text: "points table", tab: "table" },
];

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
interface BannerProps {
  tournament?: Tournament;
  loading: boolean;
}
const Banner: React.FC<BannerProps> = ({ tournament, loading }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { tab, game, tournament: tId, ...otherQueries } = router.query;
  const gameInput = React.useRef<HTMLSelectElement>(null);
  useEffect(() => {
    if (!tab && tId) {
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
  }, [tab, otherQueries, router]);
  useEffect(() => {
    let activeItem = tournament?.attributes.games?.data.find(
      (item) => item.id === tournament?.attributes.activeGame?.data.id
    );
    if (activeItem && gameInput.current && !game) {
      gameInput.current.value = activeItem.attributes.name;
      router.push(
        {
          pathname: router.pathname,
          query: { ...router.query, game: activeItem.attributes.name },
        },
        undefined,
        { shallow: true }
      );
    }
    if (!activeItem && gameInput.current && !game) {
      activeItem = tournament?.attributes.games?.data[0];
      if (activeItem) {
        gameInput.current.value = activeItem.attributes.name;
        router.push(
          {
            pathname: router.pathname,
            query: { ...router.query, game: activeItem.attributes.name },
          },
          undefined,
          { shallow: true }
        );
      }
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournament, gameInput.current]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const gameType = event.target.value;
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, game: gameType },
      },
      undefined,
      { shallow: true }
    );
  };
  const handleTabChange = (newTab: string) => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, tab: newTab },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <div className="w-full flex-wrap  flex justify-center">
      <div className="w-full flex justify-center bg-gradient-to-b from-blue-200 to-blue-500">
        <div className="container flex flex-wrap max-w-6xl px-6 pt-5">
          <div className="pr-4">
            <Image
              src={
                tournament?.attributes?.cover.data?.attributes.url
                  ? process.env.NEXT_PUBLIC_UPLOADS +
                    tournament?.attributes.cover.data.attributes.url
                  : "/placeholder.jpg"
              }
              alt="Logo"
              className="max-md:w-16"
              width={100}
              height={100}
              priority
              onClick={handleClickOpen}
            />
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="responsive-dialog-title"
            >
              <Image
                src={
                  tournament?.attributes?.cover.data?.attributes.url
                    ? process.env.NEXT_PUBLIC_UPLOADS +
                      tournament?.attributes.cover.data.attributes.url
                    : "/placeholder.jpg"
                }
                alt="Logo"
                className="dark:invert"
                width={350}
                height={350}
                priority
                objectFit="contain"
              />
            </Dialog>
          </div>
          <div className="flex-auto flex flex-col">
            <h1 className="text-2xl font-mono text-white font-semibold drop-shadow max-md:text-base">
              {tournament?.attributes?.name || "Tournament"}
            </h1>
            <div className="flex-auto">
              <p className="text-base text-white drop-shadow max-md:text-sm">
                <span className="border-r-2 border-blue-300 pr-3 mr-3">
                  {tournament?.attributes?.startDate != null
                    ? tournament?.attributes.startDate +
                      (tournament.attributes.endDate != null
                        ? " to " + tournament.attributes.endDate
                        : " to TBD")
                    : "Date: TBD"}
                </span>
                {tournament?.attributes?.views || "0"} Views
              </p>
            </div>
            {!loading && (
              <select
                onChange={handleChange}
                ref={gameInput}
                name="team"
                defaultValue={game}
                className="bg-gray-50 self-start capitalize border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 inline-block max-md:p-1 mt-1"
              >
                {tournament?.attributes.games?.data.map((t) => (
                  <option key={t.id} value={t.attributes.name}>
                    {t.attributes.name}
                  </option>
                ))}
                {!tournament?.attributes.games?.data.length && (
                  <option value={game}>{game}</option>
                )}
              </select>
            )}
            {loading && <CircularProgress size="2rem" />}
          </div>
          <div className="w-full pt-4">
            <Box>
              {pages.map((page) => (
                <a
                  onClick={() => handleTabChange(page.tab)}
                  key={page.text}
                  className={`${
                    tab === page.tab ? "!font-bold !border-white" : ""
                  } cursor-pointer inline-block uppercase border-blue-700 border-b-2 px-2 py-1 fir bg-blue-700 text-white first-of-type:pl-4 last-of-type:pr-4 first-of-type:rounded-tl-md last-of-type:rounded-tr-md hover:border-white max-md:text-xs`}
                >
                  {page.text}
                </a>
              ))}
            </Box>
          </div>
        </div>
      </div>
      <div className="container flex flex-wrap max-w-6xl px-6 pt-5"></div>
    </div>
  );
};
export default Banner;
