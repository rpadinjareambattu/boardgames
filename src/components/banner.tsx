"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Image from "next/image";
import { useEffect } from "react";
import { CircularProgress, Dialog } from "@mui/material";
import { Tournament } from "@/types/tournament";
import { useRouter } from "next/router";
import { styled } from "@mui/material/styles";
import CustomModal, { CustomModalHandles } from "./customModal";

const tabs = [
  { text: "matches", tab: "matches", hideFor: ["leaderBoard"] },
  { text: "points table", tab: "table", hideFor: ["leaderBoard"] },
  { text: "LeaderBoard", tab: "leaderBoard" },
  { text: "Teams", tab: "teams", hideFor: ["leaderBoard"] },
  { text: "Gallery", tab: "gallery" },
];
// hide select based on tab
const hideSelect = ["gallery", "teams"];

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface BannerProps {
  tournament?: Tournament;
  loading: boolean;
  views: number | string;
}
const Banner: React.FC<BannerProps> = ({ tournament, loading, views }) => {
  const router = useRouter();
  const modalRef = React.useRef<CustomModalHandles>(null);

  const { tab, game, tournament: tId, ...otherQueries } = router.query;
  const gameInput = React.useRef<HTMLSelectElement>(null);
  useEffect(() => {
    if (!tab && tId && tournament?.activeGame?.name) {
      router.replace({
        pathname: router.pathname,
        query: {
          ...router.query,
          tab:
            tournament?.activeGame.name === "leaderBoard"
              ? "leaderBoard"
              : "matches",
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, otherQueries, router]);
  useEffect(() => {
    let activeItem = tournament?.games?.find(
      (item) => item.id === tournament?.activeGame?.id
    );
    if (activeItem && gameInput.current && !game) {
      gameInput.current.value = activeItem.name;
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, game: activeItem.name },
      });
    }
    if (!activeItem && gameInput.current && !game) {
      activeItem = tournament?.games?.[0];
      if (activeItem) {
        gameInput.current.value = activeItem.name;
        router.replace({
          pathname: router.pathname,
          query: { ...router.query, game: activeItem.name },
        });
      }
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournament, gameInput.current, game]);

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenModal = (title: string, description: string) => {
    if (modalRef.current) {
      modalRef.current.openModal(title, description);
    }
  };
  const handleCloseModal = () => {
    if (modalRef.current) {
      modalRef.current.closeModal();
    }
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
    <div className="w-full flex-wrap  flex justify-center mb-5">
      <div className="w-full flex-wrap flex justify-center bg-gradient-to-b from-blue-200 to-blue-500">
        <div className="container flex flex-wrap max-w-6xl px-6 pt-5">
          <div className="pr-4">
            <Image
              src={
                tournament?.cover?.url
                  ? process.env.NEXT_PUBLIC_UPLOADS + tournament?.cover.url
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
                  tournament?.cover?.url
                    ? process.env.NEXT_PUBLIC_UPLOADS + tournament.cover.url
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
              {tournament?.name || "Tournament"}
            </h1>
            <div className="flex-auto">
              <p className="text-base text-white drop-shadow max-md:text-sm">
                <span className="border-r-2 border-blue-300 pr-3 mr-3">
                  {tournament?.startDate != null
                    ? tournament.startDate +
                      (tournament.endDate != null
                        ? " to " + tournament.endDate
                        : " to TBD")
                    : "Date: TBD"}
                </span>
                {views} Views
              </p>
            </div>
            <div>
              {!loading && (
                <select
                  onChange={handleChange}
                  ref={gameInput}
                  name="team"
                  defaultValue={game}
                  disabled={hideSelect.includes(String(tab))}
                  className="bg-gray-50 self-start capitalize border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 inline-block max-md:p-1 mt-1"
                >
                  {tournament?.games?.length &&
                  tournament?.games?.length > 1 ? (
                    <option value="all">All</option>
                  ) : null}

                  {tournament?.games?.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                  {!tournament?.games?.length && (
                    <option value={game}>{game}</option>
                  )}
                </select>
              )}
              {loading && <CircularProgress size="2rem" />}
              <span
                className="cursor-pointer self-start flex-auto ml-5 text-white"
                onClick={() =>
                  handleOpenModal(
                    tournament?.name || "",
                    tournament?.description || ""
                  )
                }
              >
                More Info
              </span>
            </div>
          </div>
        </div>
        <div className="container px-6 max-w-6xl w-full pt-4 whitespace-nowrap overflow-auto min-h-9 max-md:min-h-7">
          <Box>
            {tabs.map((page) => {
              if (page.hideFor?.includes(String(game)) || !game) return null;
              return (
                <a
                  onClick={() => handleTabChange(page.tab)}
                  key={page.text}
                  className={`${
                    tab === page.tab ? "!font-bold !border-white" : ""
                  } cursor-pointer inline-block uppercase border-blue-700 border-b-2 px-2 py-1 fir bg-blue-700 text-white first-of-type:pl-4 last-of-type:pr-4 first-of-type:rounded-tl-md last-of-type:mr-6 last-of-type:rounded-tr-md hover:border-white max-md:text-xs select-none`}
                >
                  {page.text}
                </a>
              );
            })}
          </Box>
        </div>
      </div>
      <CustomModal ref={modalRef} />
    </div>
  );
};
export default Banner;
