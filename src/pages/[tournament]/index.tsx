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
    `v3tournaments/${tournament}?populate[cover][fields][0]=url&populate[games][fields][0]=name&populate[activeGame][fields][0]=name&fields[0]=name&fields[1]=views&fields[2]=startDate&fields[3]=endDate`,
    !!tournament
  );
  const { data: pageView, loading: pageViewLoading } =
    useApiService<PageViewData>(
      `page-views?filters[v3tournament][$eq]=${tournament}`,
      !!tournament
    );
  const { putRequest } = usePutRequest<PageView, TournamentData>({
    url: `page-views/${pageView?.data[0]?.id}`,
    data: {
      data: {
        views: pageView?.data?.length ? +pageView?.data[0]?.views + 1 : 0,
      },
    },
  });
  useEffect(() => {
    // todo
    // && process.env.NODE_ENV === "production"
    if (pageView?.data[0]?.id && !isCalled) {
      putRequest();
      setIsCalled(true);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageView]);

  return (
    <>
      <Header id={tournament ? +tournament : undefined} />
      <Banner
        tournament={!!tournamentData ? tournamentData.data : undefined}
        loading={loading}
        views={pageView?.data[0]?.views || 0}
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
