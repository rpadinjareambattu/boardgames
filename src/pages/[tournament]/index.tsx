import Banner from "@/components/banner";
import Gallery from "@/components/gallery";
import Header from "@/components/header";
import LeaderBoard from "@/components/leaderBoard";
import Matches from "@/components/matches";
import PointsTable from "@/components/pointsTable";
import Team from "@/components/teams";
import useApiService from "@/service/useApiService";
import usePutRequest from "@/service/usePutRequest";
import { PageView, PageViewData, TournamentData } from "@/types/tournament";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const [isCalled, setIsCalled] = useState<boolean>(false);
  const { tab, tournament } = router.query;

  const { data: tournamentData, loading } = useApiService<TournamentData>(
    `v3tournaments/${tournament}?populate[cover][fields][0]=url&populate[games][fields][0]=name&populate[activeGame][fields][0]=name&fields[0]=name&fields[2]=startDate&fields[3]=endDate&fields[4]=description&populate[page_view][fields][0]=views`,
    !!tournament
  );
  const { putRequest } = usePutRequest<PageView, TournamentData>({
    url: `page-views/${tournamentData?.data.page_view?.id}`,
    data: {
      data: {
        views: tournamentData?.data.page_view?.id
          ? +tournamentData?.data.page_view?.views + 1
          : 0,
      },
    },
  });
  useEffect(() => {
    // todo
    // && process.env.NODE_ENV === "production"
    if (tournamentData?.data.page_view?.id && !isCalled) {
      putRequest();
      setIsCalled(true);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentData]);

  return (
    <>
      <Header id={tournament ? +tournament : undefined} />
      <Banner
        tournament={!!tournamentData ? tournamentData.data : undefined}
        loading={loading}
        views={tournamentData?.data.page_view?.views || "NA"}
      />
      {tab === "matches" && (
        <Matches name={tournamentData?.data?.name || "Tournament"} />
      )}
      {tab === "table" && (
        <PointsTable name={tournamentData?.data?.name || "Tournament"} />
      )}
      {tab === "gallery" && (
        <Gallery name={tournamentData?.data?.name || "Tournament"} />
      )}
      {tab === "teams" && (
        <Team name={tournamentData?.data?.name || "Tournament"} />
      )}
      {tab === "leaderBoard" && (
        <LeaderBoard name={tournamentData?.data?.name || "Tournament"} />
      )}
    </>
  );
};
export default Page;
